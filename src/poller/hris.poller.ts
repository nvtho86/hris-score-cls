import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { KafkaProducer } from '../kafka/kafka.producer';
import { hrisDb } from '../database/hris.db';
import { v4 as uuid } from 'uuid';
import axios from 'axios';


@Injectable()
export class HrisPoller implements OnModuleInit {
  async onModuleInit() {
    await hrisDb.connect();
  }

  constructor(private readonly producer: KafkaProducer) { }

  @Cron('*/30 * 18 * * *') // chạy 30s 1 lần
  async poll() {
    const result = await hrisDb.request().query(`
      SELECT * FROM employees_sync
      WHERE updated_at > DATEADD(second, -30, GETDATE()) 
    `);

    for (const emp of result.recordset) {
      await this.producer.emit('hris.employee.updated', {
        event_id: uuid(),
        event_type: 'EMPLOYEE_UPDATED',
        source: 'HRIS',
        tenant_id: 'tenant_01',
        occurred_at: new Date().toISOString(),
        payload: emp,
      });
    }
  }

  @Cron('*/30 * 18 * * *') // chạy 30s 1 lần , @Cron('0 5 18 * * *') // chạy lúc 18h 1 lần mỗi ngày
  async pollStaff() {
    const result = await hrisDb.request().query(`
      SELECT * FROM Staff
      WHERE ModifiedDate > DATEADD(second, -30, GETDATE())
    `);
    // WHERE ModifiedDate >= DATEADD(day, -1, GETDATE()) chạy lúc 18h mỗi ngày

    for (const emp of result.recordset) {
      await this.producer.emit('hris.staff.updated', {
        event_id: uuid(),
        event_type: 'STAFF_UPDATED',
        source: 'HRIS',
        tenant_id: 'tenant_02',
        occurred_at: new Date().toISOString(),
        payload: emp,
      });
    }
  }

  // @Cron('*/30 * * * * *') // chạy 30s 1 lần , 
  @Cron('0 5 18 * * *') // chạy lúc 18h 1 lần mỗi ngày
  async pollUserScore() {
    const result = await hrisDb.request().query(`
      SELECT * FROM Staff
      WHERE ModifiedDate > DATEADD(second, -30, GETDATE()) ;
    `);
    // WHERE ModifiedDate >= DATEADD(day, -1, GETDATE()) chạy lúc 18h mỗi ngày
    // AND EndDate IS NULL and EndDate >= '2025-01-01'
    const users = result.recordset;

    if (!users.length) {
      console.log('[HRIS] No users to sync');
      return;
    }

    await this.producer.emit('hris.user.updated', {
      event_id: uuid(),
      event_type: 'USER_UPDATED',
      source: 'HRIS',
      tenant_id: 'tenant_02',
      occurred_at: new Date().toISOString(),
      payload: users,
    });
  }

  @Cron('*/30 * * * * *') // chạy 30s 1 lần , @Cron('0 5 18 * * *') // chạy lúc 18h 1 lần mỗi ngày
  async pollCourse() {
    // 1. Call API HRIS
    const apiUrl =
      'https://hr.svtech.com.vn:8302/DataApi/api/Ext/GetListTraineeExternal';

    // 1. Call HRIS API bằng POST
    const response = await axios.post(
      apiUrl,
      null,
      {
        headers: {
          'X-HRIS-Api-Key': process.env.HRIS_API_KEY,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      },
    );

    // 2. Lấy danh sách dữ liệu
    const data = response.data.Result || [];

    // 3. Mapping dữ liệu sang LMS Course
    const courses = data.map((item: any) => ({
      about: item.ClassName || item.About || '',
      code: item.ClassCode,
      formOfStudy: item.TrainFormType ?? 0,
      name: item.ClassName,
      tag: item.Tag || '',
      thumbnail: item.Thumbnail || '',
      topicId: item.TopicId ?? 386,
      videoUrl: item.VideoUrl || '',
      credit: item.Credit ?? 0,
    }));

     // 3. Remove duplicate routes by ClassCode
    const uniqueCourses = [
      ...new Map(courses.map(item => [item.code, item])).values(),
    ];

    await this.producer.emit('hris.course.updated', {
      event_id: uuid(),
      event_type: 'COURSE_UPDATED',
      source: 'HRIS',
      tenant_id: 'tenant_02',
      occurred_at: new Date().toISOString(),
      payload: uniqueCourses,
    });
  }

  @Cron('*/30 * * * * *') // chạy 30s 1 lần , @Cron('0 5 18 * * *') // chạy lúc 18h 1 lần mỗi ngày
  async pollRouteCLS() {

    // 1. Call API HRIS
    const apiUrl =
      'https://hr.svtech.com.vn:8302/DataApi/api/Ext/GetListTraineeExternal';

    // 1. Call HRIS API bằng POST
    const response = await axios.post(
      apiUrl,
      null,
      {
        headers: {
          'X-HRIS-Api-Key': process.env.HRIS_API_KEY,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      },
    );


     const data = response.data.Result || [];

    // 2. Mapping data
    const routes = data.map((item: any) => ({
      Code: item.SubjectCourseCode,
      Name: item.SubjectCourseName,
      TopicName: '',
      StartDate: '',
      EndDate: '',
    }));


    // 3. Remove duplicate routes by ClassCode
    const uniqueRoutes = [
      ...new Map(routes.map(item => [item.Code, item])).values(),
    ];

    // const routes = [{
    //   Code: 'LT_03',
    //   Name: 'Sống tốt mỗi ngày cũng tôi',
    //   TopicName: '',
    //   StartDate: '2021-08-31 12:00:00.0000000',
    //   EndDate: '2027-08-31 12:00:00.0000000',
    // }]

    if (!uniqueRoutes.length) {
      console.log('[HRIS] No users to sync');
      return;
    }

    await this.producer.emit('hris.route.updated', {
      event_id: uuid(),
      event_type: 'ROUTE_UPDATED',
      source: 'HRIS',
      tenant_id: 'tenant_02',
      occurred_at: new Date().toISOString(),
      payload: uniqueRoutes,
    });
  }

  // @Cron('*/30 * * * * *')
  // async poll() {
  //   const rows = await db.find({
  //     sync_status: 'PENDING',
  //   });

  //   for (const row of rows) {
  //     await kafka.emit('hris.employee.updated', buildEvent(row));

  //     await db.markSynced(row.id);
  //   }
  // }

}

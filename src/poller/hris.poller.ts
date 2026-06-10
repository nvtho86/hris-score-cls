import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { KafkaProducer } from '../kafka/kafka.producer';
import { hrisDb } from '../database/hris.db';
import { v4 as uuid } from 'uuid';

@Injectable()
export class HrisPoller implements OnModuleInit {
  async onModuleInit() {
    await hrisDb.connect();
  }

  constructor(private readonly producer: KafkaProducer) { }

  @Cron('*/30 * * * * *') // chạy 30s 1 lần
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

  @Cron('*/30 * * * * *') // chạy 30s 1 lần
  async pollStaff() {
    const result = await hrisDb.request().query(`
      SELECT * FROM Staff
      WHERE ModifiedDate > DATEADD(second, -30, GETDATE())
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

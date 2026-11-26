import { Injectable ,Logger} from '@nestjs/common';
import axios from 'axios';
import { LmsStudentService } from './add.student.service';

@Injectable()
export class LmsCourseService {
  private readonly logger = new Logger(LmsStudentService.name);
  constructor(
          private readonly lmsStudentService: LmsStudentService,
      ) { }


  async upsertCourse(payload: any) {
    try {

      const clsPayload = {
        secretKey: process.env.CLOUDLMS_SECRET_KEY,
        about: payload.about,
        code: payload.code,
        formOfStudy: payload.formOfStudy,
        name: payload.name,
        tag: payload.tag,
        thumbnail: payload.thumbnail,
        topicId: payload.topicId,
        videoUrl: payload.videoUrl,
        credit: payload.credit,
        users:payload.users
      };

      console.log(
        '➡️ Course Request:',
        JSON.stringify(clsPayload, null, 2),
      );

      // 1. Create Course on CLS
      const response = await axios.post(
        'https://eapiv4.cloudlms.top/api/HRM/v5/course/create',
        clsPayload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        },
      );

      console.log('✅ course Response:', response.data);

       // 2. Get CourseId from CLS response
      const courseId = response.data?.data;
      console.log('✅ course courseId:', courseId);

      if (!courseId) {
        this.logger.warn(
          `Course created but cannot find courseId: ${payload.code}`,
        );

        return response.data;
      }
      // 3. Add users to Course
      const listEmail = payload.users || [];

      if (listEmail.length > 0) {
        const result = await this.lmsStudentService.addUsersToCourse(
          Number(courseId),
          listEmail,
        );

        this.logger.log(
          `✅ Add students to Course ${payload.courseId} | CourseId: ${courseId} | Result: ${result}`,
        );
      } else {
        this.logger.warn(
          `Course ${payload.code} has no students`,
        );
      }

      // 4. Return result
      return {
        ...response.data,
        courseId,
      };




    } catch (error) {
      console.error(
        '❌ LMS Error:',
        error.response?.data || error.message,
      );

      throw error;
    }
  }
}
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class LmsCourseService {


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
        credit: payload.credit
      };

      console.log(
        '➡️ Course Request:',
        JSON.stringify(clsPayload, null, 2),
      );


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

      return response.data;
    } catch (error) {
      console.error(
        '❌ LMS Error:',
        error.response?.data || error.message,
      );

      throw error;
    }
  }
}
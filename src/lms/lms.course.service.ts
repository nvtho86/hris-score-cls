import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class LmsCourseService {
  
 
  async upsertCourse(payload: any) {
    try {
     
      const clsPayload = {
        datas: 
          {
            secretKey: '4ad8g95ba4b98ac37a1c71a74sa9a67a',
            about: "string",
            code: "string",
            formOfStudy: 0,
            name: "string",
            tag: "string",
            thumbnail: "string",
            topicId: 0,
            videoUrl: "string",
            credit: 0
            
          },
        
      };

      console.log(
        '➡️ LMS Request:',
        JSON.stringify(clsPayload, null, 2),
      );

      const response = await axios.post(
        // 'https://eapiv4.cloudlms.top/api/HRM/user/add-list',
        'https://eapiv4.cloudlms.top/api/HRM/v5/course/create',
        clsPayload,
      );

      console.log('✅ LMS Response:', response.data);

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
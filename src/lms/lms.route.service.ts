import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class LmsRouteService {
  
 
  async upsertRoute(payload: any) {
    try {
     
      const clsPayload = {
        datas: 
          {
            secretKey: '4ad8g95ba4b98ac37a1c71a74sa9a67a',
            Code: "",
            Name: "",
            TopicName: "",
            StartDate: "",
            EndDate: "",
            
          },
        
      };

      console.log(
        '➡️ LMS Request:',
        JSON.stringify(clsPayload, null, 2),
      );

      const response = await axios.post(
        // 'https://eapiv4.cloudlms.top/api/HRM/user/add-list',
        'https://eapiv4.cloudlms.top/api/Hrm/training-route/add',
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
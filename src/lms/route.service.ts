import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class LmsRouteService {


  async upsertRoute(payload: any) {
    try {

      const clsPayload = {
        SecretKey: process.env.CLOUDLMS_SECRET_KEY,
        Code: payload.Code,
        Name: payload.Name,
        TopicName: payload.TopicName,
        StartDate: payload.StartDate,
        EndDate: payload.EndDate,
      };


      console.log(
        '➡️ LMS route Request:',
        // JSON.stringify(clsPayload, null, 2),
      );

      const response = await axios.post(
        'https://eapiv4.cloudlms.top/api/Hrm/training-route/add',
        clsPayload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        },
      );

      console.log('✅ Route Response:', response.data);

      return response.data;
    } catch (error) {
      console.error(
        '❌ ROUTE Error:',
        error.response?.data || error.message,
      );

      throw error;
    }
  }
}
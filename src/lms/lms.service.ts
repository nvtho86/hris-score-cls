import { Injectable } from '@nestjs/common';
// import axios from 'axios';

@Injectable()
export class LmsService {
  async upsertUser(payload: any) {
    console.log('➡️ Call LMS API:', payload);

    // test trước, chưa call thật
    // await axios.post('https://lms/api/users', payload);
  }
}

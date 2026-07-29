import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ClsApiService {
  constructor(
    private readonly httpService: HttpService,
  ) {}

  async getTrainingResult() {
    const response = await firstValueFrom(
      this.httpService.get(
        process.env.DOMAIN_CLS+'/api/HRM/course/get-list?secretKey='+process.env.SECRET_KEY_CLS,
      ),
    );

    return response.data;
  }

  async getTrainingStudentResult() {
    const response = await firstValueFrom(
      this.httpService.get(
        process.env.DOMAIN_CLS+'/api/HRM/course/get-student-result?id=65536&secretKey='+process.env.SECRET_KEY_CLS,
      ),
    );

    return response.data;
  }
}
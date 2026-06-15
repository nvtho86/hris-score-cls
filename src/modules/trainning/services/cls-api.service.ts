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
        'https://eapiv4.cls.vn/api/HRM/course/get-list?secretKey=f3b7c1e8a94d2f0c6e5b8a1d4c9f27ab',
      ),
    );

    return response.data;
  }
}
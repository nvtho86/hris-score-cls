import { Injectable, HttpException, Logger } from '@nestjs/common';
import axios, { AxiosRequestConfig } from 'axios';

@Injectable()
export class HrisApiService {
  private readonly logger = new Logger(HrisApiService.name);

  private readonly baseUrl = process.env.HRIS_API_URL;
  private readonly apiKey = process.env.HRIS_API_KEY;

  /**
   * Call HRIS API - POST
   * Dùng chung cho tất cả các API HRIS
   *
   * @param endpoint API endpoint
   * @param payload Request body
   * @param config Axios configuration (optional)
   */
  async post<T = any>(
    endpoint: string,
    payload: any = null,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const url = `${this.baseUrl}${endpoint}`;

      const response = await axios.post<T>(
        url,
        payload,
        {
          headers: {
            'X-HRIS-Api-Key': this.apiKey,
            'Content-Type': 'application/json',
            ...config?.headers,
          },
          timeout: config?.timeout ?? 30000,
          ...config,
        },
      );

      return response.data;

    } catch (error) {
      this.logger.error(
        `HRIS API Error: ${endpoint}`,
        error.stack,
      );

      throw new HttpException(
        error.response?.data || error.message,
        error.response?.status || 500,
      );
    }
  }
}


import axios from 'axios';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LmsService {
  private readonly logger = new Logger(LmsService.name);

  private readonly baseUrl = process.env.CLOUDLMS_API_URL;
  private readonly secretKey = process.env.CLOUDLMS_SECRET_KEY;

  /**
   * Get Common Topic by TypeId
   *
   * @param typeId Topic type ID
   * @param sort Sort order: name_asc | name_desc
   * @param keyword Search topic by keyword
   */
  async getCommonTopic(
    typeId: number,
    sort: string = 'name_asc',
    keyword?: string,
  ): Promise<any> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/api/HRM/topic-by-typeId`,
        {
          params: {
            secretKey: this.secretKey,
            typeId,
            sort,
            ...(keyword ? { keyword } : {}),
          },
          headers: {
            Accept: 'text/plain',
          },
          timeout: 30000,
        },
      );

      this.logger.log(
        `Get Common Topic successfully - typeId: ${typeId}`,
      );

      return response.data;

    } catch (error) {
      this.logger.error(
        `Get Common Topic failed - typeId: ${typeId}`,
        error.response?.data || error.message,
      );

      throw error;
    }
  }
}
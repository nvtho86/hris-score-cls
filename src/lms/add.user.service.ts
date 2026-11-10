import axios from 'axios';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LmsService {
  private readonly logger = new Logger(LmsService.name);

  private readonly baseUrl = process.env.DOMAIN_CLS_TEST;
  private readonly secretKey = process.env.CLOUDLMS_SECRET_KEY;

  /**
   * Add list users to CLS course
   *
   * @param courseId CLS internal course ID
   * @param listEmail List of student emails
   */
  async addUsersToCourse(
    courseId: number,
    listEmail: string[],
  ): Promise<boolean> {
    try {
      // 1. Validate input
      const emails = [
        ...new Set(
          listEmail
            .filter(Boolean)
            .map(email => email.trim().toLowerCase()),
        ),
      ];

      if (!courseId || emails.length === 0) {
        throw new Error('CourseId or listEmail is invalid');
      }

      // 2. Prepare payload
      const payload = {
        secretKey: this.secretKey,
        courseId,
        listEmail: emails,
      };

      // 3. Call CLS API
      const response = await axios.post(
        `${this.baseUrl}/api/HRM/course/add-list-user`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        },
      );

      // 4. Check response
      const result = response.data?.data === true;

      this.logger.log(
        `Add users to course ${courseId}: ${result ? 'SUCCESS' : 'FAILED'}`,
      );

      return result;

    } catch (error) {
      this.logger.error(
        `Add users to course ${courseId} failed`,
        error.response?.data || error.message,
      );

      throw error;
    }
  }
}
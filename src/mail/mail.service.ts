import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { buildSyncMail } from './mail.template';

@Injectable()
export class MailService {

  constructor(
    private readonly mailerService: MailerService,
  ) {}

  async sendSyncMail(data: {
    users: any;
    system: string;
    total: number;
    success: number;
    to: string[];
    cc: string[];
    failed: number;
    errors: any[];
  }) {

    const html = buildSyncMail(data);

    await this.mailerService.sendMail({

      from: process.env.MAIL_FROM,
      to: data.to,
      cc: data.cc,
      subject: `[${data.system}] HRIS Synchronization Result`,

      html,

    });

  }

}
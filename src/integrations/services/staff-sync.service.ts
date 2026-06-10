import {
  Injectable,
  OnModuleInit
} from '@nestjs/common';

import { Cron } from '@nestjs/schedule';

import { v4 as uuid } from 'uuid';

import { hrisDb }
from '../../database/hris.db';

import { KafkaProducer }
// from '../../../kafka/kafka.producer';
from '../../kafka/kafka.producer';

@Injectable()
export class StaffSyncService
implements OnModuleInit {

  constructor(
    private readonly producer: KafkaProducer,
  ) {}

  async onModuleInit() {

    await hrisDb.connect();

    console.log(
      'HRIS PostgreSQL Connected'
    );
  }

  @Cron('*/30 * * * * *')
  async syncStaff() {

    const result =
      await hrisDb.query(`
        SELECT *
        FROM Staff
        WHERE ModifiedDate >
              NOW() - INTERVAL '30 seconds'
      `);

    for (const staff of result.rows) {

      await this.producer.emit(
        'hris.staff.updated',
        {
          eventId: uuid(),

          eventType:
            'STAFF_UPDATED',

          source:
            'HRIS',

          occurredAt:
            new Date().toISOString(),

          payload: {

            id:
              staff.ID,

            code:
              staff.Code,

            full_name:
              staff.FullName,

            branch:
              staff.Branch,

            department:
              staff.Department,

            team:
              staff.Team,

            job_title:
              staff.JobTitle,

            level:
              staff.Level,

            manager_code:
              staff.ManagerCode,

            manager_name:
              staff.ManagerName,

            start_date:
              staff.StartDate,

            end_date:
              staff.EndDate,

            email:
              staff.Email,

            created_at:
              staff.CreatedAt,

            updated_at:
              staff.UpdatedAt,

            modified_date:
              staff.ModifiedDate,
          },
        },
      );
    }
  }
}
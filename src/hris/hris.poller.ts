import {
  Injectable,
  OnModuleInit,
} from '@nestjs/common';

import { Cron } from '@nestjs/schedule';

import { KafkaProducer }
from '../kafka/kafka.producer';

import { hrisDb }
from '../database/hris.db';

import { v4 as uuid }
from 'uuid';

@Injectable()
export class HrisPoller
implements OnModuleInit {

  constructor(
    private readonly producer: KafkaProducer,
  ) {}

  async onModuleInit() {

    await hrisDb.connect();

    console.log('Postgres Connected');
  }

  @Cron('*/30 * * * * *')
  async pollStaff() {

    const checkpoint =
      await hrisDb.query(`
        SELECT last_sync_time
        FROM sync_checkpoint
        WHERE sync_name='staff_sync'
      `);

    const lastSync =
      checkpoint.rows[0].last_sync_time;

    const result =
      await hrisDb.query(
        `
        SELECT *
        FROM staff
        WHERE modified_date > $1
        ORDER BY modified_date
      `,
        [lastSync],
      );

    for (const emp of result.rows) {

      await this.producer.emit(
        'hris.staff.updated',
        {
          event_id: uuid(),

          event_type:
            'STAFF_UPDATED',

          source: 'HRIS',

          occurred_at:
            new Date().toISOString(),

          payload: emp,
        },
      );
    }

    if (result.rows.length > 0) {

      const latest =
        result.rows[
          result.rows.length - 1
        ].modified_date;

      await hrisDb.query(
        `
        UPDATE sync_checkpoint
        SET last_sync_time=$1
        WHERE sync_name='staff_sync'
      `,
        [latest],
      );
    }
  }
}
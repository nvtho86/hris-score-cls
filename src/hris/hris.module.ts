import { Module } from '@nestjs/common';

import { HrisPoller }
from '../poller/hris-staff.poller';

import { KafkaModule }
from '../kafka/kafka.module';

@Module({
  imports: [
    KafkaModule,
  ],
  providers: [
    HrisPoller,
  ],
})
export class HrisModule {}
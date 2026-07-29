import {
  Injectable,
} from '@nestjs/common';

import { Cron } from '@nestjs/schedule';

import { ClsApiService } from '../services/cls-api.service';

import { KafkaProducer } from '../../../kafka/kafka.producer';

@Injectable()
export class TrainingSyncJob {

  constructor(
    private readonly clsApiService: ClsApiService,

    private readonly kafkaProducer: KafkaProducer,
  ) {}

  @Cron('0 0 18 06 * *')
  // @Cron('*/30 * * * * *')
  async syncTrainingData() {

    const result =
      await this.clsApiService.getTrainingStudentResult();
     

    for (const item of result.data) {
      await this.kafkaProducer.emit(
        'training.class-result.created',
        {
          payload: item,
        },
      );

    }

    console.log(
      `Published ${result.data.length} records`,
    );
  }
}
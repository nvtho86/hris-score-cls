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
  async syncTrainingData() {

    const data =
      await this.clsApiService.getTrainingResult();

    for (const item of data) {
      console.log('-------------------------------------')
      console.log(item)
      console.log('-------------------------------------')
      await this.kafkaProducer.emit(
        'training.class-result.created',
        {
          payload: item,
        },
      );

    }

    console.log(
      `Published ${data.length} records`,
    );
  }
}
import {
  Controller,
} from '@nestjs/common';

import {
  MessagePattern,
  Payload,
} from '@nestjs/microservices';

import { TrainingService } from '../../modules/trainning/services/training.service';

@Controller()
export class TrainingConsumer {
  constructor(
    private readonly trainingService: TrainingService,
  ) {}

  @MessagePattern(
    'training.class-result.created',
  )
  async consume(
    @Payload()
    payload: any,
  ) {
    await this.trainingService.upsertResult(
      payload,
    );
  }
}
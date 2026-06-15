import { Injectable } from '@nestjs/common';

import { KafkaProducer } from '../../kafka/kafka.producer';

@Injectable()
export class TrainingProducer {
  constructor(
    private readonly kafkaProducer: KafkaProducer,
  ) {}

  async publish(data: any) {
    await this.kafkaProducer.emit(
      'training.class-result.created',
      data,
    );
  }
}
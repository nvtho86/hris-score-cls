import { Module } from '@nestjs/common';

import { HttpModule } from '@nestjs/axios';

import { TypeOrmModule } from '@nestjs/typeorm';

import { TrainingClassResult } from './entities/training-class-result.entity';

import { ClsApiService } from './services/cls-api.service';

import { TrainingService } from './services/training.service';

import { TrainingProducer } from '../../kafka/producers/training.producer';

import { TrainingConsumer } from '../../kafka/consumers/training.consumer';

import { TrainingSyncJob } from './jobs/training-sync.job';

import { KafkaProducer } from '../../kafka/kafka.producer';

@Module({
  imports: [
    HttpModule,

    TypeOrmModule.forFeature([
      TrainingClassResult,
    ]),
  ],

  controllers: [
    TrainingConsumer,
  ],

  providers: [
    ClsApiService,
    TrainingService,
    TrainingProducer,
    TrainingSyncJob,
    KafkaProducer
  ],
})
export class TrainingModule {}
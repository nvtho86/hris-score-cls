import { Module } from '@nestjs/common';
import { TrainingsService } from './trainings.service';

@Module({
  providers: [TrainingsService]
})
export class TrainingsModule {}

import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { TrainingClassResult } from '../entities/training-class-result.entity';

@Injectable()
export class TrainingService {
  constructor(
    @InjectRepository(
      TrainingClassResult,
    )
    private readonly repository: Repository<TrainingClassResult>,
  ) {}

  async upsertResult(
    data: any,
  ) {
    const existing =
      await this.repository.findOne({
        where: {
          employeeCode:
            data.employeeCode,
          classCode:
            data.classCode,
        },
      });

    if (existing) {
      await this.repository.update(
        existing.id,
        {
          actualLearningHours:
            data.actualLearningHours,

          testScore:
            data.testScore,

          surveyScore:
            data.surveyScore,

          completionPercent:
            data.completionPercent,

          actualDate:
            data.actualDate,
        },
      );

      return;
    }

    await this.repository.save({
      employeeCode:
        data.employeeCode,

      classCode:
        data.classCode,

      actualLearningHours:
        data.actualLearningHours,

      testScore:
        data.testScore,

      surveyScore:
        data.surveyScore,

      completionPercent:
        data.completionPercent,

      actualDate:
        data.actualDate,
    });
  }
}
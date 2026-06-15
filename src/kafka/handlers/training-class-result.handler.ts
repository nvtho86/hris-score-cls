import { crmDb } from '../../database/crm.db';
import { TrainingClassResult } from '../../modules/trainning/entities/training-class-result.entity';

export async function handleTrainingClassResult(
  event: any,
) {
  const repository =
    crmDb.getRepository(
      TrainingClassResult,
    );

  const payload = event.payload;

  const existing =
    await repository.findOne({
      where: {
        employeeCode:
          payload.employeeCode,
        classCode:
          payload.classCode,
      },
    });

  if (existing) {
    await repository.update(
      existing.id,
      {
        actualLearningHours:
          payload.actualLearningHours,

        testScore:
          payload.testScore,

        surveyScore:
          payload.surveyScore,

        completionPercent:
          payload.completionPercent,

        actualDate:
          payload.actualDate,
      },
    );

    console.log(
      'Update Training Success',
    );

    return;
  }

  await repository.save(payload);

  console.log(
    'Insert Training Success',
  );
}
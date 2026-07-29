import { hrisDb } from '../../database/hris.db';
import * as sql from 'mssql';

export async function handleTrainingClassResult(
  event: any,
) {
  const item = event.payload;

  const pool = await hrisDb.connect();

  const exists = await pool
    .request()
    .input(
      'employeeCode',
      sql.NVarChar,
      item.userName,
    )
    .input(
      'classCode',
      sql.NVarChar,
      item.userCode,
    )
    .query(`
      SELECT TOP 1 1
      FROM TrainingClassResult
      WHERE EmployeeCode = @employeeCode
      AND ClassCode = @classCode
    `);

  if (exists.recordset.length > 0) {
    await pool
      .request()
      .input(
        'employeeCode',
        sql.NVarChar,
        item.userName,
      )
      .input(
        'classCode',
        sql.NVarChar,
        item.userCode,
      )
      .input(
        'actualLearningHours',
        sql.Decimal(18, 2),
        5.0,
      )
      .input(
        'testScore',
        sql.Decimal(18, 2),
        5.0,
      )
      .input(
        'surveyScore',
        sql.Decimal(18, 2),
        4.6,
      )
      .input(
        'completionPercent',
        sql.Decimal(18, 2),
        item.progress,
      )
      .input(
        'actualDate',
        sql.DateTime,
        item.startDate,
      )
      .query(`
        UPDATE TrainingClassResult
        SET
          ActualLearningHours = @actualLearningHours,
          TestScore = @testScore,
          SurveyScore = @surveyScore,
          CompletionPercent = @completionPercent,
          ActualDate = @actualDate,
          ModifiedDate = GETDATE()
        WHERE EmployeeCode = @employeeCode
        AND ClassCode = @classCode
      `);

    console.log(
      `Training updated: ${item.userName}`,
    );

    return;
  }

  await pool
    .request()
    .input(
      'employeeCode',
      sql.NVarChar,
      item.userName,
    )
    .input(
      'classCode',
      sql.NVarChar,
      item.userCode,
    )
    .input(
      'actualLearningHours',
      sql.Decimal(18, 2),
      5.0,
    )
    .input(
      'testScore',
      sql.Decimal(18, 2),
      5.0,
    )
    .input(
      'surveyScore',
      sql.Decimal(18, 2),
      4.6,
    )
    .input(
      'completionPercent',
      sql.Decimal(18, 2),
      item.progress,
    )
    .input(
      'actualDate',
      sql.DateTime,
      item.startDate,
    )
    .query(`
      INSERT INTO TrainingClassResult
      (
        EmployeeCode,
        ClassCode,
        ActualLearningHours,
        TestScore,
        SurveyScore,
        CompletionPercent,
        ActualDate,
        ModifiedDate
      )
      VALUES
      (
        @employeeCode,
        @classCode,
        @actualLearningHours,
        @testScore,
        @surveyScore,
        @completionPercent,
        @actualDate,
        GETDATE()
      )
    `);

  console.log(
    `Training inserted: ${item.userName}`,
  );
}
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('TrainingClassResult')
export class TrainingClassResult {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  employeeCode: string;

  @Column()
  classCode: string;

  @Column({
    type: 'decimal',
    nullable: true,
  })
  actualLearningHours: number;

  @Column({
    type: 'decimal',
    nullable: true,
  })
  testScore: number;

  @Column({
    type: 'decimal',
    nullable: true,
  })
  surveyScore: number;

  @Column({
    type: 'decimal',
    nullable: true,
  })
  completionPercent: number;

  @Column({
    nullable: true,
  })
  actualDate: Date;
}
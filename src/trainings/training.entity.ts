import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Course } from '../courses/course.entity';
import { User } from '../users/user.entity';

@Entity('trainings')
export class Training {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Course, course => course.trainings)
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @ManyToOne(() => User, user => user.trainingsTeaching)
  @JoinColumn({ name: 'trainer_id' })
  trainer: User;

  @Column({ type: 'datetime2', name: 'start_date' })
  startDate: Date;

  @Column({ type: 'datetime2', name: 'end_date' })
  endDate: Date;

  @CreateDateColumn({ type: 'datetime2' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime2' })
  updated_at: Date;
}

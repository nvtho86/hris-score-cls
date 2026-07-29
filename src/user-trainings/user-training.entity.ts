import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Training } from '../trainings/training.entity';
import { User } from '../users/user.entity';

@Entity('user_trainings')
export class UserTraining { // Renamed to UserTraining for clarity
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Training)
  @JoinColumn({ name: 'training_id' })
  training: Training;

  @Column()
  status: string;

  @Column('float', { nullable: true })
  score: number;

  @Column({ type: 'timestamp', nullable: true }) // Explicitly stating type
  completedAt: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
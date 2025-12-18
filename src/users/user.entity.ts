import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Group } from '../groups/group.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  code: string;

  @Column({ unique: true, length: 50 })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ length: 50 })
  first_name: string;

  @Column({ length: 50 })
  last_name: string;

  @Column({ type: 'date', nullable: true })
  birthday: Date;

  @Column({ length: 10, nullable: true })
  gender: string;

  @Column({ length: 20, nullable: true })
  phone_number: string;

  @Column({ type: 'date', nullable: true })
  employment_date: Date;

  @Column({ type: 'date', nullable: true })
  quit_job_date: Date;

  @Column({ length: 20 })
  user_type: 'STUDENT' | 'TRAINER' | 'ADMIN';

  @Column({ default: 1 })
  status_id: number;

  @Column({ default: false })
  is_assign_course: boolean;

  @Column({ default: false })
  is_assign_training: boolean;

  @Column({ nullable: true })
  sync_id: string;

  @Column({ type: 'simple-json', nullable: true })
  title_custom_codes: string[];

  @ManyToMany(() => Group)
  @JoinTable({
    name: 'user_groups',
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: { name: 'group_id' },
  })
  groups: Group[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @CreateDateColumn()
  deleted_at: Date;

}

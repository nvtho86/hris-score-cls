import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';
import { UserGroup } from '../user-group/user-group.entity';
import { Course } from '../courses/course.entity';
import { UserOrganization } from '../user-organization/user-organization.entity';
import { Training } from '../trainings/training.entity';

@Entity('users')
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  code: string;

  @Column({ unique: true, length: 50 })
  username: string;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column({ length: 255 })
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

  @OneToMany(() => UserGroup, ug => ug.user)
  userGroups: UserGroup[];

  @OneToMany(() => UserOrganization, uo => uo.user)
  organizations: UserOrganization[];

  @OneToMany(() => Course, course => course.owner)
  ownedCourses: Course[];

  @OneToMany(() => Training, training => training.trainer)
  trainingsTeaching: Training[];

  @CreateDateColumn({ type: 'datetime2' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime2' })
  updated_at: Date;

  @Column({ type: 'datetime2', nullable: true })
  deleted_at: Date;
}


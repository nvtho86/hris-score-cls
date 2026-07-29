<!-- import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Title } from '../titles/title.entity';
import { OrganizationStructure } from '../organization-structure/organization-structure.entity';

@Entity('user_organizations')
export class UserOrganization {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => OrganizationStructure)
  @JoinColumn({ name: 'organization_id' })
  organization: OrganizationStructure;

  @ManyToOne(() => Title)
  @JoinColumn({ name: 'title_id' })
  title: Title;

  @Column({ default: false })
  is_owner: boolean;

  @Column({ default: false })
  is_primary: boolean;

  @Column({ type: 'date', nullable: true })
  start_date: Date;

  @Column({ type: 'date', nullable: true })
  end_date: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

--------------------------------------------------------------------

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Group } from '../groups/group.entity';
@Entity('user_groups')
export class UserGroup  {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  code: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Group)
  @JoinColumn({ name: 'group_id' })
  group: Group;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}


--------------------------------------------------------------------

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

  /** Thuộc khóa học nào */
  @ManyToOne(() => Course, course => course.trainings)
  @JoinColumn({ name: 'course_id' })
  course: Course;

  /** Giảng viên */
  @ManyToOne(() => User, user => user.trainingsTeaching)
  @JoinColumn({ name: 'trainer_id' })
  trainer: User;

  @Column({ type: 'datetime2', name: 'start_date' })
  startDate: Date;

  @Column({ type: 'datetime2', name: 'end_date' })
  endDate: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

--------------------------------------------------------------------
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';


@Entity('titles')
export class Title {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  code: string;

  @Column({ length: 255 })
  name: string;
  
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

--------------------------------------------------------------------
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('groups')
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  code: string;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @CreateDateColumn()
  deleted_at: Date;

}

--------------------------------------------------------------------

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';

@Entity('organization_structure')
export class OrganizationStructure   {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => OrganizationStructure, org => org.children, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent: OrganizationStructure;

  @OneToMany(() => OrganizationStructure, org => org.parent) // Make sure this points to the right property
  children: OrganizationStructure[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

--------------------------------------------------------------------

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
import { Group } from '../groups/group.entity';
import { Course } from '../courses/course.entity';
import { Training } from '../trainings/training.entity';


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


  @OneToMany(() => Course, course => course.owner)
  ownedCourses: Course[];

  @OneToMany(() => Training, training => training.trainer)
  trainingsTeaching: Training[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @CreateDateColumn()
  deleted_at: Date;

} -->

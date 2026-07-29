import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserGroup } from '../user-group/user-group.entity';

@Entity('groups')
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

  @OneToMany(() => UserGroup, ug => ug.group)
  userGroups: UserGroup[];

  @CreateDateColumn({ type: 'datetime2' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime2' })
  updated_at: Date;

  @Column({ type: 'datetime2', nullable: true })
  deleted_at: Date;
}

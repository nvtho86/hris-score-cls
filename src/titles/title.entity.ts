import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Organization } from '../organizations/organization.entity';
import { UserOrganization } from '../user-organization/user-organization.controller.entity';

@Entity('titles')
export class Title {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  code: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => Organization, (org) => org.titles)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column({ default: 1 })
  level: number;

  @Column({ default: false })
  is_manager: boolean;

  @Column({ default: true })
  is_active: boolean;

  @OneToMany(() => UserOrganization, (uo) => uo.title)
  userOrganizations: UserOrganization[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}


// INSERT INTO titles (code, name, organization_id, level, is_manager)
// VALUES
// ('DEV', 'Developer', 1, 1, 0),
// ('LEAD', 'Team Leader', 1, 2, 1),
// ('HR', 'HR Manager', 2, 3, 1),
// ('TRAINER', 'Trainer', 3, 2, 1);

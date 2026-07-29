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

  @CreateDateColumn({ type: 'datetime2' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime2' })
  updated_at: Date;
}



// {
//   "userId": 1,
//   "organizations": [
//     {
//       "organization": "IT Department",
//       "title": "Backend Developer",
//       "isOwner": false,
//       "isPrimary": true
//     },
//     {
//       "organization": "Training Center",
//       "title": "Trainer",
//       "isOwner": true
//     }
//   ]
// }

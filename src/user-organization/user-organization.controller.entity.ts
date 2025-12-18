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
import { Organization } from '../organizations/organization.entity';
import { Title } from '../titles/title.entity';

@Entity('user_organizations')
export class UserOrganization {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

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

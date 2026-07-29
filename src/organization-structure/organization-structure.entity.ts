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
import {UserOrganization} from '../user-organization/user-organization.entity'
@Entity('organization_structures')
export class OrganizationStructure {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @ManyToOne(() => OrganizationStructure, org => org.children, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent: OrganizationStructure;

  @OneToMany(() => OrganizationStructure, org => org.parent)
  children: OrganizationStructure[];

  @OneToMany(() => UserOrganization, uo => uo.organization)
  users: UserOrganization[];

  @CreateDateColumn({ type: 'datetime2' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime2' })
  updated_at: Date;
}

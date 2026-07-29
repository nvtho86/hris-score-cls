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

  @CreateDateColumn({ type: 'datetime2' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime2' })
  updated_at: Date;
}


// INSERT INTO titles (code, name, organization_id, level, is_manager)
// VALUES
// ('DEV', 'Developer', 1, 1, 0),
// ('LEAD', 'Team Leader', 1, 2, 1),
// ('HR', 'HR Manager', 2, 3, 1),
// ('TRAINER', 'Trainer', 3, 2, 1);

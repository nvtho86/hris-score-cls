import { Entity, Column, PrimaryGeneratedColumn, OneToMany  } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('groups')
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  name: string;

  @OneToMany(() => User, (user) => user.group)
  users: User[];
}
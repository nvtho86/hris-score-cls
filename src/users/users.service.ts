import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  findByUsername(username: string) {
    return this.userRepo.findOne({
      where: { username },
      relations: ['group'],
    });
  }

  async create(user: Partial<User>) {
    return this.userRepo.save(user);
  }
}

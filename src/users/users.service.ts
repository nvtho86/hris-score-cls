import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User } from './user.entity';
import { UserQueryDto } from './user-query.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) { }

  findByUsername(username: string) {
    return this.userRepo.findOne({
      where: { username }
    });
  }

  async create(user: Partial<User>) {
    return this.userRepo.save(user);
  }

  async findAll(query: UserQueryDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;

    const qb = this.userRepo
      .createQueryBuilder('u');

    if (query.search) {
      qb.andWhere(
        `
      u.username LIKE :search
      OR u.last_name LIKE :search
      OR u.first_name LIKE :search
      OR u.email LIKE :search
      `,
        {
          search: `%${query.search}%`,
        },
      );
    }

    qb.orderBy('u.id', 'DESC');

    const [data, total] =
      await qb
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

    return {
      total,
      page,
      limit,
      data,
    };
  }
}

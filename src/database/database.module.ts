import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Group } from '../groups/group.entity';
import { Organization } from '../organizations/organization.entity';
console.log('DB_HOST:', process.env.DB_HOST);
@Module({
  imports: [
    TypeOrmModule.forRoot({
      // type: 'mssql',
      // host: process.env.DB_HOST,
      // port: Number(process.env.DB_PORT),
      // username: process.env.DB_USER,
      // password: process.env.DB_PASS,
      // database: process.env.DB_NAME,

       type: 'postgres',
      host: '192.168.37.11',
      port: 30100,
      username: 'postgres',
      password: 'postgres',
      database: 'hris_score',

      entities: [User, Group, Organization],
      synchronize: false, // 🔥 TẮT
    }),
  ],
})
export class DatabaseModule { }

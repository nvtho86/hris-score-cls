import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Group } from '../groups/group.entity';
import { OrganizationStructure } from '../organization-structure/organization-structure.entity';
import { Title } from '../titles/title.entity';
import { Training } from '../trainings/training.entity';
import { Course } from '../courses/course.entity';
import { UserGroup } from '../user-group/user-group.entity';
import { UserOrganization } from '../user-organization/user-organization.entity';
import { UserTraining } from '../user-trainings/user-training.entity';
import * as dotenv from 'dotenv';
dotenv.config();
console.log('----------------------------------------------')
console.log(process.env.DB_HOST)
console.log('----------------------------------------------')
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      extra: {
        trustServerCertificate: true, // Chấp nhận chứng chỉ tự ký (self-signed)
        Encrypt: true,                // Thường đi kèm với việc bật mã hóa
      },

      // type: 'postgres',
      // host: '192.168.37.11',
      // port: 30100,
      // username: 'postgres',
      // password: 'postgres',
      // database: 'hris_score',

      entities: [
        User,
        Group,
        OrganizationStructure,
        Title,
        Course,          // 🔥 BẮT BUỘC
        Training,
        UserGroup,
        UserOrganization,
        UserTraining
      ],
      synchronize: false, // 🔥 TẮT
    }),
  ],
})
export class DatabaseModule { }

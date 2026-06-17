import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Group } from '../groups/group.entity';
import { Organization } from '../organizations/organization.entity';
import * as dotenv from 'dotenv';
dotenv.config();
console.log('DB_HOST_HRIS:', process.env.DB_PORT_HRIS);
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: process.env.DB_HOST_HRIS,
      port: Number(process.env.DB_PORT_HRIS),
      username: process.env.DB_USER_HRIS,
      password: process.env.DB_PASS_HRIS,
      database: process.env.DB_NAME_HRIS,
      extra: {
        trustServerCertificate: true, // Chấp nhận chứng chỉ tự ký (self-signed)
        Encrypt: true,                // Thường đi kèm với việc bật mã hóas
      },

      // type: 'postgres',
      // host: '192.168.37.11',
      // port: 30100,
      // username: 'postgres',
      // password: 'postgres',
      // database: 'hris_score',

      entities: [User, Group, Organization],
      synchronize: false, // 🔥 TẮT
    }),
  ],
})
export class DatabaseModule { }

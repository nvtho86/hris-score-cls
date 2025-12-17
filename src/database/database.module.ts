import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Group } from '../groups/group.entity';
import { Organization } from '../organizations/organization.entity';
console.log('DB_HOST:', process.env.DB_HOST);
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mssql', //'mssql',
      host: '192.168.37.58', //process.env.DB_HOST,
      port: 1433, //Number(process.env.DB_PORT),
      username: 'sa', //process.env.DB_USER,
      password: 'SupportHRIS@2025', //process.env.DB_PASS,
      database: 'HRIS_SCORE', //process.env.DB_NAME,
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

      entities: [User, Group, Organization],
      synchronize: false, // 🔥 TẮT
    }),
  ],
})
export class DatabaseModule { }

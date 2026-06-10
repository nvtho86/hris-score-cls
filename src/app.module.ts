import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_GUARD } from '@nestjs/core';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

import { kafkaConfig } from './config/kafka.config';
import { ClientsModule } from '@nestjs/microservices';
import { EmployeeConsumer } from './employee.consumer';
import { HrisEventPublisher } from './hris.publisher';

import { ScheduleModule } from '@nestjs/schedule';
import { KafkaProducer } from './kafka/kafka.producer';
import { KafkaConsumer } from './kafka/kafka.consumer';
import { HrisPoller } from './poller/hris.poller';
import { HrisModule } from './hris/hris.module';

@Module({
  imports: [
    DatabaseModule,   // 🔥 CHỈ 1 NƠI CONFIG DB
    UsersModule,
    AuthModule,
    HrisModule,
    ScheduleModule.forRoot(), // ✅ CHỈ MODULE
    ClientsModule.register([
      {
        name: 'KAFKA_CLIENT',
        ...kafkaConfig,
      },
    ]),

  ],
  controllers: [AppController, HrisModule, EmployeeConsumer], // 🔥 CHỈ AppController
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // 🔥 TOÀN HỆ THỐNG CẦN LOGIN
    },

    HrisEventPublisher,
    KafkaProducer,
    KafkaConsumer,
    HrisPoller,
  ],
})
export class AppModule { }

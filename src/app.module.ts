import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_GUARD } from '@nestjs/core';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { GroupsModule } from './groups/groups.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { UserOrganizationController } from './user-organization/user-organization.controller';
import { TitlesController } from './titles/titles.controller';
import { UserGroupService } from './user-group/user-group.service';
import { OrganizationStructureService } from './organization-structure/organization-structure.service';
import { CoursesService } from './courses/courses.service';
import { TrainingsModule } from './trainings/trainings.module';
import { UserTrainingsService } from './user-trainings/user-trainings.service';
import { kafkaConfig } from './config/kafka.config';
import { ClientsModule } from '@nestjs/microservices';
import { EmployeeConsumer } from './employee.consumer';
import { HrisEventPublisher } from './hris.publisher';

import { ScheduleModule } from '@nestjs/schedule';
import { KafkaProducer } from './kafka/kafka.producer';
import { KafkaConsumer } from './kafka/kafka.consumer';
import { HrisPoller } from './poller/hris.poller';
import { LmsService } from './lms/lms.service';

@Module({
  imports: [
    DatabaseModule,   // 🔥 CHỈ 1 NƠI CONFIG DB
    UsersModule,
    AuthModule,
    GroupsModule,
    TrainingsModule,
    ScheduleModule.forRoot(), // ✅ CHỈ MODULE
    ClientsModule.register([
      {
        name: 'KAFKA_CLIENT',
        ...kafkaConfig,
      },
    ]),

  ],
  controllers: [AppController, UserOrganizationController, TitlesController, EmployeeConsumer], // 🔥 CHỈ AppController
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // 🔥 TOÀN HỆ THỐNG CẦN LOGIN
    },
    UserGroupService,
    OrganizationStructureService,
    CoursesService,
    UserTrainingsService,
    HrisEventPublisher,
    KafkaProducer,
    KafkaConsumer,
    HrisPoller,
    LmsService,
  ],
})
export class AppModule { }

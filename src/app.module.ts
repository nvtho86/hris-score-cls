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

@Module({
  imports: [
    DatabaseModule,   // 🔥 CHỈ 1 NƠI CONFIG DB
    UsersModule,
    AuthModule,
    GroupsModule,
    TrainingsModule,
    // OrganizationsModule,
    // CoursesModule,
    // LessonsModule,
    // EnrollmentsModule,
  ],
  controllers: [AppController, UserOrganizationController, TitlesController], // 🔥 CHỈ AppController
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // 🔥 TOÀN HỆ THỐNG CẦN LOGIN
    },
    UserGroupService,
    OrganizationStructureService,
    CoursesService,
    UserTrainingsService
  ],
})
export class AppModule { }

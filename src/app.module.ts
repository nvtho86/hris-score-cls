import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_GUARD } from '@nestjs/core';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { GroupsModule } from './groups/groups.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
// import { OrganizationsModule } from './organizations/organizations.module';
// import { CoursesModule } from './courses/courses.module';
// import { LessonsModule } from './lessons/lessons.module';
// import { EnrollmentsModule } from './enrollments/enrollments.module';
import { UserOrganizationController } from './user-organization/user-organization.controller';
import { TitleController } from './title/title.controller';
import { TitlesController } from './titles/titles.controller';

@Module({
  imports: [
    DatabaseModule,   // 🔥 CHỈ 1 NƠI CONFIG DB
    UsersModule,
    AuthModule,
    GroupsModule,
    // OrganizationsModule,
    // CoursesModule,
    // LessonsModule,
    // EnrollmentsModule,
  ],
  controllers: [AppController, UserOrganizationController, TitleController, TitlesController], // 🔥 CHỈ AppController
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // 🔥 TOÀN HỆ THỐNG CẦN LOGIN
    }
  ],
})
export class AppModule { }

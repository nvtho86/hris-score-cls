// import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Course } from './courses/course.entity';
import { Lesson } from './lessons/lesson.entity';
import { Enrollment } from './enrollments/enrollment.entity';
import { UsersController } from './users/users.controller';
import { CoursesController } from './courses/courses.controller';
import { LessonsController } from './lessons/lessons.controller';
import { EnrollmentsController } from './enrollments/enrollments.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      // type: 'mssql',
      // host: '192.168.37.58',
      // port: 1433,
      // username: 'sa',
      // password: 'SupportHRIS@2025',
      // database: 'HRIS_SCORE',
      type: 'postgres',
      host: '192.168.37.11',
      port: 30100,
      username: 'postgres',
      password: 'postgres',
      database: 'hris_score',
      entities: [User, Course, Lesson, Enrollment],
      synchronize: true,
    }),
  ],
  controllers: [AppController, UsersController, CoursesController, LessonsController, EnrollmentsController],
  providers: [AppService],
})
export class AppModule {}

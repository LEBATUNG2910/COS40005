import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';

import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { CvModule } from './cv/cv.module';
import { ResumeModule } from './resume/resume.module';
import { RedditModule } from './reddit/reddit.module';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

@Module({
  imports: [
    // Load .env globally
    ConfigModule.forRoot({ isGlobal: true }),

    // MongoDB connection + all schemas
    DatabaseModule,

    // Feature modules
    AuthModule,
    CvModule,
    ResumeModule,
    RedditModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Global exception filter — áp dụng cho toàn app
    // { provide: APP_FILTER, useClass: AllExceptionsFilter },
  ],
})
export class AppModule {}
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { CvModule } from './cv/cv.module';
import { ResumeModule } from './resume/resume.module';
import { RedditModule } from './reddit/reddit.module';
import { UsersModule } from './users/users.module';
import { CvBatchModule } from './cv-batch/cv-batch.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

@Module({
  imports: [
    // Load .env globally
    ConfigModule.forRoot({ isGlobal: true }),

    // Rate limiting — tránh spam API
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60000, // 60 giây
        limit: 60, // tối đa 60 request/phút/IP
      },
    ]),

    // MongoDB connection + all schemas
    DatabaseModule,

    // Feature modules
    AuthModule,
    CvModule,
    ResumeModule,
    RedditModule,
    UsersModule,
    CvBatchModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Global exception filter
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    // Global rate limit guard
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}

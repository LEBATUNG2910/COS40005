import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { RedditModule } from './reddit/reddit.module';
import { AuthModule } from './auth/auth.module';
import { CvModule } from './cv/cv.module';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true,  // ✅ đọc .env toàn cục
      envFilePath: '.env',
    }),
    HttpModule,
    RedditModule,
    AuthModule,
    CvModule,
  ],
})
export class AppModule {}
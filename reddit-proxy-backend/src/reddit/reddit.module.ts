// src/reddit/reddit.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RedditController } from './reddit.controller';
import { RedditService } from './reddit.service';

@Module({
  imports: [
    HttpModule.register({
      baseURL: 'https://www.reddit.com',
      headers: {
        // Header bắt buộc Reddit yêu cầu
        'User-Agent': 'MyNestApp/1.0 (by /u/your_reddit_username)',
        'Accept': 'application/json',
      },
    }),
  ],
  controllers: [RedditController],
  providers: [RedditService],
})
export class RedditModule {}
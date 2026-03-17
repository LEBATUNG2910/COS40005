import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedditController } from './reddit.controller';
import { RedditService } from './reddit.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        baseURL: 'https://www.reddit.com',
        headers: {
          'User-Agent': config.get<string>('REDDIT_USER_AGENT'),
          Accept: 'application/json',
        },
      }),
    }),
  ],
  controllers: [RedditController],
  providers: [RedditService],
})
export class RedditModule {}

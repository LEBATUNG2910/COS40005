// src/reddit/reddit.controller.ts
import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { RedditService } from './reddit.service';

@Controller('reddit')
export class RedditController {
  constructor(private readonly redditService: RedditService) {}

  // GET /api/reddit/hot?limit=25
  @Get('hot')
  async getHotPosts(@Query('limit') limit: string) {
    const parsedLimit = parseInt(limit) || 25;
    return this.redditService.getHotPosts(parsedLimit);
  }

  // GET /api/reddit/post?permalink=/r/react/comments/abc123/...
  @Get('post')
  async getPostDetails(@Query('permalink') permalink: string) {
    if (!permalink) {
      throw new BadRequestException('Thiếu permalink');
    }
    return this.redditService.getPostDetails(permalink);
  }
}
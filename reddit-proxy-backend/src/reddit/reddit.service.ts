// reddit.service.ts
import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RedditService {
  constructor(private readonly httpService: HttpService) {}

  // Cache đơn giản trong memory
  private cache = new Map<string, { data: any; expiredAt: number }>();
  private CACHE_TTL = 5 * 60 * 1000; // 5 phút

  private getCache(key: string) {
    const cached = this.cache.get(key);
    if (cached && Date.now() < cached.expiredAt) {
      return cached.data; // còn hạn → trả về cache
    }
    return null; // hết hạn hoặc chưa có
  }

  private setCache(key: string, data: any) {
    this.cache.set(key, { data, expiredAt: Date.now() + this.CACHE_TTL });
  }

  async getHotPosts(limit: number = 25) {
    const cacheKey = `hot_${limit}`;
    const cached = this.getCache(cacheKey);
    if (cached) return cached; // ✅ trả cache, không gọi Reddit

    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`/r/react/hot.json?limit=${limit}`)
      );
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      throw new HttpException('Không thể lấy dữ liệu từ Reddit', error.response?.status || 500);
    }
  }

  async getPostDetails(permalink: string) {
    const cacheKey = `post_${permalink}`;
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`${permalink}.json`)
      );
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      throw new HttpException('Không thể lấy chi tiết bài viết', error.response?.status || 500);
    }
  }
}
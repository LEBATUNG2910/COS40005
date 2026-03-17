// reddit.service.ts
import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

interface CacheEntry {
  data: unknown;
  expiredAt: number;
}

interface AxiosErrorLike {
  response?: { status?: number };
}

@Injectable()
export class RedditService {
  constructor(private readonly httpService: HttpService) {}

  // Cache đơn giản trong memory
  private cache = new Map<string, CacheEntry>();
  private CACHE_TTL = 5 * 60 * 1000; // 5 phút

  private getCache(key: string): unknown {
    const cached = this.cache.get(key);
    if (cached && Date.now() < cached.expiredAt) {
      return cached.data; // còn hạn → trả về cache
    }
    return null; // hết hạn hoặc chưa có
  }

  private setCache(key: string, data: unknown): void {
    this.cache.set(key, { data, expiredAt: Date.now() + this.CACHE_TTL });
  }

  async getHotPosts(limit: number = 25): Promise<unknown> {
    const cacheKey = `hot_${limit}`;
    const cached = this.getCache(cacheKey);
    if (cached) return cached; // ✅ trả cache, không gọi Reddit

    try {
      const { data } = await firstValueFrom(
        this.httpService.get<unknown>(`/r/react/hot.json?limit=${limit}`),
      );
      this.setCache(cacheKey, data);
      return data;
    } catch (error: unknown) {
      const status = (error as AxiosErrorLike).response?.status ?? 500;
      throw new HttpException('Không thể lấy dữ liệu từ Reddit', status);
    }
  }

  async getPostDetails(permalink: string): Promise<unknown> {
    const cacheKey = `post_${permalink}`;
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const { data } = await firstValueFrom(
        this.httpService.get<unknown>(`${permalink}.json`),
      );
      this.setCache(cacheKey, data);
      return data;
    } catch (error: unknown) {
      const status = (error as AxiosErrorLike).response?.status ?? 500;
      throw new HttpException('Không thể lấy chi tiết bài viết', status);
    }
  }
}

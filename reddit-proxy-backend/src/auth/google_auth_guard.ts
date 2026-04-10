import { Injectable, ExecutionContext, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  private readonly logger = new Logger(GoogleAuthGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const result = await super.canActivate(context);
      return result as boolean;
    } catch (error) {
      this.logger.error('GoogleAuthGuard error:', error?.message);
      this.logger.error('Stack:', error?.stack);
      throw error;
    }
  }

  handleRequest(err: any, user: any, info: any) {
    this.logger.log('handleRequest — err: ' + JSON.stringify(err?.message));
    this.logger.log('handleRequest — user: ' + JSON.stringify(user));
    this.logger.log('handleRequest — info: ' + JSON.stringify(info));

    // Nếu có lỗi thực sự từ strategy hoặc passport, throw để xử lý
    if (err) {
      this.logger.error('Auth error:', err?.message);
      throw err;
    }

    // Trường hợp không có user và không có lỗi (thường xảy ra ở giai đoạn redirect ban đầu)
    // Chỉ log warning, không throw error để tránh log đỏ giả
    if (!user) {
      this.logger.warn('No user returned from Google (this is normal for initial redirect or before validation)');
      return null;
    }

    // Có user => thành công
    return user;
  }
}
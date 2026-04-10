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

    if (err || !user) {
      this.logger.error('Auth failed:', err?.message ?? info?.message ?? 'No user returned');
      throw err || new Error(info?.message ?? 'Google authentication failed');
    }
    return user;
  }
}
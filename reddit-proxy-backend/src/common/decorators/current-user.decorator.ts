import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export interface JwtPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

interface RequestWithUser extends Request {
  user: JwtPayload;
}

// Dùng trong controller: @CurrentUser() user: JwtPayload
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtPayload => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return request.user;
  },
);

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Dùng trong controller: @CurrentUser() user: JwtPayload
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

export interface JwtPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

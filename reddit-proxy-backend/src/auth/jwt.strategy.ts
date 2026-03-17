import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

interface JwtValidatePayload {
  sub: string;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') as string,
    });
  }

  async validate(
    payload: JwtValidatePayload,
  ): Promise<{ userId: string; email: string }> {
    const user: unknown = await this.usersService.findById(payload.sub);
    if (!user) throw new UnauthorizedException('User not found');

    // req.user sẽ có dạng { userId: string, email: string }
    return { userId: payload.sub, email: payload.email };
  }
}

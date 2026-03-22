import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(configService: ConfigService) {
    super({
      clientID:     configService.get<string>('GOOGLE_CLIENT_ID') as string,
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET') as string,
      callbackURL:  configService.get<string>('GOOGLE_CALLBACK_URL') as string,
      scope: ['email', 'profile'],
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): void {
    const { id, name, emails, photos } = profile;
    const user = {
      googleId:  id,
      email:     emails?.[0]?.value ?? '',
      firstName: name?.givenName ?? '',
      lastName:  name?.familyName ?? '',
      fullName:  `${name?.givenName ?? ''} ${name?.familyName ?? ''}`.trim(),
      avatar:    photos?.[0]?.value ?? null,
    };
    done(null, user);
  }
}

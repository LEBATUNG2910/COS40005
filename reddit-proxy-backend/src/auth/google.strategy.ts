import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private readonly logger = new Logger(GoogleStrategy.name);

  constructor(configService: ConfigService) {
    const clientID     = configService.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = configService.get<string>('GOOGLE_CLIENT_SECRET');
    const callbackURL  = configService.get<string>('GOOGLE_CALLBACK_URL');

    // Log config để kiểm tra env vars có load đúng không
    console.log('[GoogleStrategy] clientID:', clientID ? clientID.slice(0, 20) + '...' : 'MISSING');
    console.log('[GoogleStrategy] clientSecret:', clientSecret ? '***SET***' : 'MISSING');
    console.log('[GoogleStrategy] callbackURL:', callbackURL ?? 'MISSING');

    super({
      clientID:     clientID as string,
      clientSecret: clientSecret as string,
      callbackURL:  callbackURL as string,
      scope: ['email', 'profile'],
      proxy: true,
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): void {
    try {
      this.logger.log('Google profile received: ' + JSON.stringify({
        id: profile.id,
        emails: profile.emails,
        displayName: profile.displayName,
      }));

      const { id, name, emails, photos } = profile;

      if (!emails || emails.length === 0) {
        this.logger.error('No email returned from Google profile');
        return done(new Error('No email returned from Google'), undefined);
      }

      const user = {
        googleId:  id,
        email:     emails[0].value,
        firstName: name?.givenName ?? '',
        lastName:  name?.familyName ?? '',
        fullName:  `${name?.givenName ?? ''} ${name?.familyName ?? ''}`.trim(),
        avatar:    photos?.[0]?.value ?? null,
      };

      this.logger.log('Google user built: ' + JSON.stringify(user));
      done(null, user);
    } catch (error) {
      this.logger.error('Error in GoogleStrategy.validate:', error);
      done(error as Error, undefined);
    }
  }
}
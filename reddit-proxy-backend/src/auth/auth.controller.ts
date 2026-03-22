import {
  Controller, Post, Get, Patch, Body,
  HttpCode, HttpStatus, UseGuards, Request, Req, Res,
  BadRequestException, Query,
} from '@nestjs/common';
import { type Response } from 'express';
import { GoogleAuthGuard } from './google_auth_guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtPayload } from '../common/decorators/current-user.decorator';

interface RequestWithUser extends Request {
  user: JwtPayload;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /api/auth/register
  @Post('register')
  async register(@Body() body: {
    fullName: string; email: string; phoneNumber: string;
    password: string; gender: string;
  }) {
    return this.authService.register(body);
  }

  // POST /api/auth/login
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: { emailOrPhone: string; password: string; rememberMe: boolean }) {
    return this.authService.login(body);
  }

  // POST /api/auth/refresh
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() body: { refreshToken: string }) {
    if (!body?.refreshToken) throw new BadRequestException('refreshToken is required');
    return this.authService.refresh(body.refreshToken);
  }

  // POST /api/auth/logout
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body() body: { refreshToken?: string }) {
    if (body?.refreshToken) await this.authService.logout(body.refreshToken);
    return { message: 'Logged out successfully' };
  }

  // GET /api/auth/me
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Request() req: RequestWithUser) {
    return this.authService.getMe(req.user.userId);
  }

  // PATCH /api/auth/profile
  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Request() req: RequestWithUser,
    @Body() body: { fullName?: string; language?: string },
  ) {
    return this.authService.updateProfile(req.user.userId, body);
  }

  // PATCH /api/auth/change-password
  @Patch('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Request() req: RequestWithUser,
    @Body() body: { currentPassword: string; newPassword: string },
  ) {
    return this.authService.changePassword(req.user.userId, body);
  }

  // GET /api/auth/verify-email?token=...
  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    if (!token) throw new BadRequestException('Token is required');
    return this.authService.verifyEmail(token);
  }

  // POST /api/auth/resend-verification
  @Post('resend-verification')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async resendVerification(@Request() req: RequestWithUser) {
    return this.authService.resendVerificationEmail(req.user.userId);
  }

  // POST /api/auth/forgot-password
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() body: { email: string }) {
    if (!body?.email) throw new BadRequestException('Email is required');
    return this.authService.forgotPassword(body.email);
  }

  // POST /api/auth/reset-password
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() body: { token: string; newPassword: string }) {
    if (!body?.token) throw new BadRequestException('Token is required');
    if (!body?.newPassword) throw new BadRequestException('New password is required');
    return this.authService.resetPassword(body.token, body.newPassword);
  }

  // GET /api/auth/google — redirect đến Google login
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {
    // Passport tự redirect đến Google
  }

  // GET /api/auth/google/callback — Google redirect về đây
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(@Req() req: any, @Res() res: Response) {
    const googleUser = req.user as {
      googleId: string; email: string; fullName: string;
      firstName: string; lastName: string; avatar: string | null;
    };

    const { accessToken, refreshToken } = await this.authService.googleLogin(googleUser);

    // Redirect về frontend với tokens trong query params
    const appUrl = process.env.APP_URL ?? 'http://localhost:5173';
    return res.redirect(
      `${appUrl}/auth/google/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`
    );
  }
}
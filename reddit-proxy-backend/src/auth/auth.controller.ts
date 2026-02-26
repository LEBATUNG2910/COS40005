import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ─── POST /api/auth/register ──────────────────────────────
  @Post('register')
  async register(
    @Body() body: {
      fullName: string;
      email: string;
      phoneNumber: string;
      password: string;
      gender: string;
    },
  ) {
    return this.authService.register(body);
  }

  // ─── POST /api/auth/login ─────────────────────────────────
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() body: {
      emailOrPhone: string;
      password: string;
      rememberMe: boolean;
    },
  ) {
    return this.authService.login(body);
  }

  // ─── GET /api/auth/me ─────────────────────────────────────
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Request() req) {
    return this.authService.getMe(req.user.userId);
  }

  // ─── PATCH /api/auth/profile ──────────────────────────────
  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Request() req,
    @Body() body: { fullName?: string; language?: string },
  ) {
    return this.authService.updateProfile(req.user.userId, body);
  }

  // ─── PATCH /api/auth/change-password ─────────────────────
  @Patch('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Request() req,
    @Body() body: { currentPassword: string; newPassword: string },
  ) {
    return this.authService.changePassword(req.user.userId, body);
  }
}
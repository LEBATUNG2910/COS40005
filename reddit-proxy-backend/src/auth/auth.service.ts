import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { SignOptions } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // ─── ĐĂNG KÝ ─────────────────────────────────────────────
  async register(data: {
    fullName: string;
    email: string;
    phoneNumber: string;
    password: string;
    gender: string;
  }) {
    const user = await this.usersService.create(data);
    const token = this.generateToken(user.id, user.email);
    return {
      message: 'Account created successfully',
      user: { id: user.id, fullName: user.fullName, email: user.email },
      ...token,
    };
  }

  // ─── ĐĂNG NHẬP ───────────────────────────────────────────
  async login(data: {
    emailOrPhone: string;
    password: string;
    rememberMe: boolean;
  }) {
    const user = await this.usersService.findByEmailOrPhone(data.emailOrPhone);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

  const expiresIn: any = data.rememberMe
  ? (this.configService.get<string>('JWT_REMEMBER_EXPIRES_IN') ?? '30d')
  : (this.configService.get<string>('JWT_EXPIRES_IN') ?? '7d');

    const token = this.generateToken(user.id, user.email, expiresIn);
    return {
      message: 'Login successful',
      user: { id: user.id, fullName: user.fullName, email: user.email },
      ...token,
    };
  }

  // ─── LẤY THÔNG TIN USER ──────────────────────────────────
  async getMe(userId: number) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new UnauthorizedException('User not found');

    const { password, ...result } = user;
    return result;
  }

  // ─── CẬP NHẬT PROFILE ────────────────────────────────────
  async updateProfile(userId: number, data: { fullName?: string; language?: string }) {
    const updated = await this.usersService.updateProfile(userId, data);
    const { password, ...result } = updated;
    return {
      message: 'Profile updated successfully',
      user: result,
    };
  }

  // ─── ĐỔI PASSWORD ────────────────────────────────────────
  async changePassword(userId: number, data: { currentPassword: string; newPassword: string }) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new UnauthorizedException('User not found');

    // Kiểm tra password hiện tại
    const isValid = await bcrypt.compare(data.currentPassword, user.password);
    if (!isValid) throw new BadRequestException('Current password is incorrect');

    // Kiểm tra password mới không trùng password cũ
    const isSame = await bcrypt.compare(data.newPassword, user.password);
    if (isSame) throw new BadRequestException('New password must be different from current password');

    await this.usersService.updatePassword(userId, data.newPassword);
    return { message: 'Password changed successfully' };
  }

  // ─── TẠO TOKEN ───────────────────────────────────────────
  private generateToken(userId: number, email: string, expiresIn: any = '7d') {
  const payload = { sub: userId, email };
  return {
    accessToken: this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET') as string,
      expiresIn, // ✅ không còn lỗi type
    }),
  };
}
}
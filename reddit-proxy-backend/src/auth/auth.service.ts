import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';

interface UserDocument {
  id: string;
  fullName: string;
  email: string;
  password: string;
  [key: string]: unknown;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // ─── ĐĂNG KÝ ─────────────────────────────────────────────────
  async register(data: {
    fullName: string;
    email: string;
    phoneNumber: string;
    password: string;
    gender: string;
  }) {
    const user = (await this.usersService.create(data)) as UserDocument;
    const token = this.generateToken(user.id, user.email);
    return {
      message: 'Account created successfully',
      user: { id: user.id, fullName: user.fullName, email: user.email },
      ...token,
    };
  }

  // ─── ĐĂNG NHẬP ───────────────────────────────────────────────
  async login(data: {
    emailOrPhone: string;
    password: string;
    rememberMe: boolean;
  }) {
    const user = (await this.usersService.findByEmailOrPhone(
      data.emailOrPhone,
    )) as UserDocument | null;
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    const expiresIn: string = data.rememberMe
      ? (this.configService.get<string>('JWT_REMEMBER_EXPIRES_IN') ?? '30d')
      : (this.configService.get<string>('JWT_EXPIRES_IN') ?? '7d');

    const token = this.generateToken(user.id, user.email, expiresIn);
    return {
      message: 'Login successful',
      user: { id: user.id, fullName: user.fullName, email: user.email },
      ...token,
    };
  }

  // ─── LẤY THÔNG TIN USER ──────────────────────────────────────
  async getMe(userId: string) {
    const user = (await this.usersService.findById(
      userId,
    )) as UserDocument | null;
    if (!user) throw new UnauthorizedException('User not found');
    const { password: _password, ...result } = user;
    void _password;
    return result;
  }

  // ─── CẬP NHẬT PROFILE ────────────────────────────────────────
  async updateProfile(
    userId: string,
    data: { fullName?: string; language?: string },
  ) {
    const updated = (await this.usersService.updateProfile(
      userId,
      data,
    )) as UserDocument;
    const { password: _password, ...result } = updated;
    void _password;
    return {
      message: 'Profile updated successfully',
      user: result,
    };
  }

  // ─── ĐỔI PASSWORD ────────────────────────────────────────────
  async changePassword(
    userId: string,
    data: { currentPassword: string; newPassword: string },
  ) {
    const user = (await this.usersService.findById(
      userId,
    )) as UserDocument | null;
    if (!user) throw new UnauthorizedException('User not found');

    const isValid = await bcrypt.compare(data.currentPassword, user.password);
    if (!isValid)
      throw new BadRequestException('Current password is incorrect');

    const isSame = await bcrypt.compare(data.newPassword, user.password);
    if (isSame)
      throw new BadRequestException(
        'New password must be different from current password',
      );

    await this.usersService.updatePassword(userId, data.newPassword);
    return { message: 'Password changed successfully' };
  }

  // ─── TẠO TOKEN ───────────────────────────────────────────────
  private generateToken(
    userId: string,
    email: string,
    expiresIn: string = '100y',
  ) {
    const payload = { sub: userId, email };
    return {
      accessToken: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_SECRET') as string,
        expiresIn: expiresIn as `${number}${'y' | 'd' | 'h' | 'm' | 's'}`,
      }),
    };
  }
}

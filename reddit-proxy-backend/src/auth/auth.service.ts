import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from '../users/users.service';
import {
  RefreshToken,
  RefreshTokenDocument,
} from '../database/schemas/refresh-token.schema';
import * as bcrypt from 'bcryptjs';
import { createHash, randomBytes } from 'crypto';
import { v4 as uuidv4 } from 'uuid';
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
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshTokenDocument>,
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
    const accessToken = this.generateAccessToken(user.id, user.email);
    const refreshToken = await this.generateRefreshToken(user.id, false);
    return {
      message: 'Account created successfully',
      user: { id: user.id, fullName: user.fullName, email: user.email },
      accessToken,
      refreshToken,
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

    const accessToken = this.generateAccessToken(user.id, user.email);
    const refreshToken = await this.generateRefreshToken(
      user.id,
      data.rememberMe,
    );

    return {
      message: 'Login successful',
      user: { id: user.id, fullName: user.fullName, email: user.email },
      accessToken,
      refreshToken,
    };
  }

  // ─── REFRESH TOKEN → access token mới ────────────────────────
  async refresh(
    token: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const tokenHash = this.hashToken(token);

    const stored = await this.refreshTokenModel.findOne({
      tokenHash,
      isRevoked: false,
      expiresAt: { $gt: new Date() },
    });

    if (!stored)
      throw new UnauthorizedException('Invalid or expired refresh token');

    // Rotation — revoke token cũ, tạo token mới
    await this.refreshTokenModel.updateOne(
      { _id: stored._id },
      { isRevoked: true },
    );

    const user = (await this.usersService.findById(
      stored.userId,
    )) as UserDocument | null;
    if (!user) throw new UnauthorizedException('User not found');

    const newAccessToken = this.generateAccessToken(user.id, user.email);
    const newRefreshToken = await this.generateRefreshToken(user.id, false);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  // ─── LOGOUT — revoke refresh token ───────────────────────────
  async logout(token: string): Promise<void> {
    const tokenHash = this.hashToken(token);
    await this.refreshTokenModel.updateOne({ tokenHash }, { isRevoked: true });
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
    return { message: 'Profile updated successfully', user: result };
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

    // Revoke tất cả refresh token khi đổi password
    await this.refreshTokenModel.updateMany(
      { userId, isRevoked: false },
      { isRevoked: true },
    );

    return { message: 'Password changed successfully' };
  }

  // ─── Private: access token (ngắn hạn) ────────────────────────
  private generateAccessToken(userId: string, email: string): string {
    const expiresIn = (this.configService.get<string>('JWT_EXPIRES_IN') ??
      '7d') as `${number}${'y' | 'd' | 'h' | 'm' | 's'}`;
    const payload = { sub: userId, email };
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET') as string,
      expiresIn,
    });
  }

  // ─── Private: refresh token (dài hạn) ────────────────────────
  private async generateRefreshToken(
    userId: string,
    rememberMe: boolean,
  ): Promise<string> {
    const token = randomBytes(64).toString('hex');
    const tokenHash = this.hashToken(token);
    const days = rememberMe ? 30 : 7;
    const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    await this.refreshTokenModel.create({
      _id: uuidv4(),
      userId,
      tokenHash,
      expiresAt,
      isRevoked: false,
      createdAt: new Date(),
    });

    return token;
  }

  // ─── Private: hash token SHA256 ──────────────────────────────
  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}

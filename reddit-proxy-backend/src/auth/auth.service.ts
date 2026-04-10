import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from '../users/users.service';
import { User, UserDocument } from '../database/schemas/user.schema';
import { RefreshToken, RefreshTokenDocument } from '../database/schemas/refresh-token.schema';
import { EmailService } from '../email/email.service';
import * as bcrypt from 'bcryptjs';
import { createHash, randomBytes } from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';

interface UserDoc {
  id: string;
  _id: string;
  fullName: string;
  email: string;
  password: string;
  isEmailVerified?: boolean;
  emailVerificationToken?: string | null;
  emailVerificationExpires?: Date | null;
  passwordResetToken?: string | null;
  passwordResetExpires?: Date | null;
  [key: string]: unknown;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailService: EmailService,
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshTokenDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  // ─── ĐĂNG KÝ ─────────────────────────────────────────────────
  async register(data: {
    fullName: string; email: string; phoneNumber: string;
    password: string; gender: string;
  }) {
    const user = (await this.usersService.create(data)) as UserDoc;
    const userId = user.id ?? user._id;

    // Tạo email verification token
    const verifyToken = randomBytes(32).toString('hex');
    const verifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
    await this.userModel.updateOne(
      { _id: userId },
      { emailVerificationToken: verifyToken, emailVerificationExpires: verifyExpires }
    );

    // Gửi email verification (non-blocking)
    this.emailService.sendVerificationEmail(user.email, user.fullName, verifyToken)
      .catch(e => console.warn('Verify email failed:', e));

    const accessToken = this.generateAccessToken(userId, user.email);
    const refreshToken = await this.generateRefreshToken(userId, false);
    return {
      message: 'Account created successfully. Please check your email to verify your account.',
      user: { id: userId, fullName: user.fullName, email: user.email, isEmailVerified: false },
      accessToken,
      refreshToken,
    };
  }

  // ─── ĐĂNG NHẬP ───────────────────────────────────────────────
  async login(data: { emailOrPhone: string; password: string; rememberMe: boolean }) {
    const user = (await this.usersService.findByEmailOrPhone(data.emailOrPhone)) as UserDoc | null;
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

    const userId = user.id ?? user._id;
    const accessToken = this.generateAccessToken(userId, user.email);
    const refreshToken = await this.generateRefreshToken(userId, data.rememberMe);

    return {
      message: 'Login successful',
      user: { id: userId, fullName: user.fullName, email: user.email, isEmailVerified: user.isEmailVerified ?? false },
      accessToken,
      refreshToken,
    };
  }

  // ─── VERIFY EMAIL ─────────────────────────────────────────────
  async verifyEmail(token: string): Promise<{ message: string }> {
    const user = await this.userModel.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() },
    });
    if (!user) throw new BadRequestException('Invalid or expired verification link');

    await this.userModel.updateOne(
      { _id: user._id },
      {
        isEmailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
      }
    );
    return { message: 'Email verified successfully' };
  }

  // ─── RESEND VERIFICATION EMAIL ────────────────────────────────
  async resendVerificationEmail(userId: string): Promise<{ message: string }> {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    if (user.isEmailVerified) throw new BadRequestException('Email already verified');

    const verifyToken = randomBytes(32).toString('hex');
    const verifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await this.userModel.updateOne(
      { _id: userId },
      { emailVerificationToken: verifyToken, emailVerificationExpires: verifyExpires }
    );

    await this.emailService.sendVerificationEmail(user.email, user.fullName, verifyToken);
    return { message: 'Verification email sent' };
  }

  // ─── FORGOT PASSWORD ──────────────────────────────────────────
  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.userModel.findOne({ email });
    // Luôn trả về success để tránh email enumeration attack
    if (!user) return { message: 'If that email exists, a reset link has been sent' };

    const resetToken = randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await this.userModel.updateOne(
      { _id: user._id },
      { passwordResetToken: resetToken, passwordResetExpires: resetExpires }
    );

    await this.emailService.sendPasswordResetEmail(user.email, user.fullName, resetToken);
    return { message: 'If that email exists, a reset link has been sent' };
  }

  // ─── RESET PASSWORD ───────────────────────────────────────────
  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const user = await this.userModel.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() },
    });
    if (!user) throw new BadRequestException('Invalid or expired reset link');

    if (newPassword.length < 8) throw new BadRequestException('Password must be at least 8 characters');

    const hash = await bcrypt.hash(newPassword, 12);
    await this.userModel.updateOne(
      { _id: user._id },
      {
        passwordHash: hash,
        passwordResetToken: null,
        passwordResetExpires: null,
      }
    );

    // Revoke tất cả refresh token sau khi reset password
    await this.refreshTokenModel.updateMany({ userId: String(user._id), isRevoked: false }, { isRevoked: true });

    return { message: 'Password reset successfully. Please login with your new password.' };
  }

  // ─── REFRESH TOKEN ────────────────────────────────────────────
  async refresh(token: string): Promise<{ accessToken: string; refreshToken: string }> {
    const tokenHash = this.hashToken(token);
    const stored = await this.refreshTokenModel.findOne({
      tokenHash, isRevoked: false, expiresAt: { $gt: new Date() },
    });
    if (!stored) throw new UnauthorizedException('Invalid or expired refresh token');

    await this.refreshTokenModel.updateOne({ _id: stored._id }, { isRevoked: true });

    const user = (await this.usersService.findById(stored.userId)) as UserDoc | null;
    if (!user) throw new UnauthorizedException('User not found');

    const userId = user.id ?? user._id;
    return {
      accessToken: this.generateAccessToken(userId, user.email),
      refreshToken: await this.generateRefreshToken(userId, false),
    };
  }

  // ─── LOGOUT ───────────────────────────────────────────────────
  async logout(token: string): Promise<void> {
    const tokenHash = this.hashToken(token);
    await this.refreshTokenModel.updateOne({ tokenHash }, { isRevoked: true });
  }

  // ─── GET ME ───────────────────────────────────────────────────
  async getMe(userId: string) {
    const user = (await this.usersService.findById(userId)) as UserDoc | null;
    if (!user) throw new UnauthorizedException('User not found');
    const { password: _pw, ...result } = user;
    void _pw;
    return result;
  }

  // ─── UPDATE PROFILE ───────────────────────────────────────────
  async updateProfile(userId: string, data: { fullName?: string; language?: string }) {
    const updated = (await this.usersService.updateProfile(userId, data)) as UserDoc;
    const { password: _pw, ...result } = updated;
    void _pw;
    return { message: 'Profile updated successfully', user: result };
  }

  // ─── CHANGE PASSWORD ──────────────────────────────────────────
  async changePassword(userId: string, data: { currentPassword: string; newPassword: string }) {
    const user = (await this.usersService.findById(userId)) as UserDoc | null;
    if (!user) throw new UnauthorizedException('User not found');

    const isValid = await bcrypt.compare(data.currentPassword, user.password);
    if (!isValid) throw new BadRequestException('Current password is incorrect');

    const isSame = await bcrypt.compare(data.newPassword, user.password);
    if (isSame) throw new BadRequestException('New password must be different');

    await this.usersService.updatePassword(userId, data.newPassword);
    await this.refreshTokenModel.updateMany({ userId, isRevoked: false }, { isRevoked: true });
    return { message: 'Password changed successfully' };
  }

  // ─── DELETE ACCOUNT ───────────────────────────────────────────
  async deleteAccount(userId: string, password?: string): Promise<{ message: string }> {
    const user = (await this.usersService.findById(userId)) as UserDoc | null;
    if (!user) throw new UnauthorizedException('User not found');

    // Nếu user có password (không phải Google-only), yêu cầu xác nhận password
    if (user.password) {
      if (!password) throw new BadRequestException('Password is required to delete account');
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) throw new BadRequestException('Incorrect password');
    }

    // Soft delete — đánh dấu isDeleted thay vì xóa thật
    await this.userModel.updateOne(
      { _id: userId },
      { isDeleted: true, isActive: false, updatedAt: new Date() }
    );

    // Revoke tất cả refresh token
    await this.refreshTokenModel.updateMany({ userId, isRevoked: false }, { isRevoked: true });

    return { message: 'Account deleted successfully' };
  }

  // ─── GOOGLE OAUTH ────────────────────────────────────────────
  async googleLogin(googleUser: {
    googleId: string; email: string; fullName: string;
    firstName: string; lastName: string; avatar: string | null;
  }): Promise<{ accessToken: string; refreshToken: string; isNewUser: boolean }> {
    let isNewUser = false;

    // 1. Tìm user theo email
    const rawUser = await this.userModel.findOne({ email: googleUser.email }).lean();
    let user = rawUser ? { ...rawUser, password: (rawUser as any).passwordHash } as unknown as UserDoc : null;

    if (user) {
      // User đã tồn tại — update avatar nếu chưa có
      if (!user.avatarUrl && googleUser.avatar) {
        await this.userModel.updateOne({ _id: user._id }, { avatarUrl: googleUser.avatar });
      }
      // Tự động verify email nếu đăng nhập bằng Google
      if (!user.isEmailVerified) {
        await this.userModel.updateOne({ _id: user._id }, { isEmailVerified: true });
      }
    } else {
      // User mới — tạo account tự động
      // Dùng static import bcrypt và uuidv4 đã có ở đầu file
      isNewUser = true;
      const randomPassword = await bcrypt.hash(Math.random().toString(36), 10);

      const newUser = await this.userModel.create({
        _id: uuidv4(),
        fullName: googleUser.fullName || googleUser.email.split('@')[0],
        email: googleUser.email,
        phoneNumber: `g_${googleUser.googleId.slice(-12)}`, // placeholder max 14 chars
        passwordHash: randomPassword,
        gender: 'Other',
        language: 'English',
        newsletterOptIn: false,
        avatarUrl: googleUser.avatar,
        isActive: true,
        isDeleted: false,
        isEmailVerified: true, // Google đã verify email rồi
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const newUserObj = newUser.toObject() as any;
      user = { ...newUserObj, password: newUserObj.passwordHash } as unknown as UserDoc;
    }

    const userId = String(user._id);
    const accessToken = this.generateAccessToken(userId, user.email);
    const refreshToken = await this.generateRefreshToken(userId, false);

    return { accessToken, refreshToken, isNewUser };
  }

  // ─── Private helpers ──────────────────────────────────────────
  private generateAccessToken(userId: string, email: string): string {
    const expiresIn = (this.configService.get<string>('JWT_EXPIRES_IN') ?? '7d') as `${number}${'y'|'d'|'h'|'m'|'s'}`;
    return this.jwtService.sign(
      { sub: userId, email },
      { secret: this.configService.get<string>('JWT_SECRET') as string, expiresIn },
    );
  }

  private async generateRefreshToken(userId: string, rememberMe: boolean): Promise<string> {
    const token = randomBytes(64).toString('hex');
    const tokenHash = this.hashToken(token);
    const days = rememberMe ? 30 : 7;
    await this.refreshTokenModel.create({
      _id: uuidv4(), userId, tokenHash,
      expiresAt: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
      isRevoked: false, createdAt: new Date(),
    });
    return token;
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
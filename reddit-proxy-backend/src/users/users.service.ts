import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

import { User, UserDocument } from '../database/schemas/user.schema';

// ─── Shared return shape ──────────────────────────────────────────────────────
export interface UserDto {
  id: unknown;
  fullName: string;
  email: string;
  phoneNumber?: string;
  gender?: string;
  language?: string;
  newsletterOptIn?: boolean;
  avatarUrl?: string | null;
  password: string;
}

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // ─── TẠO USER MỚI ────────────────────────────────────────────
  async create(data: {
    fullName: string;
    email: string;
    phoneNumber: string;
    password: string;
    gender: string;
  }): Promise<UserDto> {
    const existingEmail = await this.userModel.findOne({
      email: data.email.toLowerCase().trim(),
      isDeleted: false,
    });
    if (existingEmail)
      throw new BadRequestException('Email already registered');

    const existingPhone = await this.userModel.findOne({
      phoneNumber: data.phoneNumber.trim(),
      isDeleted: false,
    });
    if (existingPhone)
      throw new BadRequestException('Phone number already registered');

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = new this.userModel({
      _id: uuidv4(),
      fullName: data.fullName.trim(),
      email: data.email.toLowerCase().trim(),
      phoneNumber: data.phoneNumber.trim(),
      passwordHash,
      gender:
        data.gender.charAt(0).toUpperCase() +
        data.gender.slice(1).toLowerCase(),
      language: 'English',
      newsletterOptIn: false,
      avatarUrl: null,
      isActive: true,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await user.save();

    return {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      password: user.passwordHash,
    };
  }

  // ─── TÌM THEO EMAIL HOẶC PHONE ───────────────────────────────
  async findByEmailOrPhone(emailOrPhone: string): Promise<UserDto | null> {
    const query = emailOrPhone.includes('@')
      ? { email: emailOrPhone.toLowerCase().trim(), isDeleted: false }
      : { phoneNumber: emailOrPhone.trim(), isDeleted: false };

    const user = await this.userModel.findOne(query);
    if (!user) return null;

    return {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      gender: user.gender,
      language: user.language,
      newsletterOptIn: user.newsletterOptIn,
      avatarUrl: user.avatarUrl,
      password: user.passwordHash,
    };
  }

  // ─── TÌM THEO ID ─────────────────────────────────────────────
  async findById(userId: string): Promise<UserDto | null> {
    const user = await this.userModel.findOne({
      _id: userId,
      isDeleted: false,
    });
    if (!user) return null;

    return {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      gender: user.gender,
      language: user.language,
      newsletterOptIn: user.newsletterOptIn,
      avatarUrl: user.avatarUrl,
      password: user.passwordHash,
    };
  }

  // ─── CẬP NHẬT PROFILE ────────────────────────────────────────
  async updateProfile(
    userId: string,
    data: { fullName?: string; language?: string },
  ): Promise<UserDto> {
    const update: {
      updatedAt: Date;
      fullName?: string;
      language?: string;
    } = { updatedAt: new Date() };

    if (data.fullName) update.fullName = data.fullName.trim();
    if (data.language) update.language = data.language;

    const user = await this.userModel.findOneAndUpdate(
      { _id: userId, isDeleted: false },
      { $set: update },
      { returnDocument: 'after' },
    );
    if (!user) throw new NotFoundException('User not found');

    return {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      language: user.language,
      password: user.passwordHash,
    };
  }

  // ─── ĐỔI PASSWORD ────────────────────────────────────────────
  async updatePassword(userId: string, newPassword: string): Promise<void> {
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await this.userModel.findOneAndUpdate(
      { _id: userId, isDeleted: false },
      { $set: { passwordHash, updatedAt: new Date() } },
    );
  }
}

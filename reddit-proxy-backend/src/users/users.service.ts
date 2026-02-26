import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

export interface User {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  gender: string;
  language: string; // ✅ thêm language
}

@Injectable()
export class UsersService {
  private users: User[] = [];
  private idCounter = 1;

  async create(data: Omit<User, 'id' | 'password' | 'language'> & { password: string }): Promise<User> {
    const existing = this.users.find(u => u.email === data.email);
    if (existing) throw new ConflictException('Email already exists');

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newUser: User = {
      id: this.idCounter++,
      ...data,
      password: hashedPassword,
      language: 'English', // mặc định
    };

    this.users.push(newUser);
    return newUser;
  }

  async findById(id: number): Promise<User | undefined> {
    return this.users.find(u => u.id === id);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find(u => u.email === email);
  }

  async findByEmailOrPhone(emailOrPhone: string): Promise<User | undefined> {
    return this.users.find(
      u => u.email === emailOrPhone || u.phoneNumber === emailOrPhone
    );
  }

  // ✅ Cập nhật tên và ngôn ngữ
  async updateProfile(id: number, data: { fullName?: string; language?: string }): Promise<User> {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) throw new NotFoundException('User not found');

    this.users[index] = { ...this.users[index], ...data };
    return this.users[index];
  }

  // ✅ Đổi password
  async updatePassword(id: number, newPassword: string): Promise<void> {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) throw new NotFoundException('User not found');

    this.users[index].password = await bcrypt.hash(newPassword, 10);
  }
}
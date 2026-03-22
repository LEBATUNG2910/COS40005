import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ collection: 'users', timestamps: false })
export class User {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ required: true, maxlength: 150 })
  fullName: string;

  @Prop({ required: true, maxlength: 255, unique: true })
  email: string;

  @Prop({ required: true, maxlength: 20, unique: true })
  phoneNumber: string;

  @Prop({ required: true, maxlength: 500 })
  passwordHash: string;

  @Prop({ required: true, enum: ['Male', 'Female', 'Other'] })
  gender: string;

  @Prop({ enum: ['English', 'Spanish', 'French', 'German', 'Vietnamese'], default: 'English' })
  language: string;

  @Prop({ default: false })
  newsletterOptIn: boolean;

  @Prop({ type: String, default: null, maxlength: 500 })
  avatarUrl: string | null;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isDeleted: boolean;

  // ── Email Verification ────────────────────────────────────────
  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop({ type: String, default: null })
  emailVerificationToken: string | null;

  @Prop({ type: Date, default: null })
  emailVerificationExpires: Date | null;

  // ── Forgot Password ───────────────────────────────────────────
  @Prop({ type: String, default: null })
  passwordResetToken: string | null;

  @Prop({ type: Date, default: null })
  passwordResetExpires: Date | null;

  @Prop({ default: () => new Date() })
  createdAt: Date;

  @Prop({ default: () => new Date() })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ emailVerificationToken: 1 }, { sparse: true });
UserSchema.index({ passwordResetToken: 1 }, { sparse: true });
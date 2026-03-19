import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RefreshTokenDocument = RefreshToken & Document;

@Schema({ collection: 'refreshTokens', timestamps: false })
export class RefreshToken {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ required: true })
  userId: string;

  // SHA256 hash của token — không lưu plain text
  @Prop({ required: true, maxlength: 64 })
  tokenHash: string;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ type: String, default: null, maxlength: 500 })
  deviceInfo: string | null;

  @Prop({ type: String, default: null, maxlength: 45 })
  ipAddress: string | null;

  @Prop({ default: false })
  isRevoked: boolean;

  @Prop({ default: () => new Date() })
  createdAt: Date;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);

// TTL — MongoDB tự xóa khi hết hạn
RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
RefreshTokenSchema.index({ userId: 1, isRevoked: 1 });
RefreshTokenSchema.index({ tokenHash: 1 }, { unique: true });

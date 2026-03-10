import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RefreshTokenDocument = RefreshToken & Document;

@Schema({ collection: 'refreshTokens', timestamps: false })
export class RefreshToken {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true, maxlength: 500 })
  token: string;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ default: false })
  rememberMe: boolean;

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

RefreshTokenSchema.index({ userId: 1 }, { partialFilterExpression: { isRevoked: false } });
RefreshTokenSchema.index({ token: 1 }, { partialFilterExpression: { isRevoked: false } });
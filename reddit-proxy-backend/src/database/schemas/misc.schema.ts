import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/* ─── Reddit Cache ────────────────────────────────────────────── */
export type RedditCacheDocument = RedditCache & Document;

@Schema({ collection: 'redditCache', timestamps: false })
export class RedditCache {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ required: true, maxlength: 500, unique: true })
  cacheKey: string;

  @Prop({ required: true })
  responseBody: string;

  @Prop({ required: true })
  cachedAt: Date;

  @Prop({ required: true })
  expiresAt: Date;
}

export const RedditCacheSchema = SchemaFactory.createForClass(RedditCache);
// TTL index — MongoDB tự xóa khi expiresAt qua
RedditCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

/* ─── Audit Log ───────────────────────────────────────────────── */
export type AuditLogDocument = AuditLog & Document;

@Schema({ collection: 'auditLogs', timestamps: false })
export class AuditLog {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ type: String, default: null })
  userId: string | null;

  @Prop({ required: true, maxlength: 100 })
  action: string;

  @Prop({ type: String, default: null })
  entityType: string | null;

  @Prop({ type: String, default: null })
  entityId: string | null;

  @Prop({ type: String, default: null })
  details: string | null;

  @Prop({ type: String, default: null, maxlength: 45 })
  ipAddress: string | null;

  @Prop({ type: String, default: null, maxlength: 500 })
  userAgent: string | null;

  @Prop({ default: () => new Date() })
  createdAt: Date;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
AuditLogSchema.index({ userId: 1, createdAt: -1 });
AuditLogSchema.index({ action: 1, createdAt: -1 });
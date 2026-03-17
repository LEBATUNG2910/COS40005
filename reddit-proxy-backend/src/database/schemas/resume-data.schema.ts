import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ResumeDataDocument = ResumeDataModel & Document;

@Schema({ collection: 'resumeData', timestamps: false })
export class ResumeDataModel {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ required: true, unique: true })
  userId: string;

  // ── personalInfo (flat để query dễ) ──────────────────────────
  @Prop({ type: String, default: '' }) name: string;
  @Prop({ type: String, default: '' }) email: string;
  @Prop({ type: String, default: '' }) phone: string;
  @Prop({ type: String, default: '' }) location: string;
  @Prop({ type: String, default: '' }) linkedin: string;
  @Prop({ type: String, default: '' }) github: string;
  @Prop({ type: String, default: '' }) website: string;

  // ── sections (lưu dưới dạng JSON string để flexible) ─────────
  @Prop({ type: String, default: '' })
  summary: string;

  @Prop({ type: [Object], default: [] })
  experience: Record<string, any>[];

  @Prop({ type: [Object], default: [] })
  education: Record<string, any>[];

  @Prop({ type: [String], default: [] })
  skills: string[];

  @Prop({ type: [Object], default: [] })
  projects: Record<string, any>[];

  @Prop({ type: [String], default: [] })
  certifications: string[];

  @Prop({ type: [String], default: [] })
  languages: string[];

  @Prop({ default: () => new Date() })
  createdAt: Date;

  @Prop({ default: () => new Date() })
  updatedAt: Date;
}

export const ResumeDataSchema = SchemaFactory.createForClass(ResumeDataModel);

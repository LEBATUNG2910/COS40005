import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/* ─── Resume Template ─────────────────────────────────────────── */
export type ResumeTemplateDocument = ResumeTemplate & Document;

@Schema({ collection: 'resumeTemplates', timestamps: false })
export class ResumeTemplate {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ required: true, maxlength: 100 })
  name: string;

  @Prop({ required: true, maxlength: 100, unique: true })
  slug: string;

  @Prop({ type: String, default: null, maxlength: 500 })
  description: string | null;

  @Prop({ type: String, default: null, maxlength: 500 })
  thumbnailUrl: string | null;

  @Prop({ required: true })
  category: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  sortOrder: number;

  @Prop({ default: () => new Date() })
  createdAt: Date;
}

export const ResumeTemplateSchema =
  SchemaFactory.createForClass(ResumeTemplate);

/* ─── Skill ───────────────────────────────────────────────────── */
export type SkillDocument = Skill & Document;

@Schema({ collection: 'skills', timestamps: false })
export class Skill {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ required: true, maxlength: 100, unique: true })
  name: string;

  @Prop({ required: true })
  category: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const SkillSchema = SchemaFactory.createForClass(Skill);

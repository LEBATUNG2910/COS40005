import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/* ─── CV Analysis ─────────────────────────────────────────────── */
export type CvAnalysisDocument = CvAnalysis & Document;

@Schema({ collection: 'cvAnalyses', timestamps: false })
export class CvAnalysis {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  cvUploadId: string;

  @Prop({ required: true })
  jobDescription: string;

  @Prop({ required: true, min: 0, max: 100 })
  matchScore: number;

  @Prop({ type: Number, default: null })
  bm25RawScore: number | null;

  @Prop({ type: Number, default: null })
  skillMatchRatio: number | null;

  @Prop({ type: String, default: null })
  overallFeedback: string | null;

  @Prop({ default: () => new Date() })
  analyzedAt: Date;
}

export const CvAnalysisSchema = SchemaFactory.createForClass(CvAnalysis);
CvAnalysisSchema.index({ userId: 1 });
CvAnalysisSchema.index({ cvUploadId: 1 });

/* ─── CV Analysis Skills ──────────────────────────────────────── */
export type CvAnalysisSkillDocument = CvAnalysisSkill & Document;

@Schema({ collection: 'cvAnalysisSkills', timestamps: false })
export class CvAnalysisSkill {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ required: true })
  analysisId: string;

  @Prop({ required: true })
  skillId: string;

  @Prop({ required: true, enum: ['CV', 'JD', 'MISSING'] })
  source: string;
}

export const CvAnalysisSkillSchema =
  SchemaFactory.createForClass(CvAnalysisSkill);
CvAnalysisSkillSchema.index({ analysisId: 1, source: 1 });
CvAnalysisSkillSchema.index(
  { analysisId: 1, skillId: 1, source: 1 },
  { unique: true },
);

/* ─── AI Insights ─────────────────────────────────────────────── */
export type AiInsightDocument = AiInsight & Document;

@Schema({ collection: 'aiInsights', timestamps: false })
export class AiInsight {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ required: true })
  analysisId: string;

  @Prop({ required: true, enum: ['STRENGTH', 'WEAKNESS'] })
  insightType: string;

  @Prop({ required: true, maxlength: 1000 })
  content: string;

  @Prop({ default: 0 })
  sortOrder: number;
}

export const AiInsightSchema = SchemaFactory.createForClass(AiInsight);
AiInsightSchema.index({ analysisId: 1, insightType: 1 });

/* ─── AI Suggestions ──────────────────────────────────────────── */
export type AiSuggestionDocument = AiSuggestion & Document;

@Schema({ collection: 'aiSuggestions', timestamps: false })
export class AiSuggestion {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ required: true })
  analysisId: string;

  @Prop({ required: true, maxlength: 100 })
  skillName: string;

  @Prop({ required: true, maxlength: 1000 })
  reason: string;

  @Prop({ default: 0 })
  sortOrder: number;
}

export const AiSuggestionSchema = SchemaFactory.createForClass(AiSuggestion);
AiSuggestionSchema.index({ analysisId: 1 });

/* ─── Learning Resources ──────────────────────────────────────── */
export type LearningResourceDocument = LearningResource & Document;

@Schema({ collection: 'learningResources', timestamps: false })
export class LearningResource {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ required: true })
  suggestionId: string;

  @Prop({ required: true, maxlength: 300 })
  name: string;

  @Prop({ required: true, maxlength: 500 })
  url: string;

  @Prop({ enum: ['free', 'paid'], default: 'free' })
  resourceType: string;

  @Prop({
    required: true,
    enum: ['Roadmap.sh', 'FreeCodeCamp', 'Udemy', 'YouTube', 'Other'],
  })
  platform: string;

  @Prop({ default: 0 })
  sortOrder: number;
}

export const LearningResourceSchema =
  SchemaFactory.createForClass(LearningResource);
LearningResourceSchema.index({ suggestionId: 1 });

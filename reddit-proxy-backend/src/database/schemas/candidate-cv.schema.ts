import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/* ─── Candidate CV ────────────────────────────────────────────── */
export type CandidateCvDocument = CandidateCv & Document;

@Schema({ collection: 'candidateCVs', timestamps: false })
export class CandidateCv {
  @Prop({ type: String, required: true })
  _id: string;

  // Ai upload batch này (HR user)
  @Prop({ required: true })
  uploadedBy: string;

  // Tên ứng viên (optional — có thể extract từ CV)
  @Prop({ type: String, default: null, maxlength: 200 })
  candidateName: string | null;

  @Prop({ required: true, maxlength: 255 })
  originalFileName: string;

  @Prop({ type: String, default: null, maxlength: 500 })
  localFilePath: string | null;

  @Prop({ type: String, default: null, maxlength: 500 })
  cloudinaryPublicId: string | null;

  @Prop({ type: String, default: null, maxlength: 500 })
  cloudinaryUrl: string | null;

  @Prop({ required: true, min: 1 })
  fileSize: number;

  @Prop({ type: String, default: null })
  extractedText: string | null;

  @Prop({
    type: String,
    default: null,
    enum: ['pdftotext', 'pdf-parse', 'gemini-vision', null],
  })
  extractionMethod: string | null;

  @Prop({ type: Number, default: null })
  pageCount: number | null;

  // SHA256 hash của extractedText — dùng để detect duplicate nhanh
  @Prop({ type: String, default: null, maxlength: 64 })
  textHash: string | null;

  // Skill vector (JSON string) — dùng cho cosine similarity
  @Prop({ type: String, default: null })
  skillVector: string | null;

  @Prop({ default: () => new Date() })
  uploadedAt: Date;
}

export const CandidateCvSchema = SchemaFactory.createForClass(CandidateCv);
CandidateCvSchema.index({ uploadedBy: 1, uploadedAt: -1 });
CandidateCvSchema.index({ textHash: 1 });

/* ─── Batch Analysis (kết quả score 1 CV vs 1 JD) ────────────── */
export type BatchAnalysisDocument = BatchAnalysis & Document;

@Schema({ collection: 'batchAnalyses', timestamps: false })
export class BatchAnalysis {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ required: true })
  candidateCvId: string;

  @Prop({ required: true })
  uploadedBy: string;

  // Hash của JD text — dùng để cache, tránh score lại cùng 1 JD
  @Prop({ required: true, maxlength: 64 })
  jdHash: string;

  @Prop({ required: true })
  jobDescription: string;

  @Prop({ required: true, min: 0, max: 100 })
  matchScore: number;

  @Prop({ type: Number, default: null })
  bm25Score: number | null;

  @Prop({ type: Number, default: null })
  skillMatchRatio: number | null;

  @Prop({ type: Number, default: null })
  depthScore: number | null;

  @Prop({ type: [String], default: [] })
  cvSkills: string[];

  @Prop({ type: [String], default: [] })
  missingSkills: string[];

  @Prop({ type: String, default: null })
  overallFeedback: string | null;

  @Prop({ default: () => new Date() })
  analyzedAt: Date;
}

export const BatchAnalysisSchema = SchemaFactory.createForClass(BatchAnalysis);
BatchAnalysisSchema.index({ candidateCvId: 1, jdHash: 1 }, { unique: true }); // cache key
BatchAnalysisSchema.index({ uploadedBy: 1, jdHash: 1, matchScore: -1 });

/* ─── Duplicate Pairs ─────────────────────────────────────────── */
export type DuplicatePairDocument = DuplicatePair & Document;

@Schema({ collection: 'duplicatePairs', timestamps: false })
export class DuplicatePair {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ required: true })
  uploadedBy: string;

  @Prop({ required: true })
  cvIdA: string;

  @Prop({ required: true })
  cvIdB: string;

  // 1.0 = identical, 0.9+ = near-duplicate
  @Prop({ required: true, min: 0, max: 1 })
  similarity: number;

  // 'exact' | 'near'
  @Prop({ required: true, enum: ['exact', 'near'] })
  duplicateType: string;

  @Prop({ default: () => new Date() })
  detectedAt: Date;
}

export const DuplicatePairSchema = SchemaFactory.createForClass(DuplicatePair);
DuplicatePairSchema.index({ uploadedBy: 1 });
DuplicatePairSchema.index({ cvIdA: 1, cvIdB: 1 }, { unique: true });

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CvUploadDocument = CvUpload & Document;

@Schema({ collection: 'cvUploads', timestamps: false })
export class CvUpload {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  templateId: string;

  @Prop({ required: true, maxlength: 255 })
  originalFileName: string;

  @Prop({ required: true, maxlength: 500 })
  storedFilePath: string;

  @Prop({ type: String, default: null, maxlength: 500 })
  cloudinaryPublicId: string | null;

  @Prop({ required: true, min: 1, max: 10485760 })
  fileSize: number;

  @Prop({ required: true, maxlength: 100 })
  mimeType: string;

  @Prop({ type: Number, default: null })
  pageCount: number | null;

  @Prop({ type: String, default: null })
  extractedText: string | null;

  @Prop({ type: String, default: null, enum: ['pdftotext', 'pdf-parse', 'gemini-vision', null] })
  extractionMethod: string | null;

  @Prop({ default: true })
  isLatest: boolean;

  @Prop({ default: () => new Date() })
  uploadedAt: Date;
}

export const CvUploadSchema = SchemaFactory.createForClass(CvUpload);

CvUploadSchema.index({ userId: 1, isLatest: 1 });
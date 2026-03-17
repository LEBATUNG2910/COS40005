import {
  Controller,
  Post,
  Patch,
  Get,
  Body,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Request,
  BadRequestException,
  NotFoundException,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CvService } from './cv.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { type Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Controller('cv')
export class CvController {
  constructor(
    private readonly cvService: CvService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadCV(
    @UploadedFile() file: Express.Multer.File,
    @Body('templateId') templateId: string,
    @Request() req,
  ) {
    if (!file) throw new BadRequestException('No file uploaded');
    const record = await this.cvService.saveCV(
      req.user.userId,
      file,
      parseInt(templateId) || 1,
    );
    return {
      message: 'CV uploaded successfully',
      fileName: record.fileName,
      templateId: record.templateId,
      textLength: record.extractedText.length,
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMyCV(@Request() req) {
    const cv = await this.cvService.getCVByUser(req.user.userId);
    if (!cv) return { hasCV: false };
    return {
      hasCV: true,
      fileName: cv.originalFileName,
      templateId: cv.templateId,
      uploadedAt: cv.uploadedAt,
      extractionMethod: cv.extractionMethod,
      preview: cv.extractedText?.substring(0, 500),
    };
  }

  @Get('preview')
  @UseGuards(JwtAuthGuard)
  async previewCV(@Request() req, @Res({ passthrough: false }) res: Response) {
    const cv = await this.cvService.getCVByUser(req.user.userId);
    if (!cv) throw new NotFoundException('No CV uploaded yet');

    // Serve local file trực tiếp — full PDF với định dạng gốc
    const localPath = cv.localFilePath;
    if (localPath && fs.existsSync(localPath)) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `inline; filename="${cv.originalFileName}"`,
      );
      res.setHeader('Cache-Control', 'private, max-age=3600');
      fs.createReadStream(localPath).pipe(res as any);
      return;
    }

    /* ── Cloudinary fallback (uncomment khi upgrade plan) ──────────
    if (cv.cloudinaryPublicId) {
      const signedUrl = this.cloudinaryService.generateSignedUrl(cv.cloudinaryPublicId);
      const cloudinaryRes = await fetch(signedUrl);
      if (cloudinaryRes.ok) {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${cv.originalFileName}"`);
        const { Readable } = await import('stream');
        Readable.from(cloudinaryRes.body as any).pipe(res as any);
        return;
      }
    }
    ── End Cloudinary fallback ── */

    throw new NotFoundException('CV file not found. Please re-upload your CV.');
  }

  @Patch('update-text')
  @UseGuards(JwtAuthGuard)
  async updateCVText(
    @Request() req,
    @Body('extractedText') extractedText: string,
  ) {
    if (!extractedText?.trim())
      throw new BadRequestException('Text content is required');
    await this.cvService.updateCVText(req.user.userId, extractedText);
    return { message: 'CV text updated successfully' };
  }

  @Post('analyze')
  @UseGuards(JwtAuthGuard)
  async analyzeCV(
    @Request() req,
    @Body('jobDescription') jobDescription: string,
  ) {
    if (!jobDescription?.trim())
      throw new BadRequestException('Job description is required');
    return this.cvService.analyzeCV(req.user.userId, jobDescription);
  }

  // GET /api/cv/history — lịch sử các lần analyze
  @Get('history')
  @UseGuards(JwtAuthGuard)
  async getHistory(@Request() req) {
    return this.cvService.getAnalysisHistory(req.user.userId);
  }
}

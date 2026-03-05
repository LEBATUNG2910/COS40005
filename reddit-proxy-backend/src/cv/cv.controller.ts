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
  StreamableFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CvService } from './cv.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { type Response } from 'express';
import * as fs from 'fs';

@Controller('cv')
export class CvController {
  constructor(private readonly cvService: CvService) {}

  // POST /api/cv/upload
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

  // GET /api/cv/me
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMyCV(@Request() req) {
    const cv = this.cvService.getCVByUser(req.user.userId);
    if (!cv) return { hasCV: false };
    return {
      hasCV: true,
      fileName: cv.fileName,
      templateId: cv.templateId,
      uploadedAt: cv.uploadedAt,
      preview: cv.extractedText.substring(0, 500),
    };
  }

  // GET /api/cv/preview — stream PDF file to browser
  @Get('preview')
  @UseGuards(JwtAuthGuard)
  async previewCV(
    @Request() req,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const cv = this.cvService.getCVByUser(req.user.userId);
    if (!cv) throw new NotFoundException('No CV uploaded yet');

    if (!cv.filePath || !fs.existsSync(cv.filePath)) {
      throw new NotFoundException('PDF file not found on server');
    }

    const fileStream = fs.createReadStream(cv.filePath);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${cv.fileName}"`,
    });

    return new StreamableFile(fileStream);
  }

  // PATCH /api/cv/update-text
  @Patch('update-text')
  @UseGuards(JwtAuthGuard)
  async updateCVText(
    @Request() req,
    @Body('extractedText') extractedText: string,
  ) {
    if (!extractedText?.trim())
      throw new BadRequestException('Text content is required');
    this.cvService.updateCVText(req.user.userId, extractedText);
    return { message: 'CV text updated successfully' };
  }

  // POST /api/cv/analyze
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
}
import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ResumeService, type ResumeData } from './resume.service';

@Controller('resume')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  // POST /api/resume/parse
  // Parse CV đã upload của user → trả về structured JSON
  @Post('parse')
  @UseGuards(JwtAuthGuard)
  async parseCV(@Request() req) {
    return this.resumeService.parseCV(req.user.userId);
  }

  // POST /api/resume/reparse
  // Xóa cache, parse lại từ CV gốc (user muốn reset)
  @Post('reparse')
  @UseGuards(JwtAuthGuard)
  async reparseCV(@Request() req) {
    return this.resumeService.reparseCV(req.user.userId);
  }

  // GET /api/resume/data
  // Lấy resume data hiện tại (đã parse hoặc đã user chỉnh sửa)
  @Get('data')
  @UseGuards(JwtAuthGuard)
  async getResumeData(@Request() req) {
    const data = this.resumeService.getResumeData(req.user.userId);
    if (!data) return { hasData: false };
    return { hasData: true, ...data };
  }

  // PUT /api/resume/data
  // Lưu resume data sau khi user chỉnh sửa trên form
  @Put('data')
  @UseGuards(JwtAuthGuard)
  async saveResumeData(
    @Request() req,
    @Body() body: ResumeData,
  ) {
    if (!body?.personalInfo) {
      throw new BadRequestException('Invalid resume data structure');
    }
    this.resumeService.saveResumeData(req.user.userId, body);
    return { message: 'Resume data saved successfully' };
  }
}
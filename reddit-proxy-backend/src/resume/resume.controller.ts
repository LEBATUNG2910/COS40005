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
import { ResumeService } from './resume.service';
import type { ResumeData } from './resume.service';
import { JwtPayload } from '../common/decorators/current-user.decorator';

interface RequestWithUser extends Request {
  user: JwtPayload;
}

@Controller('resume')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  // POST /api/resume/parse
  @Post('parse')
  @UseGuards(JwtAuthGuard)
  async parseCV(@Request() req: RequestWithUser) {
    return this.resumeService.parseCV(req.user.userId);
  }

  // POST /api/resume/reparse
  @Post('reparse')
  @UseGuards(JwtAuthGuard)
  async reparseCV(@Request() req: RequestWithUser) {
    return this.resumeService.reparseCV(req.user.userId);
  }

  // GET /api/resume/data
  @Get('data')
  @UseGuards(JwtAuthGuard)
  async getResumeData(@Request() req: RequestWithUser) {
    const data = await this.resumeService.getResumeData(req.user.userId);
    if (!data) return { hasData: false };
    return { hasData: true, ...data };
  }

  // PUT /api/resume/data
  @Put('data')
  @UseGuards(JwtAuthGuard)
  async saveResumeData(
    @Request() req: RequestWithUser,
    @Body() body: ResumeData,
  ) {
    if (!body?.personalInfo)
      throw new BadRequestException('Invalid resume data structure');
    await this.resumeService.saveResumeData(req.user.userId, body);
    return { message: 'Resume data saved successfully' };
  }
}

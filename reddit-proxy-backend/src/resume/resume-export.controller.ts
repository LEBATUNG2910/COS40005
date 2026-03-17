import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ResumeExportService } from './resume-export.service';
import { type Response } from 'express';
import { JwtPayload } from '../common/decorators/current-user.decorator';

interface RequestWithUser extends Request {
  user: JwtPayload;
}

@Controller('resume')
export class ResumeExportController {
  constructor(private readonly exportService: ResumeExportService) {}

  // POST /api/resume/export
  @Post('export')
  @UseGuards(JwtAuthGuard)
  async exportPDF(
    @Request() req: RequestWithUser,
    @Body('templateId') templateId: number,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const pdf = await this.exportService.exportToPDF(
      req.user.userId,
      templateId || 1,
    );

    const filename = `resume-${Date.now()}.pdf`;

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': pdf.length,
    });

    return new StreamableFile(pdf);
  }
}

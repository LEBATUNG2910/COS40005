import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Query,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
  Request,
  BadRequestException,
  Param,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CvBatchService } from './cv-batch.service';

@Controller('cv-batch')
export class CvBatchController {
  constructor(private readonly cvBatchService: CvBatchService) {}

  // POST /api/cv-batch/upload
  // Upload nhiều CV ứng viên cùng lúc (tối đa 20 file)
  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('files', 20))
  async uploadBatch(
    @UploadedFiles() files: Express.Multer.File[],
    @Request() req,
  ) {
    if (!files || files.length === 0)
      throw new BadRequestException('No files uploaded');
    return this.cvBatchService.uploadBatch(req.user.userId, files);
  }

  // GET /api/cv-batch/list
  // Lấy danh sách tất cả CV ứng viên đã upload
  @Get('list')
  @UseGuards(JwtAuthGuard)
  async listCVs(@Request() req) {
    return this.cvBatchService.listCVs(req.user.userId);
  }

  // GET /api/cv-batch/rank?jd=...&topN=10
  // Rank tất cả CV theo JD, trả về top N
  @Get('rank')
  @UseGuards(JwtAuthGuard)
  async rankCVs(
    @Request() req,
    @Query('jd') jobDescription: string,
    @Query('topN') topN: string,
  ) {
    if (!jobDescription?.trim())
      throw new BadRequestException('Job description (jd) is required');
    return this.cvBatchService.rankCVs(
      req.user.userId,
      jobDescription,
      parseInt(topN) || 10,
    );
  }

  // GET /api/cv-batch/compare?cvA=...&cvB=...&jd=...
  // So sánh chi tiết 2 CV vs JD
  @Get('compare')
  @UseGuards(JwtAuthGuard)
  async compareTwoCVs(
    @Request() req,
    @Query('cvA') cvIdA: string,
    @Query('cvB') cvIdB: string,
    @Query('jd') jobDescription: string,
  ) {
    if (!cvIdA || !cvIdB)
      throw new BadRequestException('cvA and cvB are required');
    if (!jobDescription?.trim())
      throw new BadRequestException('Job description (jd) is required');
    if (cvIdA === cvIdB)
      throw new BadRequestException('Cannot compare a CV with itself');
    return this.cvBatchService.compareTwoCVs(
      req.user.userId,
      cvIdA,
      cvIdB,
      jobDescription,
    );
  }

  // DELETE /api/cv-batch/:cvId
  // Xóa 1 CV ứng viên
  @Delete(':cvId')
  @UseGuards(JwtAuthGuard)
  async deleteCv(@Request() req, @Param('cvId') cvId: string) {
    await this.cvBatchService.deleteCandidateCv(req.user.userId, cvId);
    return { message: 'CV deleted successfully' };
  }
}

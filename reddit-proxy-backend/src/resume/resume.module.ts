import { Module } from '@nestjs/common';
import { ResumeController } from './resume.controller';
import { ResumeService } from './resume.service';
import { ResumeExportService } from './resume-export.service';
import { ResumeExportController } from './resume-export.controller';
import { CvModule } from '../cv/cv.module';

@Module({
  imports: [CvModule],
  controllers: [ResumeController, ResumeExportController],
  providers: [ResumeService, ResumeExportService],
  exports: [ResumeService],
})
export class ResumeModule {}
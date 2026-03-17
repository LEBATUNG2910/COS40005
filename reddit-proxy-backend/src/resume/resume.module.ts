import { Module } from '@nestjs/common';
import { ResumeController } from './resume.controller';
import { ResumeService } from './resume.service';
import { ResumeExportController } from './resume-export.controller';
import { ResumeExportService } from './resume-export.service';
import { CvModule } from '../cv/cv.module';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [CvModule, DatabaseModule],
  controllers: [ResumeController, ResumeExportController],
  providers: [ResumeService, ResumeExportService],
})
export class ResumeModule {}

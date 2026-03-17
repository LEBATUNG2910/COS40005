import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CvBatchController } from './cv-batch.controller';
import { CvBatchService } from './cv-batch.service';
import { CvModule } from '../cv/cv.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    CloudinaryModule,
    CvModule,
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/batch',
        filename: (req, file, cb) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `batch-${unique}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowed = ['.pdf', '.doc', '.docx'];
        if (allowed.includes(extname(file.originalname).toLowerCase()))
          cb(null, true);
        else cb(new Error('Only PDF, DOC, DOCX allowed'), false);
      },
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB per file
    }),
  ],
  controllers: [CvBatchController],
  providers: [CvBatchService],
  exports: [CvBatchService],
})
export class CvBatchModule {}

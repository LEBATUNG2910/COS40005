import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CvController } from './cv.controller';
import { CvService } from './cv.service';
import { DatabaseModule } from '../database/database.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    DatabaseModule,
    CloudinaryModule,
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `cv-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowed = ['.pdf', '.doc', '.docx'];
        const ext = extname(file.originalname).toLowerCase();
        if (allowed.includes(ext)) cb(null, true);
        else cb(new Error('Only PDF, DOC, DOCX allowed'), false);
      },
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  ],
  controllers: [CvController],
  providers: [CvService],
  exports: [CvService],
})
export class CvModule {}
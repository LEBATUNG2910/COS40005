import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';

export interface CloudinaryUploadResult {
  publicId: string; // dùng để xóa sau này
  secureUrl: string; // URL truy cập file
  bytes: number;
}

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  // ─── Upload PDF lên Cloudinary ────────────────────────────────
  async uploadPDF(
    filePath: string,
    userId: string,
  ): Promise<CloudinaryUploadResult> {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: `hirewise/cvs/${userId}`,
        resource_type: 'raw', // raw = non-image files (PDF, DOCX...)
        format: 'pdf',
        use_filename: true,
        unique_filename: true,
        overwrite: false,
      });

      return {
        publicId: result.public_id,
        secureUrl: result.secure_url,
        bytes: result.bytes,
      };
    } catch (err) {
      console.error('Cloudinary upload error:', err);
      throw new InternalServerErrorException(
        'Failed to upload CV to cloud storage',
      );
    }
  }

  // ─── Xóa file cũ khỏi Cloudinary ─────────────────────────────
  async deletePDF(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
    } catch (err) {
      // Không throw — xóa thất bại không nên block luồng chính
      console.warn('Cloudinary delete warning:', err);
    }
  }

  // ─── Xóa file local sau khi upload thành công ─────────────────
  deleteLocalFile(filePath: string): void {
    try {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } catch (err) {
      console.warn('Could not delete local temp file:', err);
    }
  }
}

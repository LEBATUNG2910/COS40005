// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as fs from 'fs';

async function bootstrap() {
  // Tạo thư mục uploads nếu chưa có (cần thiết khi deploy)
  if (!fs.existsSync('./uploads')) fs.mkdirSync('./uploads', { recursive: true });
  if (!fs.existsSync('./uploads/batch')) fs.mkdirSync('./uploads/batch', { recursive: true });

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');
  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Server đang chạy thành công!`);
  console.log(`📡 Chế độ: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API Endpoint: http://localhost:${port}/api`);
}

void bootstrap();
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Cho phép React frontend gọi vào (local + mobile + production)
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Global validation — tự động validate request body
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  // Prefix tất cả route với /api
  app.setGlobalPrefix('api');

  // Listen trên 0.0.0.0 để expose ra network (điện thoại cùng WiFi)
  await app.listen(3001, '0.0.0.0');
  console.log('✅ Backend NestJS chạy tại http://localhost:3001');
}

void bootstrap();

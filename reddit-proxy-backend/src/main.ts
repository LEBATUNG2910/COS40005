// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Cho phép React frontend gọi vào
  app.enableCors({
    origin: 'http://localhost:5173',
  });

  // Prefix tất cả route với /api
  app.setGlobalPrefix('api');

  await app.listen(3001);
  console.log('✅ Backend NestJS chạy tại http://localhost:3001');
}
bootstrap();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  // Ignorar certificados auto-firmados (solo para desarrollo)
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  app.enableCors({
    origin: ['http://localhost:5174', 'http://localhost:5173'],
    methods: 'GET,POST,PUT,PATCH,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

  const dataSource = app.get(DataSource);

  await app.listen(3000);
  console.log('Servidor corriendo en http://localhost:3000');
}

bootstrap();

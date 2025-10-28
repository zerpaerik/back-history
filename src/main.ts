import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const corsOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
    : true;
  app.enableCors({ origin: corsOrigins, credentials: true });
  await app.listen(Number(process.env.PORT) || 3000, '0.0.0.0');
}
bootstrap();

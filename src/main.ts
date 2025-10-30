import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Crear carpeta de uploads si no existe
  const uploadsDir = process.env.NODE_ENV === 'production' 
    ? '/app/uploads/signatures'
    : join(__dirname, '..', 'uploads', 'signatures');
  console.log('📁 Uploads directory path:', uploadsDir);
  console.log('📁 Current directory:', __dirname);
  
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('✅ Created uploads directory');
  } else {
    console.log('✅ Uploads directory already exists');
  }
  
  // Servir archivos estáticos con headers CORS
  const uploadsBase = process.env.NODE_ENV === 'production'
    ? '/app/uploads'
    : join(__dirname, '..', 'uploads');
    
  app.useStaticAssets(uploadsBase, {
    prefix: '/uploads/',
    setHeaders: (res) => {
      res.set('Access-Control-Allow-Origin', '*');
      res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
      res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    },
  });
  
  // Configuración de CORS más robusta
  const corsOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
    : true; // En desarrollo permite todos los orígenes
  
  app.enableCors({
    origin: (origin, callback) => {
      // Permitir peticiones sin origin (como Postman, curl, etc.)
      if (!origin) {
        return callback(null, true);
      }
      
      // Si corsOrigins es true, permitir todos
      if (corsOrigins === true) {
        return callback(null, true);
      }
      
      // Verificar si el origin está en la lista permitida
      const allowed = (corsOrigins as string[]).some(allowedOrigin => {
        // Permitir coincidencia exacta
        if (origin === allowedOrigin) return true;
        
        // Permitir subdominios de vercel.app
        if (allowedOrigin.includes('vercel.app') && origin.endsWith('vercel.app')) {
          return true;
        }
        
        return false;
      });
      
      if (allowed) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
      'Access-Control-Allow-Origin',
    ],
    exposedHeaders: ['Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    maxAge: 3600, // Cache preflight por 1 hora
  });
  
  await app.listen(Number(process.env.PORT) || 3000, '0.0.0.0');
}
bootstrap();

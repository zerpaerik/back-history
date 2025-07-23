import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
    Body,
    BadRequestException,
    Logger,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { AiService } from '../ai/ai.service';
  
  @Controller('audio')
  export class AudioController {
    private readonly logger = new Logger(AudioController.name);
    
    constructor(private readonly aiService: AiService) {}
  
    @Post('translate')
    @UseInterceptors(FileInterceptor('audio')) // 'audio' es el nombre del campo en el FormData
    async translateAudio(
      @UploadedFile() audioFile: Express.Multer.File,
      @Body('language') language: string, // Recibimos el idioma desde el body
    ) {
      this.logger.log('=== NUEVA SOLICITUD DE TRADUCCIÓN ===');
      this.logger.log(`Timestamp: ${new Date().toISOString()}`);
      
      // Log de información del archivo
      this.logger.log('Información del archivo de audio:');
      if (audioFile) {
        this.logger.log(`- Nombre original: ${audioFile.originalname}`);
        this.logger.log(`- Tipo MIME: ${audioFile.mimetype}`);
        this.logger.log(`- Tamaño: ${audioFile.size} bytes`);
        this.logger.log(`- Buffer length: ${audioFile.buffer?.length || 'undefined'}`);
      } else {
        this.logger.error('- Archivo de audio NO recibido');
      }
      
      // Log del idioma
      this.logger.log(`Idioma solicitado: ${language || 'NO ESPECIFICADO'}`);
      
      if (!audioFile) {
        this.logger.error('Error: Audio file is required');
        throw new BadRequestException('Audio file is required.');
      }
      if (!language) {
        this.logger.error('Error: Target language is required');
        throw new BadRequestException('Target language is required.');
      }

      try {
        this.logger.log('Iniciando proceso de transcripción...');
        // 1. Transcribir el audio a texto
        const transcribedText = await this.aiService.transcribeAudio(audioFile.buffer);
        this.logger.log(`Texto transcrito: "${transcribedText}"`);

        this.logger.log('Iniciando proceso de traducción...');
        // 2. Traducir el texto
        const translatedText = await this.aiService.translateText(
          transcribedText,
          language,
        );
        this.logger.log(`Texto traducido: "${translatedText}"`);

        // 3. Devolver el resultado
        const result = {
          original: transcribedText,
          translation: translatedText,
        };
        
        this.logger.log('=== SOLICITUD COMPLETADA EXITOSAMENTE ===');
        return result;
      } catch (error) {
        this.logger.error('=== ERROR EN LA SOLICITUD ===');
        this.logger.error(`Error: ${error.message}`);
        this.logger.error(`Stack: ${error.stack}`);
        throw error;
      }
    }
  }
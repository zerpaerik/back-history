import { Controller, Post, Body, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MedicalSuggestionsDto } from './dto/medical-suggestions.dto';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('medical-suggestions')
  @UseGuards(JwtAuthGuard)
  async generateMedicalSuggestions(@Body() dto: MedicalSuggestionsDto) {
    if (!this.aiService.isEnabled()) {
      return {
        success: false,
        error: 'Servicio de IA deshabilitado',
        message: 'La funcionalidad de IA está desactivada en este entorno.'
      };
    }
    try {
      const suggestions = await this.aiService.generateMedicalSuggestions({
        symptoms: dto.symptoms,
        specialty: dto.specialty,
        patientAge: dto.patientAge,
        patientGender: dto.patientGender,
        currentFindings: dto.currentFindings,
        vitalSigns: dto.vitalSigns
      });
      
      return {
        success: true,
        data: suggestions,
        message: 'Sugerencias médicas generadas exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Error al generar sugerencias médicas'
      };
    }
  }

  @Post('transcribe')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('audio'))
  async transcribeAudio(
    @UploadedFile() audioFile: Express.Multer.File,
    @Body('language') language: string = 'es'
  ) {
    if (!this.aiService.isEnabled()) {
      return {
        success: false,
        error: 'Servicio de IA deshabilitado'
      };
    }
    try {
      if (!audioFile) {
        return {
          success: false,
          error: 'No se proporcionó archivo de audio'
        };
      }

      // Validar tamaño del archivo (máximo 25MB)
      const maxSize = 25 * 1024 * 1024; // 25MB en bytes
      if (audioFile.size > maxSize) {
        return {
          success: false,
          error: 'El archivo de audio es demasiado grande. Máximo 25MB.'
        };
      }

      // Validar tipo de archivo
      const allowedTypes = ['audio/webm', 'audio/mp4', 'audio/mpeg', 'audio/wav', 'audio/ogg'];
      if (!allowedTypes.includes(audioFile.mimetype)) {
        return {
          success: false,
          error: 'Formato de audio no soportado. Use WebM, MP4, MP3, WAV u OGG.'
        };
      }

      const transcription = await this.aiService.transcribeAudio(audioFile.buffer, language);
      
      return {
        success: true,
        data: {
          transcription,
          originalFilename: audioFile.originalname,
          fileSize: audioFile.size,
          language
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

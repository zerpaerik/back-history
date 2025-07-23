import { IsOptional, IsString, IsIn } from 'class-validator';

export class TranscriptionDto {
  @IsOptional()
  @IsString()
  @IsIn(['es', 'en', 'fr', 'pt', 'it', 'de'])
  language?: string = 'es';
}

export interface TranscriptionResponse {
  success: boolean;
  data?: {
    transcription: string;
    originalFilename: string;
    fileSize: number;
    language: string;
  };
  error?: string;
}

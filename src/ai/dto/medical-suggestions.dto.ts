import { IsString, IsOptional, IsNumber, IsNotEmpty } from 'class-validator';

export class MedicalSuggestionsDto {
  @IsString()
  @IsNotEmpty()
  symptoms: string;

  @IsString()
  @IsNotEmpty()
  specialty: string;

  @IsOptional()
  @IsNumber()
  patientAge?: number;

  @IsOptional()
  @IsString()
  patientGender?: string;

  @IsOptional()
  @IsString()
  currentFindings?: string;

  @IsOptional()
  @IsString()
  vitalSigns?: string;
}

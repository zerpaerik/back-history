import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsDateString,
  IsEnum,
  MaxLength,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MedicalRecordStatus } from '../entities/medical-record.entity';
import { CreateTriageDto } from './create-triage.dto';

export class CreateMedicalRecordDto {
  @IsUUID('4')
  @IsNotEmpty()
  patientId: string;

  @IsUUID('4')
  @IsNotEmpty()
  professionalId: string;

  @IsUUID('4')
  @IsNotEmpty()
  specialtyId: string;

  @IsDateString()
  @IsOptional()
  appointmentDate?: string;

  @IsString()
  @IsOptional()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'La hora debe tener formato HH:mm (ej: 14:30)',
  })
  appointmentTimeFrom?: string;

  @IsString()
  @IsOptional()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'La hora debe tener formato HH:mm (ej: 16:30)',
  })
  appointmentTimeTo?: string;

  @IsEnum(MedicalRecordStatus)
  @IsOptional()
  status?: MedicalRecordStatus;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  chiefComplaint?: string;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  currentIllness?: string;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  physicalExamination?: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  diagnosis?: string;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  treatment?: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  observations?: string;

  @ValidateNested()
  @Type(() => CreateTriageDto)
  @IsOptional()
  triage?: CreateTriageDto;
}

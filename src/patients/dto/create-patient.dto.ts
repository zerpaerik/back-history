import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsEnum,
  IsDateString,
  IsPhoneNumber,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  IdentificationType,
  MaritalStatus,
  EducationLevel,
  Gender,
} from '../entities/patient.entity';

export class CreatePatientDto {
  // Nombres y Apellidos
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  firstName: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  secondName?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  firstLastname: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  secondLastname?: string;

  // Identificación
  @IsEnum(IdentificationType)
  @IsNotEmpty()
  identificationType: IdentificationType;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  identificationNumber: string;

  // Datos Personales
  @IsDateString()
  @IsNotEmpty()
  birthDate: string;

  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;

  @IsEnum(MaritalStatus)
  @IsNotEmpty()
  maritalStatus: MaritalStatus;

  @IsEnum(EducationLevel)
  @IsNotEmpty()
  educationLevel: EducationLevel;

  // Contacto
  @IsString()
  @IsOptional()
  @MaxLength(15)
  phone?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  address?: string;

  // Contacto de Emergencia
  @IsString()
  @IsOptional()
  @MaxLength(100)
  emergencyContactName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(15)
  emergencyContactPhone?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  emergencyContactRelationship?: string;

  // Información Médica Adicional
  @IsString()
  @IsOptional()
  @MaxLength(10)
  bloodType?: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  allergies?: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  observations?: string;
}

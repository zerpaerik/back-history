import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsEmail,
  IsPhoneNumber,
  MaxLength,
  MinLength,
  IsArray,
  IsUUID,
  IsDateString,
  Matches,
} from 'class-validator';
import { IdentificationType, ProfessionalStatus } from '../entities/professional.entity';

export class CreateProfessionalDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  secondName?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  firstLastname: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  secondLastname?: string;

  @IsEnum(IdentificationType)
  identificationType: IdentificationType;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/^[0-9A-Z]+$/, {
    message: 'El número de identificación debe contener solo números y letras mayúsculas',
  })
  identificationNumber: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/^[0-9A-Z]+$/, {
    message: 'El número de colegiatura debe contener solo números y letras mayúsculas',
  })
  licenseNumber: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(100)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(9)
  @MaxLength(20)
  @Matches(/^[0-9+\-\s()]+$/, {
    message: 'El teléfono debe contener solo números, espacios, paréntesis, + y -',
  })
  phone: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  address?: string;

  @IsEnum(ProfessionalStatus)
  @IsOptional()
  status?: ProfessionalStatus;

  @IsDateString()
  @IsOptional()
  licenseExpiryDate?: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  observations?: string;

  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  specialtyIds?: string[];
}

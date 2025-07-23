import { PartialType } from '@nestjs/mapped-types';
import { CreateProfessionalDto } from './create-professional.dto';
import { IsOptional, IsBoolean } from 'class-validator';

export class UpdateProfessionalDto extends PartialType(CreateProfessionalDto) {
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

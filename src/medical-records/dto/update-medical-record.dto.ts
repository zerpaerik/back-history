import { PartialType } from '@nestjs/mapped-types';
import { CreateMedicalRecordDto } from './create-medical-record.dto';
import { IsOptional, IsBoolean } from 'class-validator';

export class UpdateMedicalRecordDto extends PartialType(CreateMedicalRecordDto) {
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

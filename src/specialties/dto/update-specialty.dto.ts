import { PartialType } from '@nestjs/mapped-types';
import { CreateSpecialtyDto } from './create-specialty.dto';
import { IsOptional, IsBoolean } from 'class-validator';

export class UpdateSpecialtyDto extends PartialType(CreateSpecialtyDto) {
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

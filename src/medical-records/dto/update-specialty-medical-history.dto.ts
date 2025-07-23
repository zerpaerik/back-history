import { PartialType } from '@nestjs/mapped-types';
import { CreateSpecialtyMedicalHistoryDto } from './create-specialty-medical-history.dto';

export class UpdateSpecialtyMedicalHistoryDto extends PartialType(CreateSpecialtyMedicalHistoryDto) {}

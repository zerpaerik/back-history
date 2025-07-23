import { PartialType } from '@nestjs/mapped-types';
import { CreateMedicalHistoryBaseDto } from './create-medical-history-base.dto';

export class UpdateMedicalHistoryBaseDto extends PartialType(CreateMedicalHistoryBaseDto) {}

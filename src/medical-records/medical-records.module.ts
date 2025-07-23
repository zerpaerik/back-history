import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicalRecordsService } from './medical-records.service';
import { MedicalRecordsController } from './medical-records.controller';
import { MedicalRecord } from './entities/medical-record.entity';
import { Triage } from './entities/triage.entity';
import { MedicalHistoryBase } from './entities/medical-history-base.entity';
import { SpecialtyMedicalHistory } from './entities/specialty-medical-history.entity';
import { Patient } from '../patients/entities/patient.entity';
import { Professional } from '../professionals/entities/professional.entity';
import { Specialty } from '../specialties/entities/specialty.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MedicalRecord,
      Triage,
      MedicalHistoryBase,
      SpecialtyMedicalHistory,
      Patient,
      Professional,
      Specialty,
    ])
  ],
  controllers: [MedicalRecordsController],
  providers: [MedicalRecordsService],
  exports: [MedicalRecordsService],
})
export class MedicalRecordsModule {}

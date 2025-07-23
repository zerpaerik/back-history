import { MedicalRecordStatus } from '../entities/medical-record.entity';
import { CreateTriageDto } from './create-triage.dto';
export declare class CreateMedicalRecordDto {
    patientId: string;
    professionalId: string;
    specialtyId: string;
    appointmentDate?: string;
    appointmentTimeFrom?: string;
    appointmentTimeTo?: string;
    status?: MedicalRecordStatus;
    chiefComplaint?: string;
    currentIllness?: string;
    physicalExamination?: string;
    diagnosis?: string;
    treatment?: string;
    observations?: string;
    triage?: CreateTriageDto;
}

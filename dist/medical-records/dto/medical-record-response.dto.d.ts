import { MedicalRecord, MedicalRecordStatus } from '../entities/medical-record.entity';
import { PatientResponseDto } from '../../patients/dto/patient-response.dto';
import { ProfessionalResponseDto } from '../../professionals/dto/professional-response.dto';
import { SpecialtyResponseDto } from '../../specialties/dto/specialty-response.dto';
import { Triage } from '../entities/triage.entity';
export declare class TriageResponseDto {
    id: string;
    weight: string;
    height: string;
    bloodPressure: string;
    oxygenSaturation: string;
    heartRate: string;
    temperature: string;
    observations: string;
    createdAt: Date;
    updatedAt: Date;
    triageSummary: string;
    hasData: boolean;
    constructor(triage: Triage);
}
export declare class MedicalRecordResponseDto {
    id: string;
    recordNumber: string;
    appointmentDate: Date;
    appointmentTimeFrom: string;
    appointmentTimeTo: string;
    status: MedicalRecordStatus;
    chiefComplaint: string;
    currentIllness: string;
    physicalExamination: string;
    diagnosis: string;
    treatment: string;
    observations: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    patient: PatientResponseDto | null;
    professional: ProfessionalResponseDto;
    specialty: SpecialtyResponseDto;
    triage: TriageResponseDto | null;
    appointmentInfo: string;
    hasTriageData: boolean;
    summary: string;
    isInAppointmentTime: boolean;
    constructor(medicalRecord: MedicalRecord);
}

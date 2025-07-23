import { Patient } from '../../patients/entities/patient.entity';
import { Professional } from '../../professionals/entities/professional.entity';
import { Specialty } from '../../specialties/entities/specialty.entity';
import { Triage } from './triage.entity';
import { MedicalHistoryBase } from './medical-history-base.entity';
import { SpecialtyMedicalHistory } from './specialty-medical-history.entity';
export declare enum MedicalRecordStatus {
    PENDING = "Pendiente",
    IN_PROGRESS = "En Proceso",
    COMPLETED = "Completada",
    CANCELLED = "Cancelada"
}
export declare class MedicalRecord {
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
    medicalHistoryBase: MedicalHistoryBase;
    specialtyMedicalHistory: SpecialtyMedicalHistory;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    patient: Patient;
    professional: Professional;
    specialty: Specialty;
    triage: Triage;
    getAppointmentInfo(): string;
    hasTriageData(): boolean;
    getSummary(): string;
    isInAppointmentTime(): boolean;
}

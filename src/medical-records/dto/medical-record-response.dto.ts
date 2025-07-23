import { MedicalRecord, MedicalRecordStatus } from '../entities/medical-record.entity';
import { PatientResponseDto } from '../../patients/dto/patient-response.dto';
import { ProfessionalResponseDto } from '../../professionals/dto/professional-response.dto';
import { SpecialtyResponseDto } from '../../specialties/dto/specialty-response.dto';
import { Triage } from '../entities/triage.entity';

export class TriageResponseDto {
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

  constructor(triage: Triage) {
    this.id = triage.id;
    this.weight = triage.weight;
    this.height = triage.height;
    this.bloodPressure = triage.bloodPressure;
    this.oxygenSaturation = triage.oxygenSaturation;
    this.heartRate = triage.heartRate;
    this.temperature = triage.temperature;
    this.observations = triage.observations;
    this.createdAt = triage.createdAt;
    this.updatedAt = triage.updatedAt;
    this.triageSummary = triage.getTriageSummary();
    this.hasData = triage.hasData();
  }
}

export class MedicalRecordResponseDto {
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

  constructor(medicalRecord: MedicalRecord) {
    this.id = medicalRecord.id;
    this.recordNumber = medicalRecord.recordNumber;
    this.appointmentDate = medicalRecord.appointmentDate;
    this.appointmentTimeFrom = medicalRecord.appointmentTimeFrom;
    this.appointmentTimeTo = medicalRecord.appointmentTimeTo;
    this.status = medicalRecord.status;
    this.chiefComplaint = medicalRecord.chiefComplaint;
    this.currentIllness = medicalRecord.currentIllness;
    this.physicalExamination = medicalRecord.physicalExamination;
    this.diagnosis = medicalRecord.diagnosis;
    this.treatment = medicalRecord.treatment;
    this.observations = medicalRecord.observations;
    this.isActive = medicalRecord.isActive;
    this.createdAt = medicalRecord.createdAt;
    this.updatedAt = medicalRecord.updatedAt;
    this.patient = medicalRecord.patient ? Object.assign(new PatientResponseDto(), medicalRecord.patient, {
      fullName: medicalRecord.patient.getFullName(),
      fullIdentification: medicalRecord.patient.getFullIdentification()
    }) : null;
    this.professional = new ProfessionalResponseDto(medicalRecord.professional);
    this.specialty = new SpecialtyResponseDto(medicalRecord.specialty);
    this.triage = medicalRecord.triage ? new TriageResponseDto(medicalRecord.triage) : null;
    this.appointmentInfo = medicalRecord.getAppointmentInfo();
    this.hasTriageData = medicalRecord.hasTriageData();
    this.summary = medicalRecord.getSummary();
    this.isInAppointmentTime = medicalRecord.isInAppointmentTime();
  }
}

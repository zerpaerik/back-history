"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicalRecordResponseDto = exports.TriageResponseDto = void 0;
const patient_response_dto_1 = require("../../patients/dto/patient-response.dto");
const professional_response_dto_1 = require("../../professionals/dto/professional-response.dto");
const specialty_response_dto_1 = require("../../specialties/dto/specialty-response.dto");
class TriageResponseDto {
    id;
    weight;
    height;
    bloodPressure;
    oxygenSaturation;
    heartRate;
    temperature;
    observations;
    createdAt;
    updatedAt;
    triageSummary;
    hasData;
    constructor(triage) {
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
exports.TriageResponseDto = TriageResponseDto;
class MedicalRecordResponseDto {
    id;
    recordNumber;
    appointmentDate;
    appointmentTimeFrom;
    appointmentTimeTo;
    status;
    chiefComplaint;
    currentIllness;
    physicalExamination;
    diagnosis;
    treatment;
    observations;
    isActive;
    createdAt;
    updatedAt;
    patient;
    professional;
    specialty;
    triage;
    appointmentInfo;
    hasTriageData;
    summary;
    isInAppointmentTime;
    constructor(medicalRecord) {
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
        this.patient = medicalRecord.patient ? Object.assign(new patient_response_dto_1.PatientResponseDto(), medicalRecord.patient, {
            fullName: medicalRecord.patient.getFullName(),
            fullIdentification: medicalRecord.patient.getFullIdentification()
        }) : null;
        this.professional = new professional_response_dto_1.ProfessionalResponseDto(medicalRecord.professional);
        this.specialty = new specialty_response_dto_1.SpecialtyResponseDto(medicalRecord.specialty);
        this.triage = medicalRecord.triage ? new TriageResponseDto(medicalRecord.triage) : null;
        this.appointmentInfo = medicalRecord.getAppointmentInfo();
        this.hasTriageData = medicalRecord.hasTriageData();
        this.summary = medicalRecord.getSummary();
        this.isInAppointmentTime = medicalRecord.isInAppointmentTime();
    }
}
exports.MedicalRecordResponseDto = MedicalRecordResponseDto;
//# sourceMappingURL=medical-record-response.dto.js.map
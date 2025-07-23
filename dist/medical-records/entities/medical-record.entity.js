"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicalRecord = exports.MedicalRecordStatus = void 0;
const typeorm_1 = require("typeorm");
const patient_entity_1 = require("../../patients/entities/patient.entity");
const professional_entity_1 = require("../../professionals/entities/professional.entity");
const specialty_entity_1 = require("../../specialties/entities/specialty.entity");
const triage_entity_1 = require("./triage.entity");
const medical_history_base_entity_1 = require("./medical-history-base.entity");
const specialty_medical_history_entity_1 = require("./specialty-medical-history.entity");
var MedicalRecordStatus;
(function (MedicalRecordStatus) {
    MedicalRecordStatus["PENDING"] = "Pendiente";
    MedicalRecordStatus["IN_PROGRESS"] = "En Proceso";
    MedicalRecordStatus["COMPLETED"] = "Completada";
    MedicalRecordStatus["CANCELLED"] = "Cancelada";
})(MedicalRecordStatus || (exports.MedicalRecordStatus = MedicalRecordStatus = {}));
let MedicalRecord = class MedicalRecord {
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
    medicalHistoryBase;
    specialtyMedicalHistory;
    isActive;
    createdAt;
    updatedAt;
    patient;
    professional;
    specialty;
    triage;
    getAppointmentInfo() {
        if (!this.appointmentDate)
            return 'Sin fecha programada';
        let dateObj;
        if (this.appointmentDate instanceof Date) {
            dateObj = this.appointmentDate;
        }
        else if (typeof this.appointmentDate === 'string') {
            dateObj = new Date(this.appointmentDate);
        }
        else {
            return 'Fecha inválida';
        }
        if (isNaN(dateObj.getTime())) {
            return 'Fecha inválida';
        }
        const date = dateObj.toLocaleDateString('es-PE');
        if (this.appointmentTimeFrom && this.appointmentTimeTo) {
            return `${date} de ${this.appointmentTimeFrom} a ${this.appointmentTimeTo}`;
        }
        else if (this.appointmentTimeFrom) {
            return `${date} a las ${this.appointmentTimeFrom}`;
        }
        return date;
    }
    hasTriageData() {
        return this.triage?.hasData() || false;
    }
    getSummary() {
        return `HC-${this.recordNumber} | ${this.patient?.getFullName()} | ${this.specialty?.name} | Dr. ${this.professional?.getFullName()}`;
    }
    isInAppointmentTime() {
        if (!this.appointmentDate || !this.appointmentTimeFrom)
            return false;
        const now = new Date();
        const appointmentDate = new Date(this.appointmentDate);
        if (now.toDateString() !== appointmentDate.toDateString())
            return false;
        const currentTime = now.toTimeString().slice(0, 5);
        const fromTime = this.appointmentTimeFrom;
        const toTime = this.appointmentTimeTo || '23:59';
        return currentTime >= fromTime && currentTime <= toTime;
    }
};
exports.MedicalRecord = MedicalRecord;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], MedicalRecord.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, unique: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], MedicalRecord.prototype, "recordNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], MedicalRecord.prototype, "appointmentDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time', nullable: true }),
    __metadata("design:type", String)
], MedicalRecord.prototype, "appointmentTimeFrom", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time', nullable: true }),
    __metadata("design:type", String)
], MedicalRecord.prototype, "appointmentTimeTo", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: MedicalRecordStatus,
        default: MedicalRecordStatus.PENDING,
    }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], MedicalRecord.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MedicalRecord.prototype, "chiefComplaint", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MedicalRecord.prototype, "currentIllness", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MedicalRecord.prototype, "physicalExamination", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MedicalRecord.prototype, "diagnosis", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MedicalRecord.prototype, "treatment", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MedicalRecord.prototype, "observations", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => medical_history_base_entity_1.MedicalHistoryBase, medicalHistoryBase => medicalHistoryBase.medicalRecord, { nullable: true }),
    __metadata("design:type", medical_history_base_entity_1.MedicalHistoryBase)
], MedicalRecord.prototype, "medicalHistoryBase", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => specialty_medical_history_entity_1.SpecialtyMedicalHistory, specialtyMedicalHistory => specialtyMedicalHistory.medicalRecord, { nullable: true }),
    __metadata("design:type", specialty_medical_history_entity_1.SpecialtyMedicalHistory)
], MedicalRecord.prototype, "specialtyMedicalHistory", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Boolean)
], MedicalRecord.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], MedicalRecord.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], MedicalRecord.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => patient_entity_1.Patient, patient => patient.id, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'patient_id' }),
    __metadata("design:type", patient_entity_1.Patient)
], MedicalRecord.prototype, "patient", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => professional_entity_1.Professional, professional => professional.id, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'professional_id' }),
    __metadata("design:type", professional_entity_1.Professional)
], MedicalRecord.prototype, "professional", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => specialty_entity_1.Specialty, specialty => specialty.id, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'specialty_id' }),
    __metadata("design:type", specialty_entity_1.Specialty)
], MedicalRecord.prototype, "specialty", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => triage_entity_1.Triage, {
        cascade: true,
        eager: true
    }),
    (0, typeorm_1.JoinColumn)({ name: 'triage_id' }),
    __metadata("design:type", triage_entity_1.Triage)
], MedicalRecord.prototype, "triage", void 0);
exports.MedicalRecord = MedicalRecord = __decorate([
    (0, typeorm_1.Entity)('medical_records')
], MedicalRecord);
//# sourceMappingURL=medical-record.entity.js.map
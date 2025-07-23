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
exports.SpecialtyMedicalHistory = exports.ConsciousnessLevel = exports.PainScale = exports.SpecialtyHistoryType = void 0;
const typeorm_1 = require("typeorm");
const medical_record_entity_1 = require("./medical-record.entity");
const specialty_entity_1 = require("../../specialties/entities/specialty.entity");
var SpecialtyHistoryType;
(function (SpecialtyHistoryType) {
    SpecialtyHistoryType["MEDICINA_GENERAL"] = "Medicina General";
    SpecialtyHistoryType["DERMATOLOGIA"] = "Dermatolog\u00EDa";
    SpecialtyHistoryType["PEDIATRIA"] = "Pediatr\u00EDa";
    SpecialtyHistoryType["UROLOGIA"] = "Urolog\u00EDa";
    SpecialtyHistoryType["OBSTETRICIA"] = "Obstetricia";
    SpecialtyHistoryType["TRAUMATOLOGIA"] = "Traumatolog\u00EDa";
    SpecialtyHistoryType["MEDICINA_INTERNA"] = "Medicina Interna";
})(SpecialtyHistoryType || (exports.SpecialtyHistoryType = SpecialtyHistoryType = {}));
var PainScale;
(function (PainScale) {
    PainScale["ZERO"] = "0 - Sin dolor";
    PainScale["ONE"] = "1 - Dolor muy leve";
    PainScale["TWO"] = "2 - Dolor leve";
    PainScale["THREE"] = "3 - Dolor leve a moderado";
    PainScale["FOUR"] = "4 - Dolor moderado";
    PainScale["FIVE"] = "5 - Dolor moderado a intenso";
    PainScale["SIX"] = "6 - Dolor intenso";
    PainScale["SEVEN"] = "7 - Dolor muy intenso";
    PainScale["EIGHT"] = "8 - Dolor severo";
    PainScale["NINE"] = "9 - Dolor muy severo";
    PainScale["TEN"] = "10 - Dolor insoportable";
})(PainScale || (exports.PainScale = PainScale = {}));
var ConsciousnessLevel;
(function (ConsciousnessLevel) {
    ConsciousnessLevel["ALERTA"] = "Alerta";
    ConsciousnessLevel["SOMNOLIENTO"] = "Somnoliento";
    ConsciousnessLevel["ESTUPOROSO"] = "Estuporoso";
    ConsciousnessLevel["COMATOSO"] = "Comatoso";
})(ConsciousnessLevel || (exports.ConsciousnessLevel = ConsciousnessLevel = {}));
let SpecialtyMedicalHistory = class SpecialtyMedicalHistory {
    id;
    specialtyType;
    chiefComplaint;
    currentIllness;
    systemsReview;
    generalPhysicalExam;
    vitalSigns;
    generalMedicine;
    dermatology;
    pediatrics;
    urology;
    obstetrics;
    traumatology;
    internalMedicine;
    diagnoses;
    treatmentPlan;
    complementaryStudies;
    followUp;
    clinicalNotes;
    observations;
    isActive;
    createdAt;
    updatedAt;
    medicalRecord;
    specialty;
};
exports.SpecialtyMedicalHistory = SpecialtyMedicalHistory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SpecialtyMedicalHistory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: SpecialtyHistoryType }),
    __metadata("design:type", String)
], SpecialtyMedicalHistory.prototype, "specialtyType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], SpecialtyMedicalHistory.prototype, "chiefComplaint", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], SpecialtyMedicalHistory.prototype, "currentIllness", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], SpecialtyMedicalHistory.prototype, "systemsReview", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], SpecialtyMedicalHistory.prototype, "generalPhysicalExam", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], SpecialtyMedicalHistory.prototype, "vitalSigns", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], SpecialtyMedicalHistory.prototype, "generalMedicine", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], SpecialtyMedicalHistory.prototype, "dermatology", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], SpecialtyMedicalHistory.prototype, "pediatrics", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], SpecialtyMedicalHistory.prototype, "urology", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], SpecialtyMedicalHistory.prototype, "obstetrics", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], SpecialtyMedicalHistory.prototype, "traumatology", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], SpecialtyMedicalHistory.prototype, "internalMedicine", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json' }),
    __metadata("design:type", Array)
], SpecialtyMedicalHistory.prototype, "diagnoses", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], SpecialtyMedicalHistory.prototype, "treatmentPlan", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], SpecialtyMedicalHistory.prototype, "complementaryStudies", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], SpecialtyMedicalHistory.prototype, "followUp", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], SpecialtyMedicalHistory.prototype, "clinicalNotes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], SpecialtyMedicalHistory.prototype, "observations", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], SpecialtyMedicalHistory.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], SpecialtyMedicalHistory.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], SpecialtyMedicalHistory.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => medical_record_entity_1.MedicalRecord, medicalRecord => medicalRecord.specialtyMedicalHistory),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", medical_record_entity_1.MedicalRecord)
], SpecialtyMedicalHistory.prototype, "medicalRecord", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => specialty_entity_1.Specialty, specialty => specialty.id),
    (0, typeorm_1.JoinColumn)({ name: 'specialty_id' }),
    __metadata("design:type", specialty_entity_1.Specialty)
], SpecialtyMedicalHistory.prototype, "specialty", void 0);
exports.SpecialtyMedicalHistory = SpecialtyMedicalHistory = __decorate([
    (0, typeorm_1.Entity)('specialty_medical_history')
], SpecialtyMedicalHistory);
//# sourceMappingURL=specialty-medical-history.entity.js.map
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
exports.MedicalHistoryBase = exports.SurgeryType = exports.AllergyType = exports.BloodType = void 0;
const typeorm_1 = require("typeorm");
const medical_record_entity_1 = require("./medical-record.entity");
var BloodType;
(function (BloodType) {
    BloodType["A_POSITIVE"] = "A+";
    BloodType["A_NEGATIVE"] = "A-";
    BloodType["B_POSITIVE"] = "B+";
    BloodType["B_NEGATIVE"] = "B-";
    BloodType["AB_POSITIVE"] = "AB+";
    BloodType["AB_NEGATIVE"] = "AB-";
    BloodType["O_POSITIVE"] = "O+";
    BloodType["O_NEGATIVE"] = "O-";
    BloodType["UNKNOWN"] = "Desconocido";
})(BloodType || (exports.BloodType = BloodType = {}));
var AllergyType;
(function (AllergyType) {
    AllergyType["MEDICAMENTOS"] = "Medicamentos";
    AllergyType["ALIMENTOS"] = "Alimentos";
    AllergyType["AMBIENTALES"] = "Ambientales";
    AllergyType["CONTACTO"] = "Contacto";
    AllergyType["OTROS"] = "Otros";
})(AllergyType || (exports.AllergyType = AllergyType = {}));
var SurgeryType;
(function (SurgeryType) {
    SurgeryType["MAYOR"] = "Cirug\u00EDa Mayor";
    SurgeryType["MENOR"] = "Cirug\u00EDa Menor";
    SurgeryType["AMBULATORIA"] = "Cirug\u00EDa Ambulatoria";
    SurgeryType["EMERGENCIA"] = "Cirug\u00EDa de Emergencia";
})(SurgeryType || (exports.SurgeryType = SurgeryType = {}));
let MedicalHistoryBase = class MedicalHistoryBase {
    id;
    bloodType;
    personalHistory;
    chronicDiseases;
    allergies;
    allergyTypes;
    immunizations;
    surgicalHistory;
    surgeries;
    currentMedications;
    medications;
    adverseReactions;
    familyHistory;
    familyDiseases;
    smoker;
    smokingHistory;
    alcoholConsumer;
    alcoholHistory;
    drugUser;
    drugHistory;
    physicalActivity;
    diet;
    pregnancies;
    births;
    abortions;
    cesareans;
    lastMenstrualPeriod;
    menarche;
    contraceptiveMethod;
    occupation;
    occupationalRisks;
    workEnvironment;
    malaria;
    dengue;
    tuberculosis;
    chagas;
    leishmaniasis;
    travelHistory;
    observations;
    isActive;
    createdAt;
    updatedAt;
    medicalRecord;
};
exports.MedicalHistoryBase = MedicalHistoryBase;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], MedicalHistoryBase.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: BloodType, nullable: true }),
    __metadata("design:type", String)
], MedicalHistoryBase.prototype, "bloodType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MedicalHistoryBase.prototype, "personalHistory", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MedicalHistoryBase.prototype, "chronicDiseases", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MedicalHistoryBase.prototype, "allergies", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: AllergyType, array: true, nullable: true }),
    __metadata("design:type", Array)
], MedicalHistoryBase.prototype, "allergyTypes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MedicalHistoryBase.prototype, "immunizations", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MedicalHistoryBase.prototype, "surgicalHistory", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], MedicalHistoryBase.prototype, "surgeries", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MedicalHistoryBase.prototype, "currentMedications", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], MedicalHistoryBase.prototype, "medications", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MedicalHistoryBase.prototype, "adverseReactions", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MedicalHistoryBase.prototype, "familyHistory", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], MedicalHistoryBase.prototype, "familyDiseases", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], MedicalHistoryBase.prototype, "smoker", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MedicalHistoryBase.prototype, "smokingHistory", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], MedicalHistoryBase.prototype, "alcoholConsumer", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MedicalHistoryBase.prototype, "alcoholHistory", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], MedicalHistoryBase.prototype, "drugUser", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MedicalHistoryBase.prototype, "drugHistory", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MedicalHistoryBase.prototype, "physicalActivity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MedicalHistoryBase.prototype, "diet", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], MedicalHistoryBase.prototype, "pregnancies", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], MedicalHistoryBase.prototype, "births", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], MedicalHistoryBase.prototype, "abortions", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], MedicalHistoryBase.prototype, "cesareans", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], MedicalHistoryBase.prototype, "lastMenstrualPeriod", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], MedicalHistoryBase.prototype, "menarche", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MedicalHistoryBase.prototype, "contraceptiveMethod", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MedicalHistoryBase.prototype, "occupation", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MedicalHistoryBase.prototype, "occupationalRisks", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MedicalHistoryBase.prototype, "workEnvironment", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], MedicalHistoryBase.prototype, "malaria", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], MedicalHistoryBase.prototype, "dengue", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], MedicalHistoryBase.prototype, "tuberculosis", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], MedicalHistoryBase.prototype, "chagas", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], MedicalHistoryBase.prototype, "leishmaniasis", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MedicalHistoryBase.prototype, "travelHistory", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MedicalHistoryBase.prototype, "observations", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], MedicalHistoryBase.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], MedicalHistoryBase.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], MedicalHistoryBase.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => medical_record_entity_1.MedicalRecord, medicalRecord => medicalRecord.medicalHistoryBase),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", medical_record_entity_1.MedicalRecord)
], MedicalHistoryBase.prototype, "medicalRecord", void 0);
exports.MedicalHistoryBase = MedicalHistoryBase = __decorate([
    (0, typeorm_1.Entity)('medical_history_base')
], MedicalHistoryBase);
//# sourceMappingURL=medical-history-base.entity.js.map
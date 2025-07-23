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
exports.CreateSpecialtyMedicalHistoryDto = void 0;
const class_validator_1 = require("class-validator");
const specialty_medical_history_entity_1 = require("../entities/specialty-medical-history.entity");
class CreateSpecialtyMedicalHistoryDto {
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
}
exports.CreateSpecialtyMedicalHistoryDto = CreateSpecialtyMedicalHistoryDto;
__decorate([
    (0, class_validator_1.IsEnum)(specialty_medical_history_entity_1.SpecialtyHistoryType),
    __metadata("design:type", String)
], CreateSpecialtyMedicalHistoryDto.prototype, "specialtyType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSpecialtyMedicalHistoryDto.prototype, "chiefComplaint", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSpecialtyMedicalHistoryDto.prototype, "currentIllness", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSpecialtyMedicalHistoryDto.prototype, "systemsReview", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSpecialtyMedicalHistoryDto.prototype, "generalPhysicalExam", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateSpecialtyMedicalHistoryDto.prototype, "vitalSigns", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateSpecialtyMedicalHistoryDto.prototype, "generalMedicine", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateSpecialtyMedicalHistoryDto.prototype, "dermatology", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateSpecialtyMedicalHistoryDto.prototype, "pediatrics", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateSpecialtyMedicalHistoryDto.prototype, "urology", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateSpecialtyMedicalHistoryDto.prototype, "obstetrics", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateSpecialtyMedicalHistoryDto.prototype, "traumatology", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateSpecialtyMedicalHistoryDto.prototype, "internalMedicine", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateSpecialtyMedicalHistoryDto.prototype, "diagnoses", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateSpecialtyMedicalHistoryDto.prototype, "treatmentPlan", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateSpecialtyMedicalHistoryDto.prototype, "complementaryStudies", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateSpecialtyMedicalHistoryDto.prototype, "followUp", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSpecialtyMedicalHistoryDto.prototype, "clinicalNotes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSpecialtyMedicalHistoryDto.prototype, "observations", void 0);
//# sourceMappingURL=create-specialty-medical-history.dto.js.map
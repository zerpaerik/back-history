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
exports.CreateMedicalRecordDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const medical_record_entity_1 = require("../entities/medical-record.entity");
const create_triage_dto_1 = require("./create-triage.dto");
class CreateMedicalRecordDto {
    patientId;
    professionalId;
    specialtyId;
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
    triage;
}
exports.CreateMedicalRecordDto = CreateMedicalRecordDto;
__decorate([
    (0, class_validator_1.IsUUID)('4'),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateMedicalRecordDto.prototype, "patientId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)('4'),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateMedicalRecordDto.prototype, "professionalId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)('4'),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateMedicalRecordDto.prototype, "specialtyId", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMedicalRecordDto.prototype, "appointmentDate", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Matches)(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: 'La hora debe tener formato HH:mm (ej: 14:30)',
    }),
    __metadata("design:type", String)
], CreateMedicalRecordDto.prototype, "appointmentTimeFrom", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Matches)(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: 'La hora debe tener formato HH:mm (ej: 16:30)',
    }),
    __metadata("design:type", String)
], CreateMedicalRecordDto.prototype, "appointmentTimeTo", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(medical_record_entity_1.MedicalRecordStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMedicalRecordDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], CreateMedicalRecordDto.prototype, "chiefComplaint", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(2000),
    __metadata("design:type", String)
], CreateMedicalRecordDto.prototype, "currentIllness", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(2000),
    __metadata("design:type", String)
], CreateMedicalRecordDto.prototype, "physicalExamination", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], CreateMedicalRecordDto.prototype, "diagnosis", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(2000),
    __metadata("design:type", String)
], CreateMedicalRecordDto.prototype, "treatment", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], CreateMedicalRecordDto.prototype, "observations", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => create_triage_dto_1.CreateTriageDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", create_triage_dto_1.CreateTriageDto)
], CreateMedicalRecordDto.prototype, "triage", void 0);
//# sourceMappingURL=create-medical-record.dto.js.map
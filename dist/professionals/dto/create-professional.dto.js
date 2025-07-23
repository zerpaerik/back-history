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
exports.CreateProfessionalDto = void 0;
const class_validator_1 = require("class-validator");
const professional_entity_1 = require("../entities/professional.entity");
class CreateProfessionalDto {
    firstName;
    secondName;
    firstLastname;
    secondLastname;
    identificationType;
    identificationNumber;
    licenseNumber;
    email;
    phone;
    address;
    status;
    licenseExpiryDate;
    observations;
    specialtyIds;
}
exports.CreateProfessionalDto = CreateProfessionalDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateProfessionalDto.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateProfessionalDto.prototype, "secondName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateProfessionalDto.prototype, "firstLastname", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateProfessionalDto.prototype, "secondLastname", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(professional_entity_1.IdentificationType),
    __metadata("design:type", String)
], CreateProfessionalDto.prototype, "identificationType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(8),
    (0, class_validator_1.MaxLength)(20),
    (0, class_validator_1.Matches)(/^[0-9A-Z]+$/, {
        message: 'El número de identificación debe contener solo números y letras mayúsculas',
    }),
    __metadata("design:type", String)
], CreateProfessionalDto.prototype, "identificationNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(4),
    (0, class_validator_1.MaxLength)(20),
    (0, class_validator_1.Matches)(/^[0-9A-Z]+$/, {
        message: 'El número de colegiatura debe contener solo números y letras mayúsculas',
    }),
    __metadata("design:type", String)
], CreateProfessionalDto.prototype, "licenseNumber", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateProfessionalDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(9),
    (0, class_validator_1.MaxLength)(20),
    (0, class_validator_1.Matches)(/^[0-9+\-\s()]+$/, {
        message: 'El teléfono debe contener solo números, espacios, paréntesis, + y -',
    }),
    __metadata("design:type", String)
], CreateProfessionalDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateProfessionalDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(professional_entity_1.ProfessionalStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProfessionalDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProfessionalDto.prototype, "licenseExpiryDate", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], CreateProfessionalDto.prototype, "observations", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)('4', { each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateProfessionalDto.prototype, "specialtyIds", void 0);
//# sourceMappingURL=create-professional.dto.js.map
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
exports.Professional = exports.ProfessionalStatus = exports.IdentificationType = void 0;
const typeorm_1 = require("typeorm");
const specialty_entity_1 = require("../../specialties/entities/specialty.entity");
var IdentificationType;
(function (IdentificationType) {
    IdentificationType["DNI"] = "DNI";
    IdentificationType["CARNET_EXTRANJERIA"] = "Carnet de Extranjer\u00EDa";
    IdentificationType["PASAPORTE"] = "Pasaporte";
    IdentificationType["CEDULA"] = "C\u00E9dula";
})(IdentificationType || (exports.IdentificationType = IdentificationType = {}));
var ProfessionalStatus;
(function (ProfessionalStatus) {
    ProfessionalStatus["ACTIVE"] = "Activo";
    ProfessionalStatus["INACTIVE"] = "Inactivo";
    ProfessionalStatus["SUSPENDED"] = "Suspendido";
    ProfessionalStatus["RETIRED"] = "Retirado";
})(ProfessionalStatus || (exports.ProfessionalStatus = ProfessionalStatus = {}));
let Professional = class Professional {
    id;
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
    isActive;
    createdAt;
    updatedAt;
    specialties;
    getFullName() {
        const names = [this.firstName, this.secondName].filter(Boolean).join(' ');
        const lastnames = [this.firstLastname, this.secondLastname].filter(Boolean).join(' ');
        return `${names} ${lastnames}`.trim();
    }
    getFullIdentification() {
        return `${this.identificationType}: ${this.identificationNumber}`;
    }
    getProfessionalInfo() {
        return `Dr. ${this.getFullName()} - CMP: ${this.licenseNumber}`;
    }
    getSpecialtyNames() {
        return this.specialties?.map(specialty => specialty.name) || [];
    }
    hasSpecialty(specialtyId) {
        return this.specialties?.some(specialty => specialty.id === specialtyId) || false;
    }
};
exports.Professional = Professional;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Professional.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], Professional.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], Professional.prototype, "secondName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], Professional.prototype, "firstLastname", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], Professional.prototype, "secondLastname", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: IdentificationType,
        default: IdentificationType.DNI,
    }),
    __metadata("design:type", String)
], Professional.prototype, "identificationType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, unique: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Professional.prototype, "identificationNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, unique: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Professional.prototype, "licenseNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, unique: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Professional.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], Professional.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Professional.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ProfessionalStatus,
        default: ProfessionalStatus.ACTIVE,
    }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Professional.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Professional.prototype, "licenseExpiryDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Professional.prototype, "observations", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Boolean)
], Professional.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Professional.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Professional.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => specialty_entity_1.Specialty, { eager: true }),
    (0, typeorm_1.JoinTable)({
        name: 'professional_specialties',
        joinColumn: {
            name: 'professional_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'specialty_id',
            referencedColumnName: 'id',
        },
    }),
    __metadata("design:type", Array)
], Professional.prototype, "specialties", void 0);
exports.Professional = Professional = __decorate([
    (0, typeorm_1.Entity)('professionals')
], Professional);
//# sourceMappingURL=professional.entity.js.map
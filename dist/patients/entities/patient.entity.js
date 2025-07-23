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
exports.Patient = exports.Gender = exports.EducationLevel = exports.MaritalStatus = exports.IdentificationType = void 0;
const typeorm_1 = require("typeorm");
var IdentificationType;
(function (IdentificationType) {
    IdentificationType["DNI"] = "DNI";
    IdentificationType["CARNET_EXTRANJERIA"] = "Carnet de Extranjer\u00EDa";
    IdentificationType["PASAPORTE"] = "Pasaporte";
    IdentificationType["CEDULA_IDENTIDAD"] = "C\u00E9dula de Identidad";
})(IdentificationType || (exports.IdentificationType = IdentificationType = {}));
var MaritalStatus;
(function (MaritalStatus) {
    MaritalStatus["SOLTERO"] = "Soltero";
    MaritalStatus["CASADO"] = "Casado";
    MaritalStatus["DIVORCIADO"] = "Divorciado";
    MaritalStatus["VIUDO"] = "Viudo";
    MaritalStatus["CONVIVIENTE"] = "Conviviente";
})(MaritalStatus || (exports.MaritalStatus = MaritalStatus = {}));
var EducationLevel;
(function (EducationLevel) {
    EducationLevel["SIN_INSTRUCCION"] = "Sin Instrucci\u00F3n";
    EducationLevel["PRIMARIA_INCOMPLETA"] = "Primaria Incompleta";
    EducationLevel["PRIMARIA_COMPLETA"] = "Primaria Completa";
    EducationLevel["SECUNDARIA_INCOMPLETA"] = "Secundaria Incompleta";
    EducationLevel["SECUNDARIA_COMPLETA"] = "Secundaria Completa";
    EducationLevel["TECNICA"] = "T\u00E9cnica";
    EducationLevel["UNIVERSITARIA_INCOMPLETA"] = "Universitaria Incompleta";
    EducationLevel["UNIVERSITARIA_COMPLETA"] = "Universitaria Completa";
    EducationLevel["POSTGRADO"] = "Postgrado";
})(EducationLevel || (exports.EducationLevel = EducationLevel = {}));
var Gender;
(function (Gender) {
    Gender["MASCULINO"] = "Masculino";
    Gender["FEMENINO"] = "Femenino";
    Gender["OTRO"] = "Otro";
})(Gender || (exports.Gender = Gender = {}));
let Patient = class Patient {
    id;
    firstName;
    secondName;
    firstLastname;
    secondLastname;
    identificationType;
    identificationNumber;
    birthDate;
    gender;
    maritalStatus;
    educationLevel;
    phone;
    email;
    address;
    emergencyContactName;
    emergencyContactPhone;
    emergencyContactRelationship;
    bloodType;
    allergies;
    observations;
    isActive;
    createdAt;
    updatedAt;
    getAge() {
        const today = new Date();
        const birthDate = new Date(this.birthDate);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }
    getFullName() {
        const names = [this.firstName, this.secondName].filter(Boolean);
        const lastnames = [this.firstLastname, this.secondLastname].filter(Boolean);
        return [...names, ...lastnames].join(' ');
    }
    getFullIdentification() {
        return `${this.identificationType}: ${this.identificationNumber}`;
    }
};
exports.Patient = Patient;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Patient.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'first_name' }),
    __metadata("design:type", String)
], Patient.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'second_name', nullable: true }),
    __metadata("design:type", String)
], Patient.prototype, "secondName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'first_lastname' }),
    __metadata("design:type", String)
], Patient.prototype, "firstLastname", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'second_lastname', nullable: true }),
    __metadata("design:type", String)
], Patient.prototype, "secondLastname", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: IdentificationType,
        name: 'identification_type',
    }),
    __metadata("design:type", String)
], Patient.prototype, "identificationType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'identification_number' }),
    __metadata("design:type", String)
], Patient.prototype, "identificationNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', name: 'birth_date' }),
    __metadata("design:type", Date)
], Patient.prototype, "birthDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: Gender,
    }),
    __metadata("design:type", String)
], Patient.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: MaritalStatus,
        name: 'marital_status',
    }),
    __metadata("design:type", String)
], Patient.prototype, "maritalStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: EducationLevel,
        name: 'education_level',
    }),
    __metadata("design:type", String)
], Patient.prototype, "educationLevel", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Patient.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Patient.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Patient.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'emergency_contact_name', nullable: true }),
    __metadata("design:type", String)
], Patient.prototype, "emergencyContactName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'emergency_contact_phone', nullable: true }),
    __metadata("design:type", String)
], Patient.prototype, "emergencyContactPhone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'emergency_contact_relationship', nullable: true }),
    __metadata("design:type", String)
], Patient.prototype, "emergencyContactRelationship", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'blood_type', nullable: true }),
    __metadata("design:type", String)
], Patient.prototype, "bloodType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Patient.prototype, "allergies", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Patient.prototype, "observations", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], Patient.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Patient.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Patient.prototype, "updatedAt", void 0);
exports.Patient = Patient = __decorate([
    (0, typeorm_1.Entity)('patients'),
    (0, typeorm_1.Index)(['identificationType', 'identificationNumber'], { unique: true })
], Patient);
//# sourceMappingURL=patient.entity.js.map
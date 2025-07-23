"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfessionalResponseDto = void 0;
const specialty_response_dto_1 = require("../../specialties/dto/specialty-response.dto");
class ProfessionalResponseDto {
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
    fullName;
    fullIdentification;
    professionalInfo;
    specialtyNames;
    constructor(professional) {
        this.id = professional.id;
        this.firstName = professional.firstName;
        this.secondName = professional.secondName;
        this.firstLastname = professional.firstLastname;
        this.secondLastname = professional.secondLastname;
        this.identificationType = professional.identificationType;
        this.identificationNumber = professional.identificationNumber;
        this.licenseNumber = professional.licenseNumber;
        this.email = professional.email;
        this.phone = professional.phone;
        this.address = professional.address;
        this.status = professional.status;
        this.licenseExpiryDate = professional.licenseExpiryDate;
        this.observations = professional.observations;
        this.isActive = professional.isActive;
        this.createdAt = professional.createdAt;
        this.updatedAt = professional.updatedAt;
        this.specialties = professional.specialties?.map(specialty => new specialty_response_dto_1.SpecialtyResponseDto(specialty)) || [];
        this.fullName = professional.getFullName();
        this.fullIdentification = professional.getFullIdentification();
        this.professionalInfo = professional.getProfessionalInfo();
        this.specialtyNames = professional.getSpecialtyNames();
    }
}
exports.ProfessionalResponseDto = ProfessionalResponseDto;
//# sourceMappingURL=professional-response.dto.js.map
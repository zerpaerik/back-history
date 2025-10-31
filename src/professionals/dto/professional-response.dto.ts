import { Professional, IdentificationType, ProfessionalStatus } from '../entities/professional.entity';
import { SpecialtyResponseDto } from '../../specialties/dto/specialty-response.dto';

export class ProfessionalResponseDto {
  id: string;
  firstName: string;
  secondName: string;
  firstLastname: string;
  secondLastname: string;
  identificationType: IdentificationType;
  identificationNumber: string;
  licenseNumber: string;
  email: string;
  phone: string;
  address: string;
  status: ProfessionalStatus;
  licenseExpiryDate: Date;
  observations: string;
  signatureUrl: string; // URL de la firma digital
  companyId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  specialties: SpecialtyResponseDto[];
  fullName: string;
  fullIdentification: string;
  professionalInfo: string;
  specialtyNames: string[];

  constructor(professional: Professional) {
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
    this.signatureUrl = professional.signatureUrl; // Incluir URL de firma
    this.companyId = professional.companyId;
    this.isActive = professional.isActive;
    this.createdAt = professional.createdAt;
    this.updatedAt = professional.updatedAt;
    this.specialties = professional.specialties?.map(specialty => new SpecialtyResponseDto(specialty)) || [];
    this.fullName = professional.getFullName();
    this.fullIdentification = professional.getFullIdentification();
    this.professionalInfo = professional.getProfessionalInfo();
    this.specialtyNames = professional.getSpecialtyNames();
  }
}

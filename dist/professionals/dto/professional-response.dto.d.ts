import { Professional, IdentificationType, ProfessionalStatus } from '../entities/professional.entity';
import { SpecialtyResponseDto } from '../../specialties/dto/specialty-response.dto';
export declare class ProfessionalResponseDto {
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
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    specialties: SpecialtyResponseDto[];
    fullName: string;
    fullIdentification: string;
    professionalInfo: string;
    specialtyNames: string[];
    constructor(professional: Professional);
}

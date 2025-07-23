import { IdentificationType, ProfessionalStatus } from '../entities/professional.entity';
export declare class CreateProfessionalDto {
    firstName: string;
    secondName?: string;
    firstLastname: string;
    secondLastname?: string;
    identificationType: IdentificationType;
    identificationNumber: string;
    licenseNumber: string;
    email: string;
    phone: string;
    address?: string;
    status?: ProfessionalStatus;
    licenseExpiryDate?: string;
    observations?: string;
    specialtyIds?: string[];
}

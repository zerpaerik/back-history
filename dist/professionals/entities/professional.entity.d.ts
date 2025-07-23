import { Specialty } from '../../specialties/entities/specialty.entity';
export declare enum IdentificationType {
    DNI = "DNI",
    CARNET_EXTRANJERIA = "Carnet de Extranjer\u00EDa",
    PASAPORTE = "Pasaporte",
    CEDULA = "C\u00E9dula"
}
export declare enum ProfessionalStatus {
    ACTIVE = "Activo",
    INACTIVE = "Inactivo",
    SUSPENDED = "Suspendido",
    RETIRED = "Retirado"
}
export declare class Professional {
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
    specialties: Specialty[];
    getFullName(): string;
    getFullIdentification(): string;
    getProfessionalInfo(): string;
    getSpecialtyNames(): string[];
    hasSpecialty(specialtyId: string): boolean;
}

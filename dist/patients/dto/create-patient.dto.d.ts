import { IdentificationType, MaritalStatus, EducationLevel, Gender } from '../entities/patient.entity';
export declare class CreatePatientDto {
    firstName: string;
    secondName?: string;
    firstLastname: string;
    secondLastname?: string;
    identificationType: IdentificationType;
    identificationNumber: string;
    birthDate: string;
    gender: Gender;
    maritalStatus: MaritalStatus;
    educationLevel: EducationLevel;
    phone?: string;
    email?: string;
    address?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    emergencyContactRelationship?: string;
    bloodType?: string;
    allergies?: string;
    observations?: string;
}

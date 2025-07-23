import { IdentificationType, MaritalStatus, EducationLevel, Gender } from '../entities/patient.entity';
export declare class PatientResponseDto {
    id: string;
    firstName: string;
    secondName?: string;
    firstLastname: string;
    secondLastname?: string;
    identificationType: IdentificationType;
    identificationNumber: string;
    birthDate: Date;
    age: number;
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
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    fullName: string;
    fullIdentification: string;
}

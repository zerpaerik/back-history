export declare enum IdentificationType {
    DNI = "DNI",
    CARNET_EXTRANJERIA = "Carnet de Extranjer\u00EDa",
    PASAPORTE = "Pasaporte",
    CEDULA_IDENTIDAD = "C\u00E9dula de Identidad"
}
export declare enum MaritalStatus {
    SOLTERO = "Soltero",
    CASADO = "Casado",
    DIVORCIADO = "Divorciado",
    VIUDO = "Viudo",
    CONVIVIENTE = "Conviviente"
}
export declare enum EducationLevel {
    SIN_INSTRUCCION = "Sin Instrucci\u00F3n",
    PRIMARIA_INCOMPLETA = "Primaria Incompleta",
    PRIMARIA_COMPLETA = "Primaria Completa",
    SECUNDARIA_INCOMPLETA = "Secundaria Incompleta",
    SECUNDARIA_COMPLETA = "Secundaria Completa",
    TECNICA = "T\u00E9cnica",
    UNIVERSITARIA_INCOMPLETA = "Universitaria Incompleta",
    UNIVERSITARIA_COMPLETA = "Universitaria Completa",
    POSTGRADO = "Postgrado"
}
export declare enum Gender {
    MASCULINO = "Masculino",
    FEMENINO = "Femenino",
    OTRO = "Otro"
}
export declare class Patient {
    id: string;
    firstName: string;
    secondName?: string;
    firstLastname: string;
    secondLastname?: string;
    identificationType: IdentificationType;
    identificationNumber: string;
    birthDate: Date;
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
    getAge(): number;
    getFullName(): string;
    getFullIdentification(): string;
}

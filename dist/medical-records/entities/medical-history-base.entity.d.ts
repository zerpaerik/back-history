import { MedicalRecord } from './medical-record.entity';
export declare enum BloodType {
    A_POSITIVE = "A+",
    A_NEGATIVE = "A-",
    B_POSITIVE = "B+",
    B_NEGATIVE = "B-",
    AB_POSITIVE = "AB+",
    AB_NEGATIVE = "AB-",
    O_POSITIVE = "O+",
    O_NEGATIVE = "O-",
    UNKNOWN = "Desconocido"
}
export declare enum AllergyType {
    MEDICAMENTOS = "Medicamentos",
    ALIMENTOS = "Alimentos",
    AMBIENTALES = "Ambientales",
    CONTACTO = "Contacto",
    OTROS = "Otros"
}
export declare enum SurgeryType {
    MAYOR = "Cirug\u00EDa Mayor",
    MENOR = "Cirug\u00EDa Menor",
    AMBULATORIA = "Cirug\u00EDa Ambulatoria",
    EMERGENCIA = "Cirug\u00EDa de Emergencia"
}
export declare class MedicalHistoryBase {
    id: string;
    bloodType: BloodType;
    personalHistory: string;
    chronicDiseases: string;
    allergies: string;
    allergyTypes: AllergyType[];
    immunizations: string;
    surgicalHistory: string;
    surgeries: Array<{
        date: string;
        procedure: string;
        type: SurgeryType;
        hospital: string;
        complications?: string;
    }>;
    currentMedications: string;
    medications: Array<{
        name: string;
        dose: string;
        frequency: string;
        startDate: string;
        endDate?: string;
        indication: string;
    }>;
    adverseReactions: string;
    familyHistory: string;
    familyDiseases: Array<{
        relationship: string;
        disease: string;
        ageOfOnset?: number;
        alive: boolean;
        causeOfDeath?: string;
    }>;
    smoker: boolean;
    smokingHistory: string;
    alcoholConsumer: boolean;
    alcoholHistory: string;
    drugUser: boolean;
    drugHistory: string;
    physicalActivity: string;
    diet: string;
    pregnancies: number;
    births: number;
    abortions: number;
    cesareans: number;
    lastMenstrualPeriod: Date;
    menarche: number;
    contraceptiveMethod: string;
    occupation: string;
    occupationalRisks: string;
    workEnvironment: string;
    malaria: boolean;
    dengue: boolean;
    tuberculosis: boolean;
    chagas: boolean;
    leishmaniasis: boolean;
    travelHistory: string;
    observations: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    medicalRecord: MedicalRecord;
}

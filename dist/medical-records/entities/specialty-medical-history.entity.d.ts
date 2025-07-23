import { MedicalRecord } from './medical-record.entity';
import { Specialty } from '../../specialties/entities/specialty.entity';
export declare enum SpecialtyHistoryType {
    MEDICINA_GENERAL = "Medicina General",
    DERMATOLOGIA = "Dermatolog\u00EDa",
    PEDIATRIA = "Pediatr\u00EDa",
    UROLOGIA = "Urolog\u00EDa",
    OBSTETRICIA = "Obstetricia",
    TRAUMATOLOGIA = "Traumatolog\u00EDa",
    MEDICINA_INTERNA = "Medicina Interna"
}
export declare enum PainScale {
    ZERO = "0 - Sin dolor",
    ONE = "1 - Dolor muy leve",
    TWO = "2 - Dolor leve",
    THREE = "3 - Dolor leve a moderado",
    FOUR = "4 - Dolor moderado",
    FIVE = "5 - Dolor moderado a intenso",
    SIX = "6 - Dolor intenso",
    SEVEN = "7 - Dolor muy intenso",
    EIGHT = "8 - Dolor severo",
    NINE = "9 - Dolor muy severo",
    TEN = "10 - Dolor insoportable"
}
export declare enum ConsciousnessLevel {
    ALERTA = "Alerta",
    SOMNOLIENTO = "Somnoliento",
    ESTUPOROSO = "Estuporoso",
    COMATOSO = "Comatoso"
}
export declare class SpecialtyMedicalHistory {
    id: string;
    specialtyType: SpecialtyHistoryType;
    chiefComplaint: string;
    currentIllness: string;
    systemsReview: string;
    generalPhysicalExam: string;
    vitalSigns: {
        bloodPressure?: string;
        heartRate?: number;
        respiratoryRate?: number;
        temperature?: number;
        oxygenSaturation?: number;
        weight?: number;
        height?: number;
        bmi?: number;
    };
    generalMedicine: {
        cardiovascular?: string;
        respiratory?: string;
        gastrointestinal?: string;
        genitourinary?: string;
        neurological?: string;
        musculoskeletal?: string;
        nutritionalStatus?: string;
        cardiovascularRisk?: string;
        geriatricAssessment?: string;
    };
    dermatology: {
        skinLesions?: Array<{
            location: string;
            type: string;
            size: string;
            color: string;
            distribution: string;
            evolution: string;
        }>;
        dermoscopy?: string;
        patchTest?: string;
        woodLamp?: string;
        clinicalPhotos?: Array<{
            location: string;
            description: string;
            date: string;
        }>;
    };
    pediatrics: {
        birthData?: {
            gestationalAge: number;
            birthWeight: number;
            birthLength: number;
            apgarScore: string;
            deliveryType: string;
        };
        psychomotorDevelopment?: {
            motorSkills: string;
            languageSkills: string;
            socialSkills: string;
            cognitiveSkills: string;
        };
        growthChart?: Array<{
            date: string;
            weight: number;
            height: number;
            headCircumference?: number;
            percentile: string;
        }>;
        feeding?: {
            breastfeeding: boolean;
            breastfeedingDuration?: string;
            formulaFeeding?: string;
            complementaryFeeding?: string;
            currentDiet: string;
        };
        immunizationStatus?: string;
        pediatricExam?: {
            fontanelles?: string;
            reflexes?: string;
            genitalia?: string;
            spine?: string;
        };
    };
    urology: {
        urinarySymptoms?: {
            dysuria: boolean;
            frequency: boolean;
            urgency: boolean;
            nocturia: boolean;
            hematuria: boolean;
            incontinence: boolean;
            retention: boolean;
        };
        sexualFunction?: {
            erectileDysfunction?: boolean;
            libido?: string;
            ejaculation?: string;
        };
        urologicalExam?: {
            kidneys?: string;
            bladder?: string;
            prostate?: string;
            genitalia?: string;
            testicular?: string;
        };
        urinalysis?: string;
        psa?: number;
        uroflowmetry?: string;
    };
    obstetrics: {
        currentPregnancy?: {
            gestationalAge: number;
            lastMenstrualPeriod: string;
            expectedDeliveryDate: string;
            pregnancyRisk: string;
        };
        prenatalCare?: Array<{
            date: string;
            gestationalAge: number;
            weight: number;
            bloodPressure: string;
            fetalHeartRate?: number;
            fundalHeight?: number;
            fetalMovements: string;
            observations: string;
        }>;
        obstetricalExam?: {
            uterineSize?: string;
            fetalPresentation?: string;
            fetalPosition?: string;
            cervicalExam?: string;
            pelvicExam?: string;
        };
        obstetricalLabs?: {
            hemoglobin?: number;
            bloodType?: string;
            rh?: string;
            glucose?: number;
            urine?: string;
            vdrl?: string;
            hiv?: string;
            hepatitisB?: string;
        };
        birthPlan?: {
            deliveryType: string;
            anesthesia?: string;
            complications?: string;
            riskFactors?: string;
        };
    };
    traumatology: {
        injuryMechanism?: string;
        injuryLocation?: Array<{
            anatomicalRegion: string;
            specificLocation: string;
            side: string;
        }>;
        painAssessment?: {
            scale: PainScale;
            characteristics: string;
            triggers: string;
            relief: string;
        };
        orthopedicExam?: {
            inspection?: string;
            palpation?: string;
            mobility?: string;
            stability?: string;
            neurovascular?: string;
        };
        imaging?: Array<{
            type: string;
            region: string;
            date: string;
            findings: string;
        }>;
        fractureClassification?: string;
    };
    internalMedicine: {
        systemsEvaluation?: {
            cardiovascular?: {
                symptoms: string;
                examination: string;
                riskFactors: string;
            };
            respiratory?: {
                symptoms: string;
                examination: string;
                functionTests?: string;
            };
            gastrointestinal?: {
                symptoms: string;
                examination: string;
                diet: string;
            };
            renal?: {
                symptoms: string;
                examination: string;
                urinalysis?: string;
            };
            endocrine?: {
                symptoms: string;
                examination: string;
                metabolicProfile?: string;
            };
            hematologic?: {
                symptoms: string;
                examination: string;
                bloodCount?: string;
            };
        };
        clinicalSyndromes?: Array<{
            syndrome: string;
            criteria: string;
            severity: string;
        }>;
        comorbidities?: Array<{
            condition: string;
            severity: string;
            treatment: string;
            control: string;
        }>;
    };
    diagnoses: Array<{
        type: 'principal' | 'secundario' | 'diferencial';
        code?: string;
        description: string;
        certainty: 'definitivo' | 'presuntivo' | 'descartado';
    }>;
    treatmentPlan: {
        medications?: Array<{
            medication: string;
            dose: string;
            frequency: string;
            duration: string;
            indication: string;
        }>;
        nonPharmacological?: Array<{
            type: string;
            description: string;
            duration: string;
        }>;
        procedures?: Array<{
            procedure: string;
            indication: string;
            date?: string;
            urgency: string;
        }>;
        referrals?: Array<{
            specialty: string;
            reason: string;
            urgency: string;
        }>;
    };
    complementaryStudies: {
        laboratory?: Array<{
            test: string;
            indication: string;
            urgency: string;
            date?: string;
            result?: string;
        }>;
        imaging?: Array<{
            study: string;
            indication: string;
            urgency: string;
            date?: string;
            result?: string;
        }>;
        otherStudies?: Array<{
            study: string;
            indication: string;
            date?: string;
            result?: string;
        }>;
    };
    followUp: {
        nextAppointment?: {
            date: string;
            reason: string;
            specialty?: string;
        };
        warningSigns?: Array<string>;
        recommendations?: Array<string>;
        prognosis?: {
            shortTerm: string;
            longTerm: string;
        };
    };
    clinicalNotes: string;
    observations: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    medicalRecord: MedicalRecord;
    specialty: Specialty;
}

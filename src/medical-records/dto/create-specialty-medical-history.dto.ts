import { IsString, IsOptional, IsEnum, IsArray } from 'class-validator';
import { SpecialtyHistoryType, PainScale, ConsciousnessLevel } from '../entities/specialty-medical-history.entity';

export class CreateSpecialtyMedicalHistoryDto {
  @IsEnum(SpecialtyHistoryType)
  specialtyType: SpecialtyHistoryType;

  // === CAMPOS COMUNES ===
  @IsString()
  chiefComplaint: string;

  @IsString()
  currentIllness: string;

  @IsOptional()
  @IsString()
  systemsReview?: string;

  @IsOptional()
  @IsString()
  generalPhysicalExam?: string;

  @IsOptional()
  vitalSigns?: {
    bloodPressure?: string;
    heartRate?: number;
    respiratoryRate?: number;
    temperature?: number;
    oxygenSaturation?: number;
    weight?: number;
    height?: number;
    bmi?: number;
  };

  // === MEDICINA GENERAL ===
  @IsOptional()
  generalMedicine?: {
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

  // === DERMATOLOGÍA ===
  @IsOptional()
  dermatology?: {
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

  // === PEDIATRÍA ===
  @IsOptional()
  pediatrics?: {
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

  // === UROLOGÍA ===
  @IsOptional()
  urology?: {
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

  // === OBSTETRICIA ===
  @IsOptional()
  obstetrics?: {
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

  // === TRAUMATOLOGÍA ===
  @IsOptional()
  traumatology?: {
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

  // === MEDICINA INTERNA ===
  @IsOptional()
  internalMedicine?: {
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

  // === DIAGNÓSTICOS ===
  @IsArray()
  diagnoses: Array<{
    type: 'principal' | 'secundario' | 'diferencial';
    code?: string;
    description: string;
    certainty: 'definitivo' | 'presuntivo' | 'descartado';
  }>;

  // === PLAN DE TRATAMIENTO ===
  @IsOptional()
  treatmentPlan?: {
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

  // === ESTUDIOS COMPLEMENTARIOS ===
  @IsOptional()
  complementaryStudies?: {
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

  // === SEGUIMIENTO ===
  @IsOptional()
  followUp?: {
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

  // === OBSERVACIONES ===
  @IsOptional()
  @IsString()
  clinicalNotes?: string;

  @IsOptional()
  @IsString()
  observations?: string;
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { MedicalRecord } from './medical-record.entity';
import { Specialty } from '../../specialties/entities/specialty.entity';

// Enums específicos para historias clínicas peruanas
export enum SpecialtyHistoryType {
  MEDICINA_GENERAL = 'Medicina General',
  DERMATOLOGIA = 'Dermatología',
  PEDIATRIA = 'Pediatría',
  UROLOGIA = 'Urología',
  OBSTETRICIA = 'Obstetricia',
  TRAUMATOLOGIA = 'Traumatología',
  MEDICINA_INTERNA = 'Medicina Interna',
}

export enum PainScale {
  ZERO = '0 - Sin dolor',
  ONE = '1 - Dolor muy leve',
  TWO = '2 - Dolor leve',
  THREE = '3 - Dolor leve a moderado',
  FOUR = '4 - Dolor moderado',
  FIVE = '5 - Dolor moderado a intenso',
  SIX = '6 - Dolor intenso',
  SEVEN = '7 - Dolor muy intenso',
  EIGHT = '8 - Dolor severo',
  NINE = '9 - Dolor muy severo',
  TEN = '10 - Dolor insoportable',
}

export enum ConsciousnessLevel {
  ALERTA = 'Alerta',
  SOMNOLIENTO = 'Somnoliento',
  ESTUPOROSO = 'Estuporoso',
  COMATOSO = 'Comatoso',
}

@Entity('specialty_medical_history')
export class SpecialtyMedicalHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: SpecialtyHistoryType })
  specialtyType: SpecialtyHistoryType;

  // === CAMPOS COMUNES A TODAS LAS ESPECIALIDADES ===
  
  // Motivo de consulta
  @Column({ type: 'text' })
  chiefComplaint: string;

  // Enfermedad actual
  @Column({ type: 'text' })
  currentIllness: string;

  // Revisión por sistemas
  @Column({ type: 'text', nullable: true })
  systemsReview: string;

  // Examen físico general
  @Column({ type: 'text', nullable: true })
  generalPhysicalExam: string;

  // Signos vitales
  @Column({ type: 'json', nullable: true })
  vitalSigns: {
    bloodPressure?: string; // mmHg
    heartRate?: number; // lpm
    respiratoryRate?: number; // rpm
    temperature?: number; // °C
    oxygenSaturation?: number; // %
    weight?: number; // kg
    height?: number; // cm
    bmi?: number;
  };

  // === MEDICINA GENERAL ===
  @Column({ type: 'json', nullable: true })
  generalMedicine: {
    // Examen físico por sistemas
    cardiovascular?: string;
    respiratory?: string;
    gastrointestinal?: string;
    genitourinary?: string;
    neurological?: string;
    musculoskeletal?: string;
    
    // Evaluación nutricional
    nutritionalStatus?: string;
    
    // Factores de riesgo cardiovascular
    cardiovascularRisk?: string;
    
    // Evaluación geriátrica (si aplica)
    geriatricAssessment?: string;
  };

  // === DERMATOLOGÍA ===
  @Column({ type: 'json', nullable: true })
  dermatology: {
    // Descripción de lesiones
    skinLesions?: Array<{
      location: string;
      type: string; // mácula, pápula, vesícula, etc.
      size: string;
      color: string;
      distribution: string;
      evolution: string;
    }>;
    
    // Examen dermatoscópico
    dermoscopy?: string;
    
    // Pruebas específicas
    patchTest?: string;
    woodLamp?: string;
    
    // Fotografías clínicas
    clinicalPhotos?: Array<{
      location: string;
      description: string;
      date: string;
    }>;
  };

  // === PEDIATRÍA ===
  @Column({ type: 'json', nullable: true })
  pediatrics: {
    // Datos del nacimiento
    birthData?: {
      gestationalAge: number;
      birthWeight: number;
      birthLength: number;
      apgarScore: string;
      deliveryType: string;
    };
    
    // Desarrollo psicomotor
    psychomotorDevelopment?: {
      motorSkills: string;
      languageSkills: string;
      socialSkills: string;
      cognitiveSkills: string;
    };
    
    // Crecimiento y desarrollo
    growthChart?: Array<{
      date: string;
      weight: number;
      height: number;
      headCircumference?: number;
      percentile: string;
    }>;
    
    // Alimentación
    feeding?: {
      breastfeeding: boolean;
      breastfeedingDuration?: string;
      formulaFeeding?: string;
      complementaryFeeding?: string;
      currentDiet: string;
    };
    
    // Vacunación
    immunizationStatus?: string;
    
    // Examen pediátrico específico
    pediatricExam?: {
      fontanelles?: string;
      reflexes?: string;
      genitalia?: string;
      spine?: string;
    };
  };

  // === UROLOGÍA ===
  @Column({ type: 'json', nullable: true })
  urology: {
    // Síntomas urinarios
    urinarySymptoms?: {
      dysuria: boolean;
      frequency: boolean;
      urgency: boolean;
      nocturia: boolean;
      hematuria: boolean;
      incontinence: boolean;
      retention: boolean;
    };
    
    // Función sexual
    sexualFunction?: {
      erectileDysfunction?: boolean;
      libido?: string;
      ejaculation?: string;
    };
    
    // Examen urológico
    urologicalExam?: {
      kidneys?: string;
      bladder?: string;
      prostate?: string;
      genitalia?: string;
      testicular?: string;
    };
    
    // Estudios específicos
    urinalysis?: string;
    psa?: number;
    uroflowmetry?: string;
  };

  // === OBSTETRICIA ===
  @Column({ type: 'json', nullable: true })
  obstetrics: {
    // Datos obstétricos actuales
    currentPregnancy?: {
      gestationalAge: number;
      lastMenstrualPeriod: string;
      expectedDeliveryDate: string;
      pregnancyRisk: string;
    };
    
    // Controles prenatales
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
    
    // Examen obstétrico
    obstetricalExam?: {
      uterineSize?: string;
      fetalPresentation?: string;
      fetalPosition?: string;
      cervicalExam?: string;
      pelvicExam?: string;
    };
    
    // Laboratorios obstétricos
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
    
    // Plan de parto
    birthPlan?: {
      deliveryType: string;
      anesthesia?: string;
      complications?: string;
      riskFactors?: string;
    };
  };

  // === TRAUMATOLOGÍA ===
  @Column({ type: 'json', nullable: true })
  traumatology: {
    // Mecanismo de lesión
    injuryMechanism?: string;
    
    // Localización de la lesión
    injuryLocation?: Array<{
      anatomicalRegion: string;
      specificLocation: string;
      side: string; // derecho, izquierdo, bilateral
    }>;
    
    // Evaluación del dolor
    painAssessment?: {
      scale: PainScale;
      characteristics: string;
      triggers: string;
      relief: string;
    };
    
    // Examen ortopédico
    orthopedicExam?: {
      inspection?: string;
      palpation?: string;
      mobility?: string;
      stability?: string;
      neurovascular?: string;
    };
    
    // Estudios de imagen
    imaging?: Array<{
      type: string; // Rx, TAC, RMN
      region: string;
      date: string;
      findings: string;
    }>;
    
    // Clasificación de fracturas
    fractureClassification?: string;
  };

  // === MEDICINA INTERNA ===
  @Column({ type: 'json', nullable: true })
  internalMedicine: {
    // Evaluación por sistemas
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
    
    // Síndromes clínicos
    clinicalSyndromes?: Array<{
      syndrome: string;
      criteria: string;
      severity: string;
    }>;
    
    // Comorbilidades
    comorbidities?: Array<{
      condition: string;
      severity: string;
      treatment: string;
      control: string;
    }>;
  };

  // === DIAGNÓSTICOS ===
  @Column({ type: 'json' })
  diagnoses: Array<{
    type: 'principal' | 'secundario' | 'diferencial';
    code?: string; // CIE-10
    description: string;
    certainty: 'definitivo' | 'presuntivo' | 'descartado';
  }>;

  // === PLAN DE TRATAMIENTO ===
  @Column({ type: 'json', nullable: true })
  treatmentPlan: {
    // Tratamiento farmacológico
    medications?: Array<{
      medication: string;
      dose: string;
      frequency: string;
      duration: string;
      indication: string;
    }>;
    
    // Tratamiento no farmacológico
    nonPharmacological?: Array<{
      type: string;
      description: string;
      duration: string;
    }>;
    
    // Procedimientos
    procedures?: Array<{
      procedure: string;
      indication: string;
      date?: string;
      urgency: string;
    }>;
    
    // Interconsultas
    referrals?: Array<{
      specialty: string;
      reason: string;
      urgency: string;
    }>;
  };

  // === ESTUDIOS COMPLEMENTARIOS ===
  @Column({ type: 'json', nullable: true })
  complementaryStudies: {
    // Laboratorio
    laboratory?: Array<{
      test: string;
      indication: string;
      urgency: string;
      date?: string;
      result?: string;
    }>;
    
    // Imágenes
    imaging?: Array<{
      study: string;
      indication: string;
      urgency: string;
      date?: string;
      result?: string;
    }>;
    
    // Otros estudios
    otherStudies?: Array<{
      study: string;
      indication: string;
      date?: string;
      result?: string;
    }>;
  };

  // === SEGUIMIENTO ===
  @Column({ type: 'json', nullable: true })
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

  // === OBSERVACIONES Y NOTAS ===
  @Column({ type: 'text', nullable: true })
  clinicalNotes: string;

  @Column({ type: 'text', nullable: true })
  observations: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // === RELACIONES ===
  @OneToOne(() => MedicalRecord, medicalRecord => medicalRecord.specialtyMedicalHistory)
  @JoinColumn()
  medicalRecord: MedicalRecord;

  @ManyToOne(() => Specialty, specialty => specialty.id)
  @JoinColumn({ name: 'specialty_id' })
  specialty: Specialty;
}

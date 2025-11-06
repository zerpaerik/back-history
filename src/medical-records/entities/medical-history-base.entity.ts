import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { MedicalRecord } from './medical-record.entity';
import { Company } from '../../companies/entities/company.entity';

// Enums para antecedentes según normas peruanas
export enum BloodType {
  A_POSITIVE = 'A+',
  A_NEGATIVE = 'A-',
  B_POSITIVE = 'B+',
  B_NEGATIVE = 'B-',
  AB_POSITIVE = 'AB+',
  AB_NEGATIVE = 'AB-',
  O_POSITIVE = 'O+',
  O_NEGATIVE = 'O-',
  UNKNOWN = 'Desconocido',
}

export enum AllergyType {
  MEDICAMENTOS = 'Medicamentos',
  ALIMENTOS = 'Alimentos',
  AMBIENTALES = 'Ambientales',
  CONTACTO = 'Contacto',
  OTROS = 'Otros',
}

export enum SurgeryType {
  MAYOR = 'Cirugía Mayor',
  MENOR = 'Cirugía Menor',
  AMBULATORIA = 'Cirugía Ambulatoria',
  EMERGENCIA = 'Cirugía de Emergencia',
}

@Entity('medical_history_base')
export class MedicalHistoryBase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // === ANTECEDENTES PERSONALES ===
  @Column({ type: 'enum', enum: BloodType, nullable: true })
  bloodType: BloodType;

  @Column({ type: 'text', nullable: true })
  personalHistory: string; // Enfermedades previas, hospitalizaciones

  @Column({ type: 'text', nullable: true })
  chronicDiseases: string; // Diabetes, hipertensión, etc.

  @Column({ type: 'text', nullable: true })
  allergies: string; // Alergias conocidas

  @Column({ type: 'enum', enum: AllergyType, array: true, nullable: true })
  allergyTypes: AllergyType[]; // Tipos de alergias

  @Column({ type: 'text', nullable: true })
  immunizations: string; // Vacunas (importante en Perú)

  // === ANTECEDENTES QUIRÚRGICOS ===
  @Column({ type: 'text', nullable: true })
  surgicalHistory: string; // Cirugías previas

  @Column({ type: 'json', nullable: true })
  surgeries: Array<{
    date: string;
    procedure: string;
    type: SurgeryType;
    hospital: string;
    complications?: string;
  }>;

  // === ANTECEDENTES DE MEDICAMENTOS ===
  @Column({ type: 'text', nullable: true })
  currentMedications: string; // Medicamentos actuales

  @Column({ type: 'json', nullable: true })
  medications: Array<{
    name: string;
    dose: string;
    frequency: string;
    startDate: string;
    endDate?: string;
    indication: string;
  }>;

  @Column({ type: 'text', nullable: true })
  adverseReactions: string; // Reacciones adversas a medicamentos

  // === ANTECEDENTES FAMILIARES ===
  @Column({ type: 'text', nullable: true })
  familyHistory: string; // Historia familiar general

  @Column({ type: 'json', nullable: true })
  familyDiseases: Array<{
    relationship: string; // padre, madre, hermano, etc.
    disease: string;
    ageOfOnset?: number;
    alive: boolean;
    causeOfDeath?: string;
  }>;

  // === HÁBITOS Y ESTILO DE VIDA (Importante en Perú) ===
  @Column({ type: 'boolean', default: false })
  smoker: boolean;

  @Column({ type: 'text', nullable: true })
  smokingHistory: string; // Paquetes/año, tiempo

  @Column({ type: 'boolean', default: false })
  alcoholConsumer: boolean;

  @Column({ type: 'text', nullable: true })
  alcoholHistory: string; // Frecuencia, tipo

  @Column({ type: 'boolean', default: false })
  drugUser: boolean;

  @Column({ type: 'text', nullable: true })
  drugHistory: string;

  @Column({ type: 'text', nullable: true })
  physicalActivity: string; // Actividad física

  @Column({ type: 'text', nullable: true })
  diet: string; // Dieta habitual

  // === ANTECEDENTES GINECO-OBSTÉTRICOS (Para mujeres) ===
  @Column({ type: 'integer', nullable: true })
  pregnancies: number; // Gestas (G)

  @Column({ type: 'integer', nullable: true })
  births: number; // Partos (P)

  @Column({ type: 'integer', nullable: true })
  abortions: number; // Abortos

  @Column({ type: 'integer', nullable: true })
  cesareans: number; // Cesáreas

  @Column({ type: 'date', nullable: true })
  lastMenstrualPeriod: Date; // FUR (Fecha de Última Regla)

  @Column({ type: 'integer', nullable: true })
  menarche: number; // Edad de menarquia

  @Column({ type: 'text', nullable: true })
  contraceptiveMethod: string; // Método anticonceptivo

  @Column({ type: 'text', nullable: true })
  pap: string; // PAP (Papanicolaou)

  @Column({ type: 'text', nullable: true })
  mac: string; // MAC (Método Anticonceptivo)

  @Column({ type: 'text', nullable: true })
  andria: string; // Andria

  // === ANTECEDENTES OCUPACIONALES (Importante en Perú - minería, agricultura) ===
  @Column({ type: 'text', nullable: true })
  occupation: string;

  @Column({ type: 'text', nullable: true })
  occupationalRisks: string; // Riesgos laborales

  @Column({ type: 'text', nullable: true })
  workEnvironment: string; // Ambiente laboral

  // === ANTECEDENTES EPIDEMIOLÓGICOS (Enfermedades endémicas de Perú) ===
  @Column({ type: 'boolean', default: false })
  malaria: boolean;

  @Column({ type: 'boolean', default: false })
  dengue: boolean;

  @Column({ type: 'boolean', default: false })
  tuberculosis: boolean;

  @Column({ type: 'boolean', default: false })
  chagas: boolean;

  @Column({ type: 'boolean', default: false })
  leishmaniasis: boolean;

  @Column({ type: 'text', nullable: true })
  travelHistory: string; // Viajes a zonas endémicas

  // === OBSERVACIONES GENERALES ===
  @Column({ type: 'text', nullable: true })
  observations: string;

  // Relación con Empresa
  @Column({ type: 'uuid', name: 'company_id' })
  @Index()
  companyId: string;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // === RELACIÓN CON HISTORIA CLÍNICA ===
  @OneToOne(() => MedicalRecord, medicalRecord => medicalRecord.medicalHistoryBase)
  @JoinColumn()
  medicalRecord: MedicalRecord;
}

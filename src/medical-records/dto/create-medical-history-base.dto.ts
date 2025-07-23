import { IsOptional, IsString, IsBoolean, IsEnum, IsArray, IsNumber, IsDateString } from 'class-validator';
import { BloodType, AllergyType, SurgeryType } from '../entities/medical-history-base.entity';

export class CreateMedicalHistoryBaseDto {
  // === ANTECEDENTES PERSONALES ===
  @IsOptional()
  @IsEnum(BloodType)
  bloodType?: BloodType;

  @IsOptional()
  @IsString()
  personalHistory?: string;

  @IsOptional()
  @IsString()
  chronicDiseases?: string;

  @IsOptional()
  @IsString()
  allergies?: string;

  @IsOptional()
  @IsArray()
  @IsEnum(AllergyType, { each: true })
  allergyTypes?: AllergyType[];

  @IsOptional()
  @IsString()
  immunizations?: string;

  // === ANTECEDENTES QUIRÚRGICOS ===
  @IsOptional()
  @IsString()
  surgicalHistory?: string;

  @IsOptional()
  surgeries?: Array<{
    date: string;
    procedure: string;
    type: SurgeryType;
    hospital: string;
    complications?: string;
  }>;

  // === ANTECEDENTES DE MEDICAMENTOS ===
  @IsOptional()
  @IsString()
  currentMedications?: string;

  @IsOptional()
  medications?: Array<{
    name: string;
    dose: string;
    frequency: string;
    startDate: string;
    endDate?: string;
    indication: string;
  }>;

  @IsOptional()
  @IsString()
  adverseReactions?: string;

  // === ANTECEDENTES FAMILIARES ===
  @IsOptional()
  @IsString()
  familyHistory?: string;

  @IsOptional()
  familyDiseases?: Array<{
    relationship: string;
    disease: string;
    ageOfOnset?: number;
    alive: boolean;
    causeOfDeath?: string;
  }>;

  // === HÁBITOS Y ESTILO DE VIDA ===
  @IsOptional()
  @IsBoolean()
  smoker?: boolean;

  @IsOptional()
  @IsString()
  smokingHistory?: string;

  @IsOptional()
  @IsBoolean()
  alcoholConsumer?: boolean;

  @IsOptional()
  @IsString()
  alcoholHistory?: string;

  @IsOptional()
  @IsBoolean()
  drugUser?: boolean;

  @IsOptional()
  @IsString()
  drugHistory?: string;

  @IsOptional()
  @IsString()
  physicalActivity?: string;

  @IsOptional()
  @IsString()
  diet?: string;

  // === ANTECEDENTES GINECO-OBSTÉTRICOS ===
  @IsOptional()
  @IsNumber()
  pregnancies?: number;

  @IsOptional()
  @IsNumber()
  births?: number;

  @IsOptional()
  @IsNumber()
  abortions?: number;

  @IsOptional()
  @IsNumber()
  cesareans?: number;

  @IsOptional()
  @IsDateString()
  lastMenstrualPeriod?: string;

  @IsOptional()
  @IsNumber()
  menarche?: number;

  @IsOptional()
  @IsString()
  contraceptiveMethod?: string;

  // === ANTECEDENTES OCUPACIONALES ===
  @IsOptional()
  @IsString()
  occupation?: string;

  @IsOptional()
  @IsString()
  occupationalRisks?: string;

  @IsOptional()
  @IsString()
  workEnvironment?: string;

  // === ANTECEDENTES EPIDEMIOLÓGICOS ===
  @IsOptional()
  @IsBoolean()
  malaria?: boolean;

  @IsOptional()
  @IsBoolean()
  dengue?: boolean;

  @IsOptional()
  @IsBoolean()
  tuberculosis?: boolean;

  @IsOptional()
  @IsBoolean()
  chagas?: boolean;

  @IsOptional()
  @IsBoolean()
  leishmaniasis?: boolean;

  @IsOptional()
  @IsString()
  travelHistory?: string;

  // === OBSERVACIONES GENERALES ===
  @IsOptional()
  @IsString()
  observations?: string;
}

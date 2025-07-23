import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum IdentificationType {
  DNI = 'DNI',
  CARNET_EXTRANJERIA = 'Carnet de Extranjería',
  PASAPORTE = 'Pasaporte',
  CEDULA_IDENTIDAD = 'Cédula de Identidad',
}

export enum MaritalStatus {
  SOLTERO = 'Soltero',
  CASADO = 'Casado',
  DIVORCIADO = 'Divorciado',
  VIUDO = 'Viudo',
  CONVIVIENTE = 'Conviviente',
}

export enum EducationLevel {
  SIN_INSTRUCCION = 'Sin Instrucción',
  PRIMARIA_INCOMPLETA = 'Primaria Incompleta',
  PRIMARIA_COMPLETA = 'Primaria Completa',
  SECUNDARIA_INCOMPLETA = 'Secundaria Incompleta',
  SECUNDARIA_COMPLETA = 'Secundaria Completa',
  TECNICA = 'Técnica',
  UNIVERSITARIA_INCOMPLETA = 'Universitaria Incompleta',
  UNIVERSITARIA_COMPLETA = 'Universitaria Completa',
  POSTGRADO = 'Postgrado',
}

export enum Gender {
  MASCULINO = 'Masculino',
  FEMENINO = 'Femenino',
  OTRO = 'Otro',
}

@Entity('patients')
@Index(['identificationType', 'identificationNumber'], { unique: true })
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Nombres y Apellidos
  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'second_name', nullable: true })
  secondName?: string;

  @Column({ name: 'first_lastname' })
  firstLastname: string;

  @Column({ name: 'second_lastname', nullable: true })
  secondLastname?: string;

  // Identificación
  @Column({
    type: 'enum',
    enum: IdentificationType,
    name: 'identification_type',
  })
  identificationType: IdentificationType;

  @Column({ name: 'identification_number' })
  identificationNumber: string;

  // Datos Personales
  @Column({ type: 'date', name: 'birth_date' })
  birthDate: Date;

  @Column({
    type: 'enum',
    enum: Gender,
  })
  gender: Gender;

  @Column({
    type: 'enum',
    enum: MaritalStatus,
    name: 'marital_status',
  })
  maritalStatus: MaritalStatus;

  @Column({
    type: 'enum',
    enum: EducationLevel,
    name: 'education_level',
  })
  educationLevel: EducationLevel;

  // Contacto
  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ type: 'text', nullable: true })
  address?: string;

  // Contacto de Emergencia
  @Column({ name: 'emergency_contact_name', nullable: true })
  emergencyContactName?: string;

  @Column({ name: 'emergency_contact_phone', nullable: true })
  emergencyContactPhone?: string;

  @Column({ name: 'emergency_contact_relationship', nullable: true })
  emergencyContactRelationship?: string;

  // Información Médica Adicional
  @Column({ name: 'blood_type', nullable: true })
  bloodType?: string;

  @Column({ type: 'text', nullable: true })
  allergies?: string;

  @Column({ type: 'text', nullable: true })
  observations?: string;

  // Control de Estado
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Método para calcular la edad
  getAge(): number {
    const today = new Date();
    const birthDate = new Date(this.birthDate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  // Método para obtener el nombre completo
  getFullName(): string {
    const names = [this.firstName, this.secondName].filter(Boolean);
    const lastnames = [this.firstLastname, this.secondLastname].filter(Boolean);
    return [...names, ...lastnames].join(' ');
  }

  // Método para obtener la identificación completa
  getFullIdentification(): string {
    return `${this.identificationType}: ${this.identificationNumber}`;
  }
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Specialty } from '../../specialties/entities/specialty.entity';

export enum IdentificationType {
  DNI = 'DNI',
  CARNET_EXTRANJERIA = 'Carnet de Extranjería',
  PASAPORTE = 'Pasaporte',
  CEDULA = 'Cédula',
}

export enum ProfessionalStatus {
  ACTIVE = 'Activo',
  INACTIVE = 'Inactivo',
  SUSPENDED = 'Suspendido',
  RETIRED = 'Retirado',
}

@Entity('professionals')
export class Professional {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  firstName: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  secondName: string;

  @Column({ type: 'varchar', length: 50 })
  firstLastname: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  secondLastname: string;

  @Column({
    type: 'enum',
    enum: IdentificationType,
    default: IdentificationType.DNI,
  })
  identificationType: IdentificationType;

  @Column({ type: 'varchar', length: 20, unique: true })
  @Index()
  identificationNumber: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  @Index()
  licenseNumber: string; // Número de colegiatura

  @Column({ type: 'varchar', length: 100, unique: true })
  @Index()
  email: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({
    type: 'enum',
    enum: ProfessionalStatus,
    default: ProfessionalStatus.ACTIVE,
  })
  @Index()
  status: ProfessionalStatus;

  @Column({ type: 'date', nullable: true })
  licenseExpiryDate: Date;

  @Column({ type: 'text', nullable: true })
  observations: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  signatureUrl: string; // URL de la firma digital del profesional

  @Column({ type: 'boolean', default: true })
  @Index()
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relación muchos a muchos con especialidades
  @ManyToMany(() => Specialty, { eager: true })
  @JoinTable({
    name: 'professional_specialties',
    joinColumn: {
      name: 'professional_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'specialty_id',
      referencedColumnName: 'id',
    },
  })
  specialties: Specialty[];

  // Método para obtener nombre completo
  getFullName(): string {
    const names = [this.firstName, this.secondName].filter(Boolean).join(' ');
    const lastnames = [this.firstLastname, this.secondLastname].filter(Boolean).join(' ');
    return `${names} ${lastnames}`.trim();
  }

  // Método para obtener identificación completa
  getFullIdentification(): string {
    return `${this.identificationType}: ${this.identificationNumber}`;
  }

  // Método para obtener información profesional completa
  getProfessionalInfo(): string {
    return `Dr. ${this.getFullName()} - CMP: ${this.licenseNumber}`;
  }

  // Método para obtener nombres de especialidades
  getSpecialtyNames(): string[] {
    return this.specialties?.map(specialty => specialty.name) || [];
  }

  // Método para verificar si tiene una especialidad específica
  hasSpecialty(specialtyId: string): boolean {
    return this.specialties?.some(specialty => specialty.id === specialtyId) || false;
  }
}

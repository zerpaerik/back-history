import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Patient } from '../../patients/entities/patient.entity';
import { Professional } from '../../professionals/entities/professional.entity';
import { Specialty } from '../../specialties/entities/specialty.entity';
import { Triage } from './triage.entity';
import { MedicalHistoryBase } from './medical-history-base.entity';
import { SpecialtyMedicalHistory } from './specialty-medical-history.entity';

export enum MedicalRecordStatus {
  PENDING = 'Pendiente',
  IN_PROGRESS = 'En Proceso',
  COMPLETED = 'Completada',
  CANCELLED = 'Cancelada',
}

@Entity('medical_records')
export class MedicalRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  @Index()
  recordNumber: string; // Número de historia clínica generado automáticamente

  @Column({ type: 'date', nullable: true })
  appointmentDate: Date; // Fecha de la cita (opcional)

  @Column({ type: 'time', nullable: true })
  appointmentTimeFrom: string; // Hora desde (formato HH:mm)

  @Column({ type: 'time', nullable: true })
  appointmentTimeTo: string; // Hora hasta (formato HH:mm)

  @Column({
    type: 'enum',
    enum: MedicalRecordStatus,
    default: MedicalRecordStatus.PENDING,
  })
  @Index()
  status: MedicalRecordStatus;

  @Column({ type: 'text', nullable: true })
  chiefComplaint: string; // Motivo de consulta

  @Column({ type: 'text', nullable: true })
  currentIllness: string; // Enfermedad actual

  @Column({ type: 'text', nullable: true })
  physicalExamination: string; // Examen físico

  @Column({ type: 'text', nullable: true })
  diagnosis: string; // Diagnóstico

  @Column({ type: 'text', nullable: true })
  treatment: string; // Tratamiento

  @Column({ type: 'text', nullable: true })
  observations: string; // Observaciones generales

  // Relación con historial base (antecedentes)
  @OneToOne(() => MedicalHistoryBase, medicalHistoryBase => medicalHistoryBase.medicalRecord, { nullable: true })
  medicalHistoryBase: MedicalHistoryBase;

  // Relación con historia clínica específica por especialidad
  @OneToOne(() => SpecialtyMedicalHistory, specialtyMedicalHistory => specialtyMedicalHistory.medicalRecord, { nullable: true })
  specialtyMedicalHistory: SpecialtyMedicalHistory;

  @Column({ type: 'boolean', default: true })
  @Index()
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => Patient, patient => patient.id, { eager: true })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @ManyToOne(() => Professional, professional => professional.id, { eager: true })
  @JoinColumn({ name: 'professional_id' })
  professional: Professional;

  @ManyToOne(() => Specialty, specialty => specialty.id, { eager: true })
  @JoinColumn({ name: 'specialty_id' })
  specialty: Specialty;

  @OneToOne(() => Triage, { 
    cascade: true, 
    eager: true 
  })
  @JoinColumn({ name: 'triage_id' })
  triage: Triage;

  // Método para obtener información completa de la cita
  getAppointmentInfo(): string {
    if (!this.appointmentDate) return 'Sin fecha programada';
    
    // Asegurar que appointmentDate sea un objeto Date válido
    let dateObj: Date;
    if (this.appointmentDate instanceof Date) {
      dateObj = this.appointmentDate;
    } else if (typeof this.appointmentDate === 'string') {
      dateObj = new Date(this.appointmentDate);
    } else {
      return 'Fecha inválida';
    }
    
    // Verificar que la fecha sea válida
    if (isNaN(dateObj.getTime())) {
      return 'Fecha inválida';
    }
    
    const date = dateObj.toLocaleDateString('es-PE');
    if (this.appointmentTimeFrom && this.appointmentTimeTo) {
      return `${date} de ${this.appointmentTimeFrom} a ${this.appointmentTimeTo}`;
    } else if (this.appointmentTimeFrom) {
      return `${date} a las ${this.appointmentTimeFrom}`;
    }
    return date;
  }

  // Método para verificar si tiene triaje
  hasTriageData(): boolean {
    return this.triage?.hasData() || false;
  }

  // Método para obtener resumen de la historia
  getSummary(): string {
    return `HC-${this.recordNumber} | ${this.patient?.getFullName()} | ${this.specialty?.name} | Dr. ${this.professional?.getFullName()}`;
  }

  // Método para verificar si está en horario de cita
  isInAppointmentTime(): boolean {
    if (!this.appointmentDate || !this.appointmentTimeFrom) return false;
    
    const now = new Date();
    const appointmentDate = new Date(this.appointmentDate);
    
    // Verificar si es el mismo día
    if (now.toDateString() !== appointmentDate.toDateString()) return false;
    
    const currentTime = now.toTimeString().slice(0, 5); // HH:mm
    const fromTime = this.appointmentTimeFrom;
    const toTime = this.appointmentTimeTo || '23:59';
    
    return currentTime >= fromTime && currentTime <= toTime;
  }
}

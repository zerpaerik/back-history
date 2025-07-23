import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
@Entity('triages')
export class Triage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  weight: string; // Peso

  @Column({ type: 'varchar', length: 20, nullable: true })
  height: string; // Talla

  @Column({ type: 'varchar', length: 30, nullable: true })
  bloodPressure: string; // TA (Tensión Arterial)

  @Column({ type: 'varchar', length: 20, nullable: true })
  oxygenSaturation: string; // Saturación

  @Column({ type: 'varchar', length: 20, nullable: true })
  heartRate: string; // Frecuencia cardíaca (adicional)

  @Column({ type: 'varchar', length: 20, nullable: true })
  temperature: string; // Temperatura (adicional)

  @Column({ type: 'text', nullable: true })
  observations: string; // Observaciones del triaje

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Método para obtener resumen del triaje
  getTriageSummary(): string {
    const parts: string[] = [];
    if (this.weight) parts.push(`Peso: ${this.weight}`);
    if (this.height) parts.push(`Talla: ${this.height}`);
    if (this.bloodPressure) parts.push(`TA: ${this.bloodPressure}`);
    if (this.oxygenSaturation) parts.push(`Sat: ${this.oxygenSaturation}%`);
    return parts.join(' | ') || 'Sin datos de triaje';
  }

  // Método para verificar si tiene datos
  hasData(): boolean {
    return !!(this.weight || this.height || this.bloodPressure || this.oxygenSaturation || 
             this.heartRate || this.temperature || this.observations);
  }
}

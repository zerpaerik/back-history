import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  @Index()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int', name: 'duration_days' })
  durationDays: number; // Duración en días (30, 90, 365, etc.)

  @Column({ type: 'text', nullable: true })
  features: string; // JSON string con características

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  @Index()
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Método para obtener features como objeto
  getFeatures(): string[] {
    try {
      return this.features ? JSON.parse(this.features) : [];
    } catch {
      return [];
    }
  }

  // Método para formatear precio
  getFormattedPrice(): string {
    return `S/ ${Number(this.price).toFixed(2)}`;
  }

  // Método para obtener descripción de duración
  getDurationDescription(): string {
    if (this.durationDays === 30) return '1 mes';
    if (this.durationDays === 90) return '3 meses';
    if (this.durationDays === 180) return '6 meses';
    if (this.durationDays === 365) return '1 año';
    return `${this.durationDays} días`;
  }
}

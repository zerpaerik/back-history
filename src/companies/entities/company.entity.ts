import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Subscription } from '../../subscriptions/entities/subscription.entity';

export enum CompanyStatus {
  ACTIVE = 'Activo',
  INACTIVE = 'Inactivo',
  SUSPENDED = 'Suspendido',
  TRIAL = 'Prueba',
}

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200 })
  @Index()
  name: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  @Index()
  ruc: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'contact_person' })
  contactPerson: string;

  @Column({ type: 'uuid', nullable: true, name: 'subscription_id' })
  subscriptionId: string;

  @ManyToOne(() => Subscription, { eager: true, nullable: true })
  @JoinColumn({ name: 'subscription_id' })
  subscription: Subscription;

  @Column({ type: 'date', nullable: true, name: 'subscription_start_date' })
  subscriptionStartDate: Date;

  @Column({ type: 'date', nullable: true, name: 'subscription_end_date' })
  subscriptionEndDate: Date;

  @Column({
    type: 'enum',
    enum: CompanyStatus,
    default: CompanyStatus.TRIAL,
  })
  @Index()
  status: CompanyStatus;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  @Index()
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Método para calcular días restantes de suscripción
  getDaysRemaining(): number {
    if (!this.subscriptionEndDate) return 0;
    
    const today = new Date();
    const endDate = new Date(this.subscriptionEndDate);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  }

  // Método para verificar si la suscripción está activa
  isSubscriptionActive(): boolean {
    if (!this.subscriptionEndDate) return false;
    
    const today = new Date();
    const endDate = new Date(this.subscriptionEndDate);
    
    return today <= endDate;
  }

  // Método para obtener fecha de próxima renovación
  getNextRenewalDate(): Date | null {
    return this.subscriptionEndDate ? new Date(this.subscriptionEndDate) : null;
  }

  // Método para obtener estado de suscripción
  getSubscriptionStatus(): string {
    if (!this.subscription) return 'Sin suscripción';
    
    const daysRemaining = this.getDaysRemaining();
    
    if (daysRemaining === 0) return 'Vencida';
    if (daysRemaining <= 7) return 'Por vencer';
    if (daysRemaining <= 30) return 'Próxima a vencer';
    
    return 'Activa';
  }

  // Método para obtener información completa
  getFullInfo(): string {
    return `${this.name} - RUC: ${this.ruc}`;
  }
}

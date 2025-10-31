import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { User } from '../users/entities/user.entity';
import { Patient } from '../patients/entities/patient.entity';
import { Specialty } from '../specialties/entities/specialty.entity';
import { Professional } from '../professionals/entities/professional.entity';
import { MedicalRecord } from '../medical-records/entities/medical-record.entity';
import { Triage } from '../medical-records/entities/triage.entity';
import { MedicalHistoryBase } from '../medical-records/entities/medical-history-base.entity';
import { SpecialtyMedicalHistory } from '../medical-records/entities/specialty-medical-history.entity';
import { Subscription } from '../subscriptions/entities/subscription.entity';
import { Company } from '../companies/entities/company.entity';

// Cargar variables de entorno
config();

const isProd = process.env.NODE_ENV === 'production';
const databaseUrl = process.env.DATABASE_URL;
const sslEnabled = (process.env.DB_SSL ?? (isProd ? 'true' : 'false')) === 'true';

const baseConfig = {
  type: 'postgres' as const,
  entities: [
    User,
    Patient,
    Specialty,
    Professional,
    MedicalRecord,
    Triage,
    MedicalHistoryBase,
    SpecialtyMedicalHistory,
    Subscription,
    Company,
  ],
  migrations: ['dist/migrations/*.js'],
  migrationsTableName: 'migrations',
  logging: process.env.DB_LOGGING === 'true',
  synchronize: false, // IMPORTANTE: Siempre false en producción para usar migraciones
};

let dataSourceOptions: DataSourceOptions;

if (databaseUrl) {
  // Configuración con DATABASE_URL (Railway, Heroku, etc.)
  dataSourceOptions = {
    ...baseConfig,
    url: databaseUrl,
    ssl: sslEnabled ? { rejectUnauthorized: false } : undefined,
  };
} else {
  // Configuración con variables individuales (desarrollo local)
  dataSourceOptions = {
    ...baseConfig,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'medical_history',
    ssl: sslEnabled ? { rejectUnauthorized: false } : undefined,
  };
}

// DataSource para migraciones
export const AppDataSource = new DataSource(dataSourceOptions);

// Exportar configuración para usar en app.module.ts
export default dataSourceOptions;

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AudioController } from './audio/audio.controller';
import { AiModule } from './ai/ai.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PatientsModule } from './patients/patients.module';
import { SpecialtiesModule } from './specialties/specialties.module';
import { ProfessionalsModule } from './professionals/professionals.module';
import { MedicalRecordsModule } from './medical-records/medical-records.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { CompaniesModule } from './companies/companies.module';
import { User } from './users/entities/user.entity';
import { Patient } from './patients/entities/patient.entity';
import { Specialty } from './specialties/entities/specialty.entity';
import { Professional } from './professionals/entities/professional.entity';
import { MedicalRecord } from './medical-records/entities/medical-record.entity';
import { Triage } from './medical-records/entities/triage.entity';
import { MedicalHistoryBase } from './medical-records/entities/medical-history-base.entity';
import { SpecialtyMedicalHistory } from './medical-records/entities/specialty-medical-history.entity';
import { Subscription } from './subscriptions/entities/subscription.entity';
import { Company } from './companies/entities/company.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const isProd = configService.get<string>('NODE_ENV') === 'production';
        const databaseUrl = configService.get<string>('DATABASE_URL');
        const sslEnabled = (configService.get<string>('DB_SSL') ?? (isProd ? 'true' : 'false')) === 'true';
        const common = {
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
          synchronize: (configService.get<string>('DB_SYNCHRONIZE') ?? 'true') === 'true',
          logging: (configService.get<string>('DB_LOGGING') ?? 'true') === 'true',
        };

        if (databaseUrl) {
          return {
            type: 'postgres',
            url: databaseUrl,
            ...common,
            ssl: sslEnabled ? { rejectUnauthorized: false } : undefined,
          };
        }

        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST'),
          port: parseInt(configService.get<string>('DB_PORT') || '5432', 10),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_NAME'),
          ...common,
          ssl: sslEnabled ? { rejectUnauthorized: false } : undefined,
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    AiModule,
    UsersModule,
    PatientsModule,
    SpecialtiesModule,
    ProfessionalsModule,
    MedicalRecordsModule,
    SubscriptionsModule,
    CompaniesModule,
  ],
  controllers: [AppController, AudioController],
  providers: [AppService],
})
export class AppModule {}
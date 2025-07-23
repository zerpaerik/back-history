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
import { User } from './users/entities/user.entity';
import { Patient } from './patients/entities/patient.entity';
import { Specialty } from './specialties/entities/specialty.entity';
import { Professional } from './professionals/entities/professional.entity';
import { MedicalRecord } from './medical-records/entities/medical-record.entity';
import { Triage } from './medical-records/entities/triage.entity';
import { MedicalHistoryBase } from './medical-records/entities/medical-history-base.entity';
import { SpecialtyMedicalHistory } from './medical-records/entities/specialty-medical-history.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [User, Patient, Specialty, Professional, MedicalRecord, Triage, MedicalHistoryBase, SpecialtyMedicalHistory],
        synchronize: true, // Solo en desarrollo
        logging: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    AiModule,
    UsersModule,
    PatientsModule,
    SpecialtiesModule,
    ProfessionalsModule,
    MedicalRecordsModule,
  ],
  controllers: [AppController, AudioController],
  providers: [AppService],
})
export class AppModule {}
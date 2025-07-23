"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const audio_controller_1 = require("./audio/audio.controller");
const ai_module_1 = require("./ai/ai.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const patients_module_1 = require("./patients/patients.module");
const specialties_module_1 = require("./specialties/specialties.module");
const professionals_module_1 = require("./professionals/professionals.module");
const medical_records_module_1 = require("./medical-records/medical-records.module");
const user_entity_1 = require("./users/entities/user.entity");
const patient_entity_1 = require("./patients/entities/patient.entity");
const specialty_entity_1 = require("./specialties/entities/specialty.entity");
const professional_entity_1 = require("./professionals/entities/professional.entity");
const medical_record_entity_1 = require("./medical-records/entities/medical-record.entity");
const triage_entity_1 = require("./medical-records/entities/triage.entity");
const medical_history_base_entity_1 = require("./medical-records/entities/medical-history-base.entity");
const specialty_medical_history_entity_1 = require("./medical-records/entities/specialty-medical-history.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('DB_HOST'),
                    port: configService.get('DB_PORT'),
                    username: configService.get('DB_USERNAME'),
                    password: configService.get('DB_PASSWORD'),
                    database: configService.get('DB_NAME'),
                    entities: [user_entity_1.User, patient_entity_1.Patient, specialty_entity_1.Specialty, professional_entity_1.Professional, medical_record_entity_1.MedicalRecord, triage_entity_1.Triage, medical_history_base_entity_1.MedicalHistoryBase, specialty_medical_history_entity_1.SpecialtyMedicalHistory],
                    synchronize: true,
                    logging: true,
                }),
                inject: [config_1.ConfigService],
            }),
            auth_module_1.AuthModule,
            ai_module_1.AiModule,
            users_module_1.UsersModule,
            patients_module_1.PatientsModule,
            specialties_module_1.SpecialtiesModule,
            professionals_module_1.ProfessionalsModule,
            medical_records_module_1.MedicalRecordsModule,
        ],
        controllers: [app_controller_1.AppController, audio_controller_1.AudioController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
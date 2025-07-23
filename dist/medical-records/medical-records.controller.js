"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var MedicalRecordsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicalRecordsController = void 0;
const common_1 = require("@nestjs/common");
const medical_records_service_1 = require("./medical-records.service");
const create_medical_record_dto_1 = require("./dto/create-medical-record.dto");
const update_medical_record_dto_1 = require("./dto/update-medical-record.dto");
const create_medical_history_base_dto_1 = require("./dto/create-medical-history-base.dto");
const update_medical_history_base_dto_1 = require("./dto/update-medical-history-base.dto");
const create_specialty_medical_history_dto_1 = require("./dto/create-specialty-medical-history.dto");
const update_specialty_medical_history_dto_1 = require("./dto/update-specialty-medical-history.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const user_entity_2 = require("../users/entities/user.entity");
let MedicalRecordsController = MedicalRecordsController_1 = class MedicalRecordsController {
    medicalRecordsService;
    logger = new common_1.Logger(MedicalRecordsController_1.name);
    constructor(medicalRecordsService) {
        this.medicalRecordsService = medicalRecordsService;
    }
    async create(createMedicalRecordDto, user) {
        this.logger.log(`=== SOLICITUD DE CREACIÓN DE HISTORIA CLÍNICA ===`);
        this.logger.log(`Usuario: ${user.email} (${user.role})`);
        this.logger.log(`Datos de historia clínica:`, {
            patientId: createMedicalRecordDto.patientId,
            professionalId: createMedicalRecordDto.professionalId,
            specialtyId: createMedicalRecordDto.specialtyId,
            appointmentDate: createMedicalRecordDto.appointmentDate,
            hasTriageData: !!createMedicalRecordDto.triage,
        });
        const result = await this.medicalRecordsService.create(createMedicalRecordDto);
        this.logger.log(`✅ Historia clínica creada exitosamente por ${user.email}: ${result.recordNumber}`);
        return result;
    }
    async findAll(user, includeInactive) {
        this.logger.log(`=== SOLICITUD DE LISTADO DE HISTORIAS CLÍNICAS ===`);
        this.logger.log(`Usuario: ${user.email} (${user.role})`);
        this.logger.log(`Incluir inactivas: ${includeInactive === 'true'}`);
        const result = await this.medicalRecordsService.findAll(includeInactive === 'true');
        this.logger.log(`✅ Listado de historias clínicas devuelto a ${user.email}: ${result.length} historias`);
        return result;
    }
    async findByPatientDni(dni, user) {
        this.logger.log(`=== SOLICITUD DE BÚSQUEDA POR DNI DE PACIENTE ===`);
        this.logger.log(`Usuario: ${user.email} (${user.role})`);
        this.logger.log(`DNI: ${dni}`);
        const result = await this.medicalRecordsService.findByPatientDni(dni);
        this.logger.log(`✅ Historias clínicas por DNI encontradas para ${user.email}: ${result.length} historias`);
        return result;
    }
    async findByRecordNumber(recordNumber, user) {
        this.logger.log(`=== SOLICITUD DE BÚSQUEDA POR NÚMERO DE HISTORIA ===`);
        this.logger.log(`Usuario: ${user.email} (${user.role})`);
        this.logger.log(`Número de historia: ${recordNumber}`);
        const result = await this.medicalRecordsService.findByRecordNumber(recordNumber);
        this.logger.log(`✅ Historia clínica encontrada por número para ${user.email}: ${result.summary}`);
        return result;
    }
    async findBySpecialty(specialtyId, user) {
        this.logger.log(`=== SOLICITUD DE BÚSQUEDA POR ESPECIALIDAD ===`);
        this.logger.log(`Usuario: ${user.email} (${user.role})`);
        this.logger.log(`Especialidad ID: ${specialtyId}`);
        const result = await this.medicalRecordsService.findBySpecialty(specialtyId);
        this.logger.log(`✅ Historias clínicas por especialidad encontradas para ${user.email}: ${result.length} historias`);
        return result;
    }
    async findByProfessional(professionalId, user) {
        this.logger.log(`=== SOLICITUD DE BÚSQUEDA POR PROFESIONAL ===`);
        this.logger.log(`Usuario: ${user.email} (${user.role})`);
        this.logger.log(`Profesional ID: ${professionalId}`);
        const result = await this.medicalRecordsService.findByProfessional(professionalId);
        this.logger.log(`✅ Historias clínicas por profesional encontradas para ${user.email}: ${result.length} historias`);
        return result;
    }
    async getStats(user) {
        this.logger.log(`=== SOLICITUD DE ESTADÍSTICAS ===`);
        this.logger.log(`Usuario: ${user.email} (${user.role})`);
        const stats = await this.medicalRecordsService.getStats();
        this.logger.log(`✅ Estadísticas obtenidas para ${user.email}`);
        return stats;
    }
    async findOne(id, user) {
        this.logger.log(`=== SOLICITUD DE BÚSQUEDA POR ID ===`);
        this.logger.log(`Usuario: ${user.email} (${user.role})`);
        this.logger.log(`ID: ${id}`);
        const result = await this.medicalRecordsService.findOne(id);
        this.logger.log(`✅ Historia clínica encontrada para ${user.email}: ${result.summary}`);
        return result;
    }
    async update(id, updateMedicalRecordDto, user) {
        this.logger.log(`=== SOLICITUD DE ACTUALIZACIÓN DE HISTORIA CLÍNICA ===`);
        this.logger.log(`Usuario: ${user.email} (${user.role})`);
        this.logger.log(`ID: ${id}`);
        this.logger.log(`Datos a actualizar:`, updateMedicalRecordDto);
        const result = await this.medicalRecordsService.update(id, updateMedicalRecordDto);
        this.logger.log(`✅ Historia clínica actualizada exitosamente por ${user.email}: ${result.recordNumber}`);
        return result;
    }
    async deactivate(id, user) {
        this.logger.log(`=== SOLICITUD DE DESACTIVACIÓN DE HISTORIA CLÍNICA ===`);
        this.logger.log(`Usuario: ${user.email} (${user.role})`);
        this.logger.log(`ID: ${id}`);
        const result = await this.medicalRecordsService.deactivate(id);
        this.logger.log(`✅ Historia clínica desactivada exitosamente por ${user.email}: ${result.recordNumber}`);
        return result;
    }
    async updateTriage(id, triageData, user) {
        this.logger.log(`=== SOLICITUD DE ACTUALIZACIÓN DE TRIAJE ===`);
        this.logger.log(`Usuario: ${user.email} (${user.role})`);
        this.logger.log(`ID Historia Clínica: ${id}`);
        this.logger.log(`Datos de triaje:`, triageData);
        const result = await this.medicalRecordsService.updateTriage(id, triageData);
        this.logger.log(`✅ Triaje actualizado exitosamente por ${user.email}: ${result.recordNumber}`);
        return result;
    }
    async createMedicalHistoryBase(medicalRecordId, createMedicalHistoryBaseDto, user) {
        this.logger.log(`=== SOLICITUD DE CREACIÓN DE ANTECEDENTES ===`);
        this.logger.log(`Usuario: ${user.email} (${user.role})`);
        this.logger.log(`ID Historia Clínica: ${medicalRecordId}`);
        const result = await this.medicalRecordsService.createMedicalHistoryBase(medicalRecordId, createMedicalHistoryBaseDto);
        this.logger.log(`✅ Antecedentes creados exitosamente por ${user.email}`);
        return result;
    }
    async getMedicalHistoryBase(medicalRecordId, user) {
        this.logger.log(`=== SOLICITUD DE OBTENCIÓN DE ANTECEDENTES ===`);
        this.logger.log(`Usuario: ${user.email} (${user.role})`);
        this.logger.log(`ID Historia Clínica: ${medicalRecordId}`);
        return await this.medicalRecordsService.getMedicalHistoryBase(medicalRecordId);
    }
    async updateMedicalHistoryBase(medicalRecordId, updateMedicalHistoryBaseDto, user) {
        this.logger.log(`=== SOLICITUD DE ACTUALIZACIÓN DE ANTECEDENTES ===`);
        this.logger.log(`Usuario: ${user.email} (${user.role})`);
        this.logger.log(`ID Historia Clínica: ${medicalRecordId}`);
        const result = await this.medicalRecordsService.updateMedicalHistoryBase(medicalRecordId, updateMedicalHistoryBaseDto);
        this.logger.log(`✅ Antecedentes actualizados exitosamente por ${user.email}`);
        return result;
    }
    async createSpecialtyMedicalHistory(medicalRecordId, createSpecialtyMedicalHistoryDto, user) {
        this.logger.log(`=== SOLICITUD DE CREACIÓN DE HISTORIA CLÍNICA POR ESPECIALIDAD ===`);
        this.logger.log(`Usuario: ${user.email} (${user.role})`);
        this.logger.log(`ID Historia Clínica: ${medicalRecordId}`);
        this.logger.log(`Tipo de Especialidad: ${createSpecialtyMedicalHistoryDto.specialtyType}`);
        const result = await this.medicalRecordsService.createSpecialtyMedicalHistory(medicalRecordId, createSpecialtyMedicalHistoryDto);
        this.logger.log(`✅ Historia clínica por especialidad creada exitosamente por ${user.email}`);
        return result;
    }
    async getSpecialtyMedicalHistory(medicalRecordId, user) {
        this.logger.log(`=== SOLICITUD DE OBTENCIÓN DE HISTORIA CLÍNICA POR ESPECIALIDAD ===`);
        this.logger.log(`Usuario: ${user.email} (${user.role})`);
        this.logger.log(`ID Historia Clínica: ${medicalRecordId}`);
        return await this.medicalRecordsService.getSpecialtyMedicalHistory(medicalRecordId);
    }
    async updateSpecialtyMedicalHistory(medicalRecordId, updateSpecialtyMedicalHistoryDto, user) {
        this.logger.log(`=== SOLICITUD DE ACTUALIZACIÓN DE HISTORIA CLÍNICA POR ESPECIALIDAD ===`);
        this.logger.log(`Usuario: ${user.email} (${user.role})`);
        this.logger.log(`ID Historia Clínica: ${medicalRecordId}`);
        const result = await this.medicalRecordsService.updateSpecialtyMedicalHistory(medicalRecordId, updateSpecialtyMedicalHistoryDto);
        this.logger.log(`✅ Historia clínica por especialidad actualizada exitosamente por ${user.email}`);
        return result;
    }
    async getCompletionStatus(medicalRecordId, user) {
        this.logger.log(`=== SOLICITUD DE ESTADO DE COMPLETITUD ===`);
        this.logger.log(`Usuario: ${user.email} (${user.role})`);
        this.logger.log(`ID Historia Clínica: ${medicalRecordId}`);
        return await this.medicalRecordsService.getCompletionStatus(medicalRecordId);
    }
    async finalizeRecord(medicalRecordId, user) {
        this.logger.log(`=== SOLICITUD DE FINALIZACIÓN DE HISTORIA CLÍNICA ===`);
        this.logger.log(`Usuario: ${user.email} (${user.role})`);
        this.logger.log(`ID Historia Clínica: ${medicalRecordId}`);
        const result = await this.medicalRecordsService.finalizeRecord(medicalRecordId);
        this.logger.log(`✅ Historia clínica finalizada exitosamente por ${user.email}: ${result.recordNumber}`);
        return result;
    }
};
exports.MedicalRecordsController = MedicalRecordsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.DOCTOR, user_entity_1.UserRole.NURSE, user_entity_1.UserRole.RECEPTIONIST),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_medical_record_dto_1.CreateMedicalRecordDto,
        user_entity_2.User]),
    __metadata("design:returntype", Promise)
], MedicalRecordsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.DOCTOR, user_entity_1.UserRole.NURSE, user_entity_1.UserRole.RECEPTIONIST),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('includeInactive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_2.User, String]),
    __metadata("design:returntype", Promise)
], MedicalRecordsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('by-patient-dni/:dni'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.DOCTOR, user_entity_1.UserRole.NURSE, user_entity_1.UserRole.RECEPTIONIST),
    __param(0, (0, common_1.Param)('dni')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_2.User]),
    __metadata("design:returntype", Promise)
], MedicalRecordsController.prototype, "findByPatientDni", null);
__decorate([
    (0, common_1.Get)('by-record-number/:recordNumber'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.DOCTOR, user_entity_1.UserRole.NURSE, user_entity_1.UserRole.RECEPTIONIST),
    __param(0, (0, common_1.Param)('recordNumber')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_2.User]),
    __metadata("design:returntype", Promise)
], MedicalRecordsController.prototype, "findByRecordNumber", null);
__decorate([
    (0, common_1.Get)('by-specialty/:specialtyId'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.DOCTOR, user_entity_1.UserRole.NURSE),
    __param(0, (0, common_1.Param)('specialtyId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_2.User]),
    __metadata("design:returntype", Promise)
], MedicalRecordsController.prototype, "findBySpecialty", null);
__decorate([
    (0, common_1.Get)('by-professional/:professionalId'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.DOCTOR, user_entity_1.UserRole.NURSE),
    __param(0, (0, common_1.Param)('professionalId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_2.User]),
    __metadata("design:returntype", Promise)
], MedicalRecordsController.prototype, "findByProfessional", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.DOCTOR, user_entity_1.UserRole.NURSE, user_entity_1.UserRole.RECEPTIONIST),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_2.User]),
    __metadata("design:returntype", Promise)
], MedicalRecordsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.DOCTOR, user_entity_1.UserRole.NURSE, user_entity_1.UserRole.RECEPTIONIST),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_2.User]),
    __metadata("design:returntype", Promise)
], MedicalRecordsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.DOCTOR, user_entity_1.UserRole.NURSE),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_medical_record_dto_1.UpdateMedicalRecordDto,
        user_entity_2.User]),
    __metadata("design:returntype", Promise)
], MedicalRecordsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.DOCTOR),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_2.User]),
    __metadata("design:returntype", Promise)
], MedicalRecordsController.prototype, "deactivate", null);
__decorate([
    (0, common_1.Patch)(':id/triage'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.DOCTOR, user_entity_1.UserRole.NURSE),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, user_entity_2.User]),
    __metadata("design:returntype", Promise)
], MedicalRecordsController.prototype, "updateTriage", null);
__decorate([
    (0, common_1.Post)(':id/medical-history-base'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.DOCTOR),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_medical_history_base_dto_1.CreateMedicalHistoryBaseDto,
        user_entity_2.User]),
    __metadata("design:returntype", Promise)
], MedicalRecordsController.prototype, "createMedicalHistoryBase", null);
__decorate([
    (0, common_1.Get)(':id/medical-history-base'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.DOCTOR, user_entity_1.UserRole.NURSE),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_2.User]),
    __metadata("design:returntype", Promise)
], MedicalRecordsController.prototype, "getMedicalHistoryBase", null);
__decorate([
    (0, common_1.Patch)(':id/medical-history-base'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.DOCTOR),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_medical_history_base_dto_1.UpdateMedicalHistoryBaseDto,
        user_entity_2.User]),
    __metadata("design:returntype", Promise)
], MedicalRecordsController.prototype, "updateMedicalHistoryBase", null);
__decorate([
    (0, common_1.Post)(':id/specialty-history'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.DOCTOR),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_specialty_medical_history_dto_1.CreateSpecialtyMedicalHistoryDto,
        user_entity_2.User]),
    __metadata("design:returntype", Promise)
], MedicalRecordsController.prototype, "createSpecialtyMedicalHistory", null);
__decorate([
    (0, common_1.Get)(':id/specialty-history'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.DOCTOR, user_entity_1.UserRole.NURSE),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_2.User]),
    __metadata("design:returntype", Promise)
], MedicalRecordsController.prototype, "getSpecialtyMedicalHistory", null);
__decorate([
    (0, common_1.Patch)(':id/specialty-history'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.DOCTOR),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_specialty_medical_history_dto_1.UpdateSpecialtyMedicalHistoryDto,
        user_entity_2.User]),
    __metadata("design:returntype", Promise)
], MedicalRecordsController.prototype, "updateSpecialtyMedicalHistory", null);
__decorate([
    (0, common_1.Get)(':id/completion-status'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.DOCTOR, user_entity_1.UserRole.NURSE),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_2.User]),
    __metadata("design:returntype", Promise)
], MedicalRecordsController.prototype, "getCompletionStatus", null);
__decorate([
    (0, common_1.Patch)(':id/finalize'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.DOCTOR),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_2.User]),
    __metadata("design:returntype", Promise)
], MedicalRecordsController.prototype, "finalizeRecord", null);
exports.MedicalRecordsController = MedicalRecordsController = MedicalRecordsController_1 = __decorate([
    (0, common_1.Controller)('medical-records'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [medical_records_service_1.MedicalRecordsService])
], MedicalRecordsController);
//# sourceMappingURL=medical-records.controller.js.map
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
var PatientsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientsController = void 0;
const common_1 = require("@nestjs/common");
const patients_service_1 = require("./patients.service");
const create_patient_dto_1 = require("./dto/create-patient.dto");
const update_patient_dto_1 = require("./dto/update-patient.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const user_entity_2 = require("../users/entities/user.entity");
let PatientsController = PatientsController_1 = class PatientsController {
    patientsService;
    logger = new common_1.Logger(PatientsController_1.name);
    constructor(patientsService) {
        this.patientsService = patientsService;
    }
    async create(createPatientDto, user) {
        this.logger.log(`=== SOLICITUD DE CREACIÓN DE PACIENTE ===`);
        this.logger.log(`Usuario: ${user.email} (${user.role})`);
        this.logger.log(`Paciente: ${createPatientDto.firstName} ${createPatientDto.firstLastname}`);
        try {
            const patient = await this.patientsService.create(createPatientDto);
            this.logger.log(`Paciente creado exitosamente: ${patient.id}`);
            return patient;
        }
        catch (error) {
            this.logger.error(`Error al crear paciente: ${error.message}`);
            throw error;
        }
    }
    async findAll(user, includeInactive) {
        this.logger.log(`=== SOLICITUD DE LISTADO DE PACIENTES ===`);
        this.logger.log(`Usuario: ${user.email} (${user.role})`);
        this.logger.log(`Incluir inactivos: ${includeInactive === 'true'}`);
        const patients = await this.patientsService.findAll(includeInactive === 'true');
        this.logger.log(`Devolviendo ${patients.length} pacientes`);
        return patients;
    }
    async searchPatients(searchTerm, user) {
        this.logger.log(`=== SOLICITUD DE BÚSQUEDA DE PACIENTES ===`);
        this.logger.log(`Usuario: ${user.email} (${user.role})`);
        this.logger.log(`Término de búsqueda: ${searchTerm}`);
        if (!searchTerm || searchTerm.trim().length < 2) {
            this.logger.warn('Término de búsqueda muy corto');
            return [];
        }
        const patients = await this.patientsService.searchPatients(searchTerm.trim());
        this.logger.log(`Encontrados ${patients.length} pacientes`);
        return patients;
    }
    async findByIdentification(identificationType, identificationNumber, user) {
        this.logger.log(`=== SOLICITUD DE BÚSQUEDA POR IDENTIFICACIÓN ===`);
        this.logger.log(`Usuario: ${user.email} (${user.role})`);
        this.logger.log(`Identificación: ${identificationType} ${identificationNumber}`);
        const patient = await this.patientsService.findByIdentification(identificationType, identificationNumber);
        this.logger.log(`Paciente encontrado: ${patient.fullName}`);
        return patient;
    }
    async findOne(id, user) {
        this.logger.log(`=== SOLICITUD DE PACIENTE POR ID ===`);
        this.logger.log(`Usuario: ${user.email} (${user.role})`);
        this.logger.log(`ID: ${id}`);
        const patient = await this.patientsService.findById(id);
        this.logger.log(`Paciente encontrado: ${patient.fullName}`);
        return patient;
    }
    async update(id, updatePatientDto, user) {
        this.logger.log(`=== SOLICITUD DE ACTUALIZACIÓN DE PACIENTE ===`);
        this.logger.log(`Usuario: ${user.email} (${user.role})`);
        this.logger.log(`ID del paciente: ${id}`);
        try {
            const patient = await this.patientsService.update(id, updatePatientDto);
            this.logger.log(`Paciente actualizado exitosamente: ${patient.fullName}`);
            return patient;
        }
        catch (error) {
            this.logger.error(`Error al actualizar paciente: ${error.message}`);
            throw error;
        }
    }
    async deactivate(id, user) {
        this.logger.log(`=== SOLICITUD DE DESACTIVACIÓN DE PACIENTE ===`);
        this.logger.log(`Usuario: ${user.email} (${user.role})`);
        this.logger.log(`ID del paciente: ${id}`);
        try {
            await this.patientsService.deactivate(id);
            this.logger.log(`Paciente desactivado exitosamente`);
        }
        catch (error) {
            this.logger.error(`Error al desactivar paciente: ${error.message}`);
            throw error;
        }
    }
    async reactivate(id, user) {
        this.logger.log(`=== SOLICITUD DE REACTIVACIÓN DE PACIENTE ===`);
        this.logger.log(`Usuario: ${user.email} (${user.role})`);
        this.logger.log(`ID del paciente: ${id}`);
        try {
            const patient = await this.patientsService.reactivate(id);
            this.logger.log(`Paciente reactivado exitosamente: ${patient.fullName}`);
            return patient;
        }
        catch (error) {
            this.logger.error(`Error al reactivar paciente: ${error.message}`);
            throw error;
        }
    }
};
exports.PatientsController = PatientsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.DOCTOR, user_entity_1.UserRole.NURSE, user_entity_1.UserRole.RECEPTIONIST),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_patient_dto_1.CreatePatientDto,
        user_entity_2.User]),
    __metadata("design:returntype", Promise)
], PatientsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.DOCTOR, user_entity_1.UserRole.NURSE, user_entity_1.UserRole.RECEPTIONIST),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('includeInactive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_2.User, String]),
    __metadata("design:returntype", Promise)
], PatientsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.DOCTOR, user_entity_1.UserRole.NURSE, user_entity_1.UserRole.RECEPTIONIST),
    __param(0, (0, common_1.Query)('q')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_2.User]),
    __metadata("design:returntype", Promise)
], PatientsController.prototype, "searchPatients", null);
__decorate([
    (0, common_1.Get)('by-identification/:type/:number'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.DOCTOR, user_entity_1.UserRole.NURSE, user_entity_1.UserRole.RECEPTIONIST),
    __param(0, (0, common_1.Param)('type')),
    __param(1, (0, common_1.Param)('number')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, user_entity_2.User]),
    __metadata("design:returntype", Promise)
], PatientsController.prototype, "findByIdentification", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.DOCTOR, user_entity_1.UserRole.NURSE, user_entity_1.UserRole.RECEPTIONIST),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_2.User]),
    __metadata("design:returntype", Promise)
], PatientsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.DOCTOR, user_entity_1.UserRole.NURSE, user_entity_1.UserRole.RECEPTIONIST),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_patient_dto_1.UpdatePatientDto,
        user_entity_2.User]),
    __metadata("design:returntype", Promise)
], PatientsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.DOCTOR),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_2.User]),
    __metadata("design:returntype", Promise)
], PatientsController.prototype, "deactivate", null);
__decorate([
    (0, common_1.Patch)(':id/reactivate'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.DOCTOR),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_2.User]),
    __metadata("design:returntype", Promise)
], PatientsController.prototype, "reactivate", null);
exports.PatientsController = PatientsController = PatientsController_1 = __decorate([
    (0, common_1.Controller)('patients'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [patients_service_1.PatientsService])
], PatientsController);
//# sourceMappingURL=patients.controller.js.map
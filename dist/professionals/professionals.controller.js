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
var ProfessionalsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfessionalsController = void 0;
const common_1 = require("@nestjs/common");
const professionals_service_1 = require("./professionals.service");
const create_professional_dto_1 = require("./dto/create-professional.dto");
const update_professional_dto_1 = require("./dto/update-professional.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const user_entity_2 = require("../users/entities/user.entity");
let ProfessionalsController = ProfessionalsController_1 = class ProfessionalsController {
    professionalsService;
    logger = new common_1.Logger(ProfessionalsController_1.name);
    constructor(professionalsService) {
        this.professionalsService = professionalsService;
    }
    async create(createProfessionalDto, user) {
        this.logger.log(`=== SOLICITUD DE CREACIÓN DE PROFESIONAL ===`);
        this.logger.log(`Usuario: ${user.email} (${user.role})`);
        this.logger.log(`Datos del profesional:`, {
            ...createProfessionalDto,
            email: createProfessionalDto.email,
            licenseNumber: createProfessionalDto.licenseNumber,
        });
        const result = await this.professionalsService.create(createProfessionalDto);
        this.logger.log(`✅ Profesional creado exitosamente por ${user.email}: ${result.fullName}`);
        return result;
    }
    async findAll(user, includeInactive) {
        this.logger.log(`=== SOLICITUD DE LISTADO DE PROFESIONALES ===`);
        this.logger.log(`Usuario: ${user.email} (${user.role})`);
        this.logger.log(`Incluir inactivos: ${includeInactive === 'true'}`);
        const result = await this.professionalsService.findAll(includeInactive === 'true');
        this.logger.log(`✅ Listado de profesionales devuelto a ${user.email}: ${result.length} profesionales`);
        return result;
    }
    async search(term, user) {
        this.logger.log(`=== SOLICITUD DE BÚSQUEDA DE PROFESIONALES ===`);
        this.logger.log(`Usuario: ${user.email} (${user.role})`);
        this.logger.log(`Término de búsqueda: ${term}`);
        const result = await this.professionalsService.search(term);
        this.logger.log(`✅ Búsqueda completada para ${user.email}: ${result.length} profesionales encontrados`);
        return result;
    }
    async findByLicense(licenseNumber, user) {
        this.logger.log(`=== SOLICITUD DE BÚSQUEDA POR COLEGIATURA ===`);
        this.logger.log(`Usuario: ${user.email} (${user.role})`);
        this.logger.log(`Colegiatura: ${licenseNumber}`);
        const result = await this.professionalsService.findByLicense(licenseNumber);
        this.logger.log(`✅ Profesional encontrado por colegiatura para ${user.email}: ${result.fullName}`);
        return result;
    }
    async findByIdentification(type, number, user) {
        this.logger.log(`=== SOLICITUD DE BÚSQUEDA POR IDENTIFICACIÓN ===`);
        this.logger.log(`Usuario: ${user.email} (${user.role})`);
        this.logger.log(`Identificación: ${type} - ${number}`);
        const result = await this.professionalsService.findByIdentification(type, number);
        this.logger.log(`✅ Profesional encontrado por identificación para ${user.email}: ${result.fullName}`);
        return result;
    }
    async findBySpecialty(specialtyId, user) {
        this.logger.log(`=== SOLICITUD DE BÚSQUEDA POR ESPECIALIDAD ===`);
        this.logger.log(`Usuario: ${user.email} (${user.role})`);
        this.logger.log(`Especialidad ID: ${specialtyId}`);
        const result = await this.professionalsService.findBySpecialty(specialtyId);
        this.logger.log(`✅ Profesionales por especialidad encontrados para ${user.email}: ${result.length} profesionales`);
        return result;
    }
    async findOne(id, user) {
        this.logger.log(`=== SOLICITUD DE BÚSQUEDA POR ID ===`);
        this.logger.log(`Usuario: ${user.email} (${user.role})`);
        this.logger.log(`ID: ${id}`);
        const result = await this.professionalsService.findOne(id);
        this.logger.log(`✅ Profesional encontrado para ${user.email}: ${result.fullName}`);
        return result;
    }
    async update(id, updateProfessionalDto, user) {
        this.logger.log(`=== SOLICITUD DE ACTUALIZACIÓN DE PROFESIONAL ===`);
        this.logger.log(`Usuario: ${user.email} (${user.role})`);
        this.logger.log(`ID: ${id}`);
        this.logger.log(`Datos a actualizar:`, updateProfessionalDto);
        const result = await this.professionalsService.update(id, updateProfessionalDto);
        this.logger.log(`✅ Profesional actualizado exitosamente por ${user.email}: ${result.fullName}`);
        return result;
    }
    async deactivate(id, user) {
        this.logger.log(`=== SOLICITUD DE DESACTIVACIÓN DE PROFESIONAL ===`);
        this.logger.log(`Usuario: ${user.email} (${user.role})`);
        this.logger.log(`ID: ${id}`);
        const result = await this.professionalsService.deactivate(id);
        this.logger.log(`✅ Profesional desactivado exitosamente por ${user.email}: ${result.fullName}`);
        return result;
    }
    async reactivate(id, user) {
        this.logger.log(`=== SOLICITUD DE REACTIVACIÓN DE PROFESIONAL ===`);
        this.logger.log(`Usuario: ${user.email} (${user.role})`);
        this.logger.log(`ID: ${id}`);
        const result = await this.professionalsService.reactivate(id);
        this.logger.log(`✅ Profesional reactivado exitosamente por ${user.email}: ${result.fullName}`);
        return result;
    }
};
exports.ProfessionalsController = ProfessionalsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_professional_dto_1.CreateProfessionalDto,
        user_entity_2.User]),
    __metadata("design:returntype", Promise)
], ProfessionalsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.DOCTOR, user_entity_1.UserRole.NURSE, user_entity_1.UserRole.RECEPTIONIST),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('includeInactive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_2.User, String]),
    __metadata("design:returntype", Promise)
], ProfessionalsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.DOCTOR, user_entity_1.UserRole.NURSE, user_entity_1.UserRole.RECEPTIONIST),
    __param(0, (0, common_1.Query)('term')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_2.User]),
    __metadata("design:returntype", Promise)
], ProfessionalsController.prototype, "search", null);
__decorate([
    (0, common_1.Get)('by-license/:licenseNumber'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.DOCTOR, user_entity_1.UserRole.NURSE, user_entity_1.UserRole.RECEPTIONIST),
    __param(0, (0, common_1.Param)('licenseNumber')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_2.User]),
    __metadata("design:returntype", Promise)
], ProfessionalsController.prototype, "findByLicense", null);
__decorate([
    (0, common_1.Get)('by-identification/:type/:number'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.DOCTOR, user_entity_1.UserRole.NURSE, user_entity_1.UserRole.RECEPTIONIST),
    __param(0, (0, common_1.Param)('type')),
    __param(1, (0, common_1.Param)('number')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, user_entity_2.User]),
    __metadata("design:returntype", Promise)
], ProfessionalsController.prototype, "findByIdentification", null);
__decorate([
    (0, common_1.Get)('by-specialty/:specialtyId'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.DOCTOR, user_entity_1.UserRole.NURSE, user_entity_1.UserRole.RECEPTIONIST),
    __param(0, (0, common_1.Param)('specialtyId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_2.User]),
    __metadata("design:returntype", Promise)
], ProfessionalsController.prototype, "findBySpecialty", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.DOCTOR, user_entity_1.UserRole.NURSE, user_entity_1.UserRole.RECEPTIONIST),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_2.User]),
    __metadata("design:returntype", Promise)
], ProfessionalsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_professional_dto_1.UpdateProfessionalDto,
        user_entity_2.User]),
    __metadata("design:returntype", Promise)
], ProfessionalsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_2.User]),
    __metadata("design:returntype", Promise)
], ProfessionalsController.prototype, "deactivate", null);
__decorate([
    (0, common_1.Patch)(':id/reactivate'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_2.User]),
    __metadata("design:returntype", Promise)
], ProfessionalsController.prototype, "reactivate", null);
exports.ProfessionalsController = ProfessionalsController = ProfessionalsController_1 = __decorate([
    (0, common_1.Controller)('professionals'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [professionals_service_1.ProfessionalsService])
], ProfessionalsController);
//# sourceMappingURL=professionals.controller.js.map
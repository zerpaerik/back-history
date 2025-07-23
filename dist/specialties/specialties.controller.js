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
var SpecialtiesController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecialtiesController = void 0;
const common_1 = require("@nestjs/common");
const specialties_service_1 = require("./specialties.service");
const create_specialty_dto_1 = require("./dto/create-specialty.dto");
const update_specialty_dto_1 = require("./dto/update-specialty.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const user_entity_2 = require("../users/entities/user.entity");
let SpecialtiesController = SpecialtiesController_1 = class SpecialtiesController {
    specialtiesService;
    logger = new common_1.Logger(SpecialtiesController_1.name);
    constructor(specialtiesService) {
        this.specialtiesService = specialtiesService;
    }
    async create(createSpecialtyDto, user) {
        this.logger.log(`=== SOLICITUD DE CREACIÓN DE ESPECIALIDAD ===`);
        this.logger.log(`Usuario: ${user.email} (${user.role})`);
        this.logger.log(`Datos de especialidad:`, createSpecialtyDto);
        const result = await this.specialtiesService.create(createSpecialtyDto);
        this.logger.log(`✅ Especialidad creada exitosamente por ${user.email}`);
        return result;
    }
    async findAll(user, includeInactive) {
        this.logger.log(`=== SOLICITUD DE LISTADO DE ESPECIALIDADES ===`);
        this.logger.log(`Usuario: ${user.email} (${user.role})`);
        this.logger.log(`Incluir inactivas: ${includeInactive === 'true'}`);
        const result = await this.specialtiesService.findAll(includeInactive === 'true');
        this.logger.log(`✅ Listado de especialidades devuelto a ${user.email}: ${result.length} especialidades`);
        return result;
    }
    async search(term, user) {
        this.logger.log(`=== SOLICITUD DE BÚSQUEDA DE ESPECIALIDADES ===`);
        this.logger.log(`Usuario: ${user.email} (${user.role})`);
        this.logger.log(`Término de búsqueda: ${term}`);
        const result = await this.specialtiesService.search(term);
        this.logger.log(`✅ Búsqueda completada para ${user.email}: ${result.length} especialidades encontradas`);
        return result;
    }
    async findByCode(code, user) {
        this.logger.log(`=== SOLICITUD DE BÚSQUEDA POR CÓDIGO ===`);
        this.logger.log(`Usuario: ${user.email} (${user.role})`);
        this.logger.log(`Código: ${code}`);
        const result = await this.specialtiesService.findByCode(code);
        this.logger.log(`✅ Especialidad encontrada por código para ${user.email}: ${result.name}`);
        return result;
    }
    async findOne(id, user) {
        this.logger.log(`=== SOLICITUD DE BÚSQUEDA POR ID ===`);
        this.logger.log(`Usuario: ${user.email} (${user.role})`);
        this.logger.log(`ID: ${id}`);
        const result = await this.specialtiesService.findOne(id);
        this.logger.log(`✅ Especialidad encontrada para ${user.email}: ${result.name}`);
        return result;
    }
    async update(id, updateSpecialtyDto, user) {
        this.logger.log(`=== SOLICITUD DE ACTUALIZACIÓN DE ESPECIALIDAD ===`);
        this.logger.log(`Usuario: ${user.email} (${user.role})`);
        this.logger.log(`ID: ${id}`);
        this.logger.log(`Datos a actualizar:`, updateSpecialtyDto);
        const result = await this.specialtiesService.update(id, updateSpecialtyDto);
        this.logger.log(`✅ Especialidad actualizada exitosamente por ${user.email}`);
        return result;
    }
    async deactivate(id, user) {
        this.logger.log(`=== SOLICITUD DE DESACTIVACIÓN DE ESPECIALIDAD ===`);
        this.logger.log(`Usuario: ${user.email} (${user.role})`);
        this.logger.log(`ID: ${id}`);
        const result = await this.specialtiesService.deactivate(id);
        this.logger.log(`✅ Especialidad desactivada exitosamente por ${user.email}`);
        return result;
    }
    async reactivate(id, user) {
        this.logger.log(`=== SOLICITUD DE REACTIVACIÓN DE ESPECIALIDAD ===`);
        this.logger.log(`Usuario: ${user.email} (${user.role})`);
        this.logger.log(`ID: ${id}`);
        const result = await this.specialtiesService.reactivate(id);
        this.logger.log(`✅ Especialidad reactivada exitosamente por ${user.email}`);
        return result;
    }
};
exports.SpecialtiesController = SpecialtiesController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_specialty_dto_1.CreateSpecialtyDto,
        user_entity_2.User]),
    __metadata("design:returntype", Promise)
], SpecialtiesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.DOCTOR, user_entity_1.UserRole.NURSE, user_entity_1.UserRole.RECEPTIONIST),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('includeInactive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_2.User, String]),
    __metadata("design:returntype", Promise)
], SpecialtiesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.DOCTOR, user_entity_1.UserRole.NURSE, user_entity_1.UserRole.RECEPTIONIST),
    __param(0, (0, common_1.Query)('term')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_2.User]),
    __metadata("design:returntype", Promise)
], SpecialtiesController.prototype, "search", null);
__decorate([
    (0, common_1.Get)('by-code/:code'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.DOCTOR, user_entity_1.UserRole.NURSE, user_entity_1.UserRole.RECEPTIONIST),
    __param(0, (0, common_1.Param)('code')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_2.User]),
    __metadata("design:returntype", Promise)
], SpecialtiesController.prototype, "findByCode", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.DOCTOR, user_entity_1.UserRole.NURSE, user_entity_1.UserRole.RECEPTIONIST),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_2.User]),
    __metadata("design:returntype", Promise)
], SpecialtiesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_specialty_dto_1.UpdateSpecialtyDto,
        user_entity_2.User]),
    __metadata("design:returntype", Promise)
], SpecialtiesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_2.User]),
    __metadata("design:returntype", Promise)
], SpecialtiesController.prototype, "deactivate", null);
__decorate([
    (0, common_1.Patch)(':id/reactivate'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_2.User]),
    __metadata("design:returntype", Promise)
], SpecialtiesController.prototype, "reactivate", null);
exports.SpecialtiesController = SpecialtiesController = SpecialtiesController_1 = __decorate([
    (0, common_1.Controller)('specialties'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [specialties_service_1.SpecialtiesService])
], SpecialtiesController);
//# sourceMappingURL=specialties.controller.js.map
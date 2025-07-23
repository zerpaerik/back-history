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
var SpecialtiesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecialtiesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const specialty_entity_1 = require("./entities/specialty.entity");
const specialty_response_dto_1 = require("./dto/specialty-response.dto");
let SpecialtiesService = SpecialtiesService_1 = class SpecialtiesService {
    specialtyRepository;
    logger = new common_1.Logger(SpecialtiesService_1.name);
    constructor(specialtyRepository) {
        this.specialtyRepository = specialtyRepository;
    }
    async create(createSpecialtyDto) {
        this.logger.log(`=== CREANDO NUEVA ESPECIALIDAD ===`);
        this.logger.log(`Nombre: ${createSpecialtyDto.name}`);
        this.logger.log(`Código: ${createSpecialtyDto.code}`);
        try {
            const existingByName = await this.specialtyRepository.findOne({
                where: { name: createSpecialtyDto.name },
            });
            if (existingByName) {
                this.logger.warn(`Especialidad con nombre '${createSpecialtyDto.name}' ya existe`);
                throw new common_1.ConflictException('Ya existe una especialidad con este nombre');
            }
            const existingByCode = await this.specialtyRepository.findOne({
                where: { code: createSpecialtyDto.code },
            });
            if (existingByCode) {
                this.logger.warn(`Especialidad con código '${createSpecialtyDto.code}' ya existe`);
                throw new common_1.ConflictException('Ya existe una especialidad con este código');
            }
            const specialty = this.specialtyRepository.create(createSpecialtyDto);
            const savedSpecialty = await this.specialtyRepository.save(specialty);
            this.logger.log(`✅ Especialidad creada exitosamente con ID: ${savedSpecialty.id}`);
            return new specialty_response_dto_1.SpecialtyResponseDto(savedSpecialty);
        }
        catch (error) {
            this.logger.error(`❌ Error al crear especialidad: ${error.message}`);
            throw error;
        }
    }
    async findAll(includeInactive = false) {
        this.logger.log(`=== LISTANDO ESPECIALIDADES ===`);
        this.logger.log(`Incluir inactivas: ${includeInactive}`);
        try {
            const whereCondition = includeInactive ? {} : { isActive: true };
            const specialties = await this.specialtyRepository.find({
                where: whereCondition,
                order: { name: 'ASC' },
            });
            this.logger.log(`✅ Encontradas ${specialties.length} especialidades`);
            return specialties.map(specialty => new specialty_response_dto_1.SpecialtyResponseDto(specialty));
        }
        catch (error) {
            this.logger.error(`❌ Error al listar especialidades: ${error.message}`);
            throw error;
        }
    }
    async findOne(id) {
        this.logger.log(`=== BUSCANDO ESPECIALIDAD POR ID ===`);
        this.logger.log(`ID: ${id}`);
        try {
            const specialty = await this.specialtyRepository.findOne({
                where: { id },
            });
            if (!specialty) {
                this.logger.warn(`Especialidad con ID '${id}' no encontrada`);
                throw new common_1.NotFoundException('Especialidad no encontrada');
            }
            this.logger.log(`✅ Especialidad encontrada: ${specialty.name}`);
            return new specialty_response_dto_1.SpecialtyResponseDto(specialty);
        }
        catch (error) {
            this.logger.error(`❌ Error al buscar especialidad: ${error.message}`);
            throw error;
        }
    }
    async findByCode(code) {
        this.logger.log(`=== BUSCANDO ESPECIALIDAD POR CÓDIGO ===`);
        this.logger.log(`Código: ${code}`);
        try {
            const specialty = await this.specialtyRepository.findOne({
                where: { code, isActive: true },
            });
            if (!specialty) {
                this.logger.warn(`Especialidad con código '${code}' no encontrada`);
                throw new common_1.NotFoundException('Especialidad no encontrada');
            }
            this.logger.log(`✅ Especialidad encontrada: ${specialty.name}`);
            return new specialty_response_dto_1.SpecialtyResponseDto(specialty);
        }
        catch (error) {
            this.logger.error(`❌ Error al buscar especialidad por código: ${error.message}`);
            throw error;
        }
    }
    async search(term) {
        this.logger.log(`=== BUSCANDO ESPECIALIDADES ===`);
        this.logger.log(`Término de búsqueda: ${term}`);
        if (!term || term.trim().length < 2) {
            throw new common_1.BadRequestException('El término de búsqueda debe tener al menos 2 caracteres');
        }
        try {
            const searchTerm = `%${term.trim()}%`;
            const specialties = await this.specialtyRepository.find({
                where: [
                    { name: (0, typeorm_2.Like)(searchTerm), isActive: true },
                    { code: (0, typeorm_2.Like)(searchTerm), isActive: true },
                    { description: (0, typeorm_2.Like)(searchTerm), isActive: true },
                    { department: (0, typeorm_2.Like)(searchTerm), isActive: true },
                ],
                order: { name: 'ASC' },
            });
            this.logger.log(`✅ Encontradas ${specialties.length} especialidades que coinciden con '${term}'`);
            return specialties.map(specialty => new specialty_response_dto_1.SpecialtyResponseDto(specialty));
        }
        catch (error) {
            this.logger.error(`❌ Error al buscar especialidades: ${error.message}`);
            throw error;
        }
    }
    async update(id, updateSpecialtyDto) {
        this.logger.log(`=== ACTUALIZANDO ESPECIALIDAD ===`);
        this.logger.log(`ID: ${id}`);
        this.logger.log(`Datos a actualizar:`, updateSpecialtyDto);
        try {
            const specialty = await this.specialtyRepository.findOne({
                where: { id },
            });
            if (!specialty) {
                this.logger.warn(`Especialidad con ID '${id}' no encontrada`);
                throw new common_1.NotFoundException('Especialidad no encontrada');
            }
            if (updateSpecialtyDto.name && updateSpecialtyDto.name !== specialty.name) {
                const existingByName = await this.specialtyRepository.findOne({
                    where: { name: updateSpecialtyDto.name },
                });
                if (existingByName && existingByName.id !== id) {
                    this.logger.warn(`Especialidad con nombre '${updateSpecialtyDto.name}' ya existe`);
                    throw new common_1.ConflictException('Ya existe una especialidad con este nombre');
                }
            }
            if (updateSpecialtyDto.code && updateSpecialtyDto.code !== specialty.code) {
                const existingByCode = await this.specialtyRepository.findOne({
                    where: { code: updateSpecialtyDto.code },
                });
                if (existingByCode && existingByCode.id !== id) {
                    this.logger.warn(`Especialidad con código '${updateSpecialtyDto.code}' ya existe`);
                    throw new common_1.ConflictException('Ya existe una especialidad con este código');
                }
            }
            await this.specialtyRepository.update(id, updateSpecialtyDto);
            const updatedSpecialty = await this.specialtyRepository.findOne({
                where: { id },
            });
            this.logger.log(`✅ Especialidad actualizada exitosamente`);
            return new specialty_response_dto_1.SpecialtyResponseDto(updatedSpecialty);
        }
        catch (error) {
            this.logger.error(`❌ Error al actualizar especialidad: ${error.message}`);
            throw error;
        }
    }
    async deactivate(id) {
        this.logger.log(`=== DESACTIVANDO ESPECIALIDAD ===`);
        this.logger.log(`ID: ${id}`);
        try {
            const specialty = await this.specialtyRepository.findOne({
                where: { id },
            });
            if (!specialty) {
                this.logger.warn(`Especialidad con ID '${id}' no encontrada`);
                throw new common_1.NotFoundException('Especialidad no encontrada');
            }
            if (!specialty.isActive) {
                this.logger.warn(`Especialidad '${specialty.name}' ya está desactivada`);
                throw new common_1.BadRequestException('La especialidad ya está desactivada');
            }
            await this.specialtyRepository.update(id, { isActive: false });
            const deactivatedSpecialty = await this.specialtyRepository.findOne({
                where: { id },
            });
            this.logger.log(`✅ Especialidad '${specialty.name}' desactivada exitosamente`);
            return new specialty_response_dto_1.SpecialtyResponseDto(deactivatedSpecialty);
        }
        catch (error) {
            this.logger.error(`❌ Error al desactivar especialidad: ${error.message}`);
            throw error;
        }
    }
    async reactivate(id) {
        this.logger.log(`=== REACTIVANDO ESPECIALIDAD ===`);
        this.logger.log(`ID: ${id}`);
        try {
            const specialty = await this.specialtyRepository.findOne({
                where: { id },
            });
            if (!specialty) {
                this.logger.warn(`Especialidad con ID '${id}' no encontrada`);
                throw new common_1.NotFoundException('Especialidad no encontrada');
            }
            if (specialty.isActive) {
                this.logger.warn(`Especialidad '${specialty.name}' ya está activa`);
                throw new common_1.BadRequestException('La especialidad ya está activa');
            }
            await this.specialtyRepository.update(id, { isActive: true });
            const reactivatedSpecialty = await this.specialtyRepository.findOne({
                where: { id },
            });
            this.logger.log(`✅ Especialidad '${specialty.name}' reactivada exitosamente`);
            return new specialty_response_dto_1.SpecialtyResponseDto(reactivatedSpecialty);
        }
        catch (error) {
            this.logger.error(`❌ Error al reactivar especialidad: ${error.message}`);
            throw error;
        }
    }
};
exports.SpecialtiesService = SpecialtiesService;
exports.SpecialtiesService = SpecialtiesService = SpecialtiesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(specialty_entity_1.Specialty)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SpecialtiesService);
//# sourceMappingURL=specialties.service.js.map
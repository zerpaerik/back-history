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
var ProfessionalsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfessionalsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const professional_entity_1 = require("./entities/professional.entity");
const specialty_entity_1 = require("../specialties/entities/specialty.entity");
const professional_response_dto_1 = require("./dto/professional-response.dto");
let ProfessionalsService = ProfessionalsService_1 = class ProfessionalsService {
    professionalRepository;
    specialtyRepository;
    logger = new common_1.Logger(ProfessionalsService_1.name);
    constructor(professionalRepository, specialtyRepository) {
        this.professionalRepository = professionalRepository;
        this.specialtyRepository = specialtyRepository;
    }
    async create(createProfessionalDto) {
        this.logger.log(`=== CREANDO NUEVO PROFESIONAL ===`);
        this.logger.log(`Nombre: ${createProfessionalDto.firstName} ${createProfessionalDto.firstLastname}`);
        this.logger.log(`Email: ${createProfessionalDto.email}`);
        this.logger.log(`Colegiatura: ${createProfessionalDto.licenseNumber}`);
        try {
            const existingByIdentification = await this.professionalRepository.findOne({
                where: {
                    identificationType: createProfessionalDto.identificationType,
                    identificationNumber: createProfessionalDto.identificationNumber,
                },
            });
            if (existingByIdentification) {
                this.logger.warn(`Profesional con identificación '${createProfessionalDto.identificationType}: ${createProfessionalDto.identificationNumber}' ya existe`);
                throw new common_1.ConflictException('Ya existe un profesional con esta identificación');
            }
            const existingByLicense = await this.professionalRepository.findOne({
                where: { licenseNumber: createProfessionalDto.licenseNumber },
            });
            if (existingByLicense) {
                this.logger.warn(`Profesional con colegiatura '${createProfessionalDto.licenseNumber}' ya existe`);
                throw new common_1.ConflictException('Ya existe un profesional con este número de colegiatura');
            }
            const existingByEmail = await this.professionalRepository.findOne({
                where: { email: createProfessionalDto.email },
            });
            if (existingByEmail) {
                this.logger.warn(`Profesional con email '${createProfessionalDto.email}' ya existe`);
                throw new common_1.ConflictException('Ya existe un profesional con este email');
            }
            const { specialtyIds, licenseExpiryDate, ...professionalData } = createProfessionalDto;
            const professional = this.professionalRepository.create({
                ...professionalData,
                licenseExpiryDate: licenseExpiryDate ? new Date(licenseExpiryDate) : undefined,
            });
            if (specialtyIds && specialtyIds.length > 0) {
                const specialties = await this.specialtyRepository.find({
                    where: { id: (0, typeorm_2.In)(specialtyIds), isActive: true },
                });
                if (specialties.length !== specialtyIds.length) {
                    throw new common_1.BadRequestException('Una o más especialidades no existen o están inactivas');
                }
                professional.specialties = specialties;
                this.logger.log(`Asignadas ${specialties.length} especialidades al profesional`);
            }
            const savedProfessional = await this.professionalRepository.save(professional);
            this.logger.log(`✅ Profesional creado exitosamente con ID: ${savedProfessional.id}`);
            return new professional_response_dto_1.ProfessionalResponseDto(savedProfessional);
        }
        catch (error) {
            this.logger.error(`❌ Error al crear profesional: ${error.message}`);
            throw error;
        }
    }
    async findAll(includeInactive = false) {
        this.logger.log(`=== LISTANDO PROFESIONALES ===`);
        this.logger.log(`Incluir inactivos: ${includeInactive}`);
        try {
            const whereCondition = includeInactive ? {} : { isActive: true };
            const professionals = await this.professionalRepository.find({
                where: whereCondition,
                relations: ['specialties'],
                order: { firstLastname: 'ASC', firstName: 'ASC' },
            });
            this.logger.log(`✅ Encontrados ${professionals.length} profesionales`);
            return professionals.map(professional => new professional_response_dto_1.ProfessionalResponseDto(professional));
        }
        catch (error) {
            this.logger.error(`❌ Error al listar profesionales: ${error.message}`);
            throw error;
        }
    }
    async findOne(id) {
        this.logger.log(`=== BUSCANDO PROFESIONAL POR ID ===`);
        this.logger.log(`ID: ${id}`);
        try {
            const professional = await this.professionalRepository.findOne({
                where: { id },
                relations: ['specialties'],
            });
            if (!professional) {
                this.logger.warn(`Profesional con ID '${id}' no encontrado`);
                throw new common_1.NotFoundException('Profesional no encontrado');
            }
            this.logger.log(`✅ Profesional encontrado: ${professional.getFullName()}`);
            return new professional_response_dto_1.ProfessionalResponseDto(professional);
        }
        catch (error) {
            this.logger.error(`❌ Error al buscar profesional: ${error.message}`);
            throw error;
        }
    }
    async findByLicense(licenseNumber) {
        this.logger.log(`=== BUSCANDO PROFESIONAL POR COLEGIATURA ===`);
        this.logger.log(`Colegiatura: ${licenseNumber}`);
        try {
            const professional = await this.professionalRepository.findOne({
                where: { licenseNumber, isActive: true },
                relations: ['specialties'],
            });
            if (!professional) {
                this.logger.warn(`Profesional con colegiatura '${licenseNumber}' no encontrado`);
                throw new common_1.NotFoundException('Profesional no encontrado');
            }
            this.logger.log(`✅ Profesional encontrado: ${professional.getFullName()}`);
            return new professional_response_dto_1.ProfessionalResponseDto(professional);
        }
        catch (error) {
            this.logger.error(`❌ Error al buscar profesional por colegiatura: ${error.message}`);
            throw error;
        }
    }
    async findByIdentification(identificationType, identificationNumber) {
        this.logger.log(`=== BUSCANDO PROFESIONAL POR IDENTIFICACIÓN ===`);
        this.logger.log(`Tipo: ${identificationType}, Número: ${identificationNumber}`);
        try {
            const professional = await this.professionalRepository.findOne({
                where: {
                    identificationType: identificationType,
                    identificationNumber,
                    isActive: true
                },
                relations: ['specialties'],
            });
            if (!professional) {
                this.logger.warn(`Profesional con identificación '${identificationType}: ${identificationNumber}' no encontrado`);
                throw new common_1.NotFoundException('Profesional no encontrado');
            }
            this.logger.log(`✅ Profesional encontrado: ${professional.getFullName()}`);
            return new professional_response_dto_1.ProfessionalResponseDto(professional);
        }
        catch (error) {
            this.logger.error(`❌ Error al buscar profesional por identificación: ${error.message}`);
            throw error;
        }
    }
    async findBySpecialty(specialtyId) {
        this.logger.log(`=== BUSCANDO PROFESIONALES POR ESPECIALIDAD ===`);
        this.logger.log(`Especialidad ID: ${specialtyId}`);
        try {
            const specialty = await this.specialtyRepository.findOne({
                where: { id: specialtyId, isActive: true },
            });
            if (!specialty) {
                throw new common_1.NotFoundException('Especialidad no encontrada');
            }
            const professionals = await this.professionalRepository
                .createQueryBuilder('professional')
                .leftJoinAndSelect('professional.specialties', 'specialty')
                .where('professional.isActive = :isActive', { isActive: true })
                .andWhere('specialty.id = :specialtyId', { specialtyId })
                .orderBy('professional.firstLastname', 'ASC')
                .addOrderBy('professional.firstName', 'ASC')
                .getMany();
            this.logger.log(`✅ Encontrados ${professionals.length} profesionales en la especialidad '${specialty.name}'`);
            return professionals.map(professional => new professional_response_dto_1.ProfessionalResponseDto(professional));
        }
        catch (error) {
            this.logger.error(`❌ Error al buscar profesionales por especialidad: ${error.message}`);
            throw error;
        }
    }
    async search(term) {
        this.logger.log(`=== BUSCANDO PROFESIONALES ===`);
        this.logger.log(`Término de búsqueda: ${term}`);
        if (!term || term.trim().length < 2) {
            throw new common_1.BadRequestException('El término de búsqueda debe tener al menos 2 caracteres');
        }
        try {
            const searchTerm = `%${term.trim()}%`;
            const professionals = await this.professionalRepository.find({
                where: [
                    { firstName: (0, typeorm_2.Like)(searchTerm), isActive: true },
                    { secondName: (0, typeorm_2.Like)(searchTerm), isActive: true },
                    { firstLastname: (0, typeorm_2.Like)(searchTerm), isActive: true },
                    { secondLastname: (0, typeorm_2.Like)(searchTerm), isActive: true },
                    { identificationNumber: (0, typeorm_2.Like)(searchTerm), isActive: true },
                    { licenseNumber: (0, typeorm_2.Like)(searchTerm), isActive: true },
                    { email: (0, typeorm_2.Like)(searchTerm), isActive: true },
                ],
                relations: ['specialties'],
                order: { firstLastname: 'ASC', firstName: 'ASC' },
            });
            this.logger.log(`✅ Encontrados ${professionals.length} profesionales que coinciden con '${term}'`);
            return professionals.map(professional => new professional_response_dto_1.ProfessionalResponseDto(professional));
        }
        catch (error) {
            this.logger.error(`❌ Error al buscar profesionales: ${error.message}`);
            throw error;
        }
    }
    async update(id, updateProfessionalDto) {
        this.logger.log(`=== ACTUALIZANDO PROFESIONAL ===`);
        this.logger.log(`ID: ${id}`);
        this.logger.log(`Datos a actualizar:`, updateProfessionalDto);
        try {
            const professional = await this.professionalRepository.findOne({
                where: { id },
                relations: ['specialties'],
            });
            if (!professional) {
                this.logger.warn(`Profesional con ID '${id}' no encontrado`);
                throw new common_1.NotFoundException('Profesional no encontrado');
            }
            if (updateProfessionalDto.identificationType && updateProfessionalDto.identificationNumber) {
                if (updateProfessionalDto.identificationType !== professional.identificationType ||
                    updateProfessionalDto.identificationNumber !== professional.identificationNumber) {
                    const existingByIdentification = await this.professionalRepository.findOne({
                        where: {
                            identificationType: updateProfessionalDto.identificationType,
                            identificationNumber: updateProfessionalDto.identificationNumber,
                        },
                    });
                    if (existingByIdentification && existingByIdentification.id !== id) {
                        throw new common_1.ConflictException('Ya existe un profesional con esta identificación');
                    }
                }
            }
            if (updateProfessionalDto.licenseNumber && updateProfessionalDto.licenseNumber !== professional.licenseNumber) {
                const existingByLicense = await this.professionalRepository.findOne({
                    where: { licenseNumber: updateProfessionalDto.licenseNumber },
                });
                if (existingByLicense && existingByLicense.id !== id) {
                    throw new common_1.ConflictException('Ya existe un profesional con este número de colegiatura');
                }
            }
            if (updateProfessionalDto.email && updateProfessionalDto.email !== professional.email) {
                const existingByEmail = await this.professionalRepository.findOne({
                    where: { email: updateProfessionalDto.email },
                });
                if (existingByEmail && existingByEmail.id !== id) {
                    throw new common_1.ConflictException('Ya existe un profesional con este email');
                }
            }
            if (updateProfessionalDto.specialtyIds !== undefined) {
                if (updateProfessionalDto.specialtyIds.length > 0) {
                    const specialties = await this.specialtyRepository.find({
                        where: { id: (0, typeorm_2.In)(updateProfessionalDto.specialtyIds), isActive: true },
                    });
                    if (specialties.length !== updateProfessionalDto.specialtyIds.length) {
                        throw new common_1.BadRequestException('Una o más especialidades no existen o están inactivas');
                    }
                    professional.specialties = specialties;
                }
                else {
                    professional.specialties = [];
                }
            }
            const { specialtyIds, ...updateData } = updateProfessionalDto;
            if (updateData.licenseExpiryDate) {
                updateData.licenseExpiryDate = new Date(updateData.licenseExpiryDate);
            }
            Object.assign(professional, updateData);
            const updatedProfessional = await this.professionalRepository.save(professional);
            this.logger.log(`✅ Profesional actualizado exitosamente`);
            return new professional_response_dto_1.ProfessionalResponseDto(updatedProfessional);
        }
        catch (error) {
            this.logger.error(`❌ Error al actualizar profesional: ${error.message}`);
            throw error;
        }
    }
    async deactivate(id) {
        this.logger.log(`=== DESACTIVANDO PROFESIONAL ===`);
        this.logger.log(`ID: ${id}`);
        try {
            const professional = await this.professionalRepository.findOne({
                where: { id },
                relations: ['specialties'],
            });
            if (!professional) {
                this.logger.warn(`Profesional con ID '${id}' no encontrado`);
                throw new common_1.NotFoundException('Profesional no encontrado');
            }
            if (!professional.isActive) {
                this.logger.warn(`Profesional '${professional.getFullName()}' ya está desactivado`);
                throw new common_1.BadRequestException('El profesional ya está desactivado');
            }
            await this.professionalRepository.update(id, { isActive: false });
            const deactivatedProfessional = await this.professionalRepository.findOne({
                where: { id },
                relations: ['specialties'],
            });
            this.logger.log(`✅ Profesional '${professional.getFullName()}' desactivado exitosamente`);
            return new professional_response_dto_1.ProfessionalResponseDto(deactivatedProfessional);
        }
        catch (error) {
            this.logger.error(`❌ Error al desactivar profesional: ${error.message}`);
            throw error;
        }
    }
    async reactivate(id) {
        this.logger.log(`=== REACTIVANDO PROFESIONAL ===`);
        this.logger.log(`ID: ${id}`);
        try {
            const professional = await this.professionalRepository.findOne({
                where: { id },
                relations: ['specialties'],
            });
            if (!professional) {
                this.logger.warn(`Profesional con ID '${id}' no encontrado`);
                throw new common_1.NotFoundException('Profesional no encontrado');
            }
            if (professional.isActive) {
                this.logger.warn(`Profesional '${professional.getFullName()}' ya está activo`);
                throw new common_1.BadRequestException('El profesional ya está activo');
            }
            await this.professionalRepository.update(id, { isActive: true });
            const reactivatedProfessional = await this.professionalRepository.findOne({
                where: { id },
                relations: ['specialties'],
            });
            this.logger.log(`✅ Profesional '${professional.getFullName()}' reactivado exitosamente`);
            return new professional_response_dto_1.ProfessionalResponseDto(reactivatedProfessional);
        }
        catch (error) {
            this.logger.error(`❌ Error al reactivar profesional: ${error.message}`);
            throw error;
        }
    }
};
exports.ProfessionalsService = ProfessionalsService;
exports.ProfessionalsService = ProfessionalsService = ProfessionalsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(professional_entity_1.Professional)),
    __param(1, (0, typeorm_1.InjectRepository)(specialty_entity_1.Specialty)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ProfessionalsService);
//# sourceMappingURL=professionals.service.js.map
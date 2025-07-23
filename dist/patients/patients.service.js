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
var PatientsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const patient_entity_1 = require("./entities/patient.entity");
let PatientsService = PatientsService_1 = class PatientsService {
    patientRepository;
    logger = new common_1.Logger(PatientsService_1.name);
    constructor(patientRepository) {
        this.patientRepository = patientRepository;
    }
    async create(createPatientDto) {
        this.logger.log(`=== CREANDO NUEVO PACIENTE ===`);
        this.logger.log(`Identificación: ${createPatientDto.identificationType} ${createPatientDto.identificationNumber}`);
        this.logger.log(`Nombre: ${createPatientDto.firstName} ${createPatientDto.firstLastname}`);
        const existingPatient = await this.patientRepository.findOne({
            where: {
                identificationType: createPatientDto.identificationType,
                identificationNumber: createPatientDto.identificationNumber,
            },
        });
        if (existingPatient) {
            this.logger.error(`Paciente ya existe con identificación: ${createPatientDto.identificationType} ${createPatientDto.identificationNumber}`);
            throw new common_1.ConflictException('Ya existe un paciente con este tipo y número de identificación');
        }
        try {
            const patient = this.patientRepository.create({
                ...createPatientDto,
                birthDate: new Date(createPatientDto.birthDate),
            });
            const savedPatient = await this.patientRepository.save(patient);
            this.logger.log(`Paciente creado exitosamente con ID: ${savedPatient.id}`);
            return this.mapToResponseDto(savedPatient);
        }
        catch (error) {
            this.logger.error(`Error al crear paciente: ${error.message}`);
            throw error;
        }
    }
    async findAll(includeInactive = false) {
        this.logger.log(`=== LISTANDO PACIENTES ===`);
        this.logger.log(`Incluir inactivos: ${includeInactive}`);
        const whereCondition = includeInactive ? {} : { isActive: true };
        const patients = await this.patientRepository.find({
            where: whereCondition,
            order: { createdAt: 'DESC' },
        });
        this.logger.log(`Encontrados ${patients.length} pacientes`);
        return patients.map(patient => this.mapToResponseDto(patient));
    }
    async findById(id) {
        this.logger.log(`=== BUSCANDO PACIENTE POR ID ===`);
        this.logger.log(`ID: ${id}`);
        const patient = await this.patientRepository.findOne({
            where: { id, isActive: true },
        });
        if (!patient) {
            this.logger.error(`Paciente no encontrado con ID: ${id}`);
            throw new common_1.NotFoundException('Paciente no encontrado');
        }
        this.logger.log(`Paciente encontrado: ${patient.getFullName()}`);
        return this.mapToResponseDto(patient);
    }
    async findByIdentification(identificationType, identificationNumber) {
        this.logger.log(`=== BUSCANDO PACIENTE POR IDENTIFICACIÓN ===`);
        this.logger.log(`Identificación: ${identificationType} ${identificationNumber}`);
        const patient = await this.patientRepository.findOne({
            where: {
                identificationType: identificationType,
                identificationNumber,
                isActive: true,
            },
        });
        if (!patient) {
            this.logger.error(`Paciente no encontrado con identificación: ${identificationType} ${identificationNumber}`);
            throw new common_1.NotFoundException('Paciente no encontrado');
        }
        this.logger.log(`Paciente encontrado: ${patient.getFullName()}`);
        return this.mapToResponseDto(patient);
    }
    async searchPatients(searchTerm) {
        this.logger.log(`=== BUSCANDO PACIENTES ===`);
        this.logger.log(`Término de búsqueda: ${searchTerm}`);
        const patients = await this.patientRepository.find({
            where: [
                { firstName: (0, typeorm_2.Like)(`%${searchTerm}%`), isActive: true },
                { firstLastname: (0, typeorm_2.Like)(`%${searchTerm}%`), isActive: true },
                { identificationNumber: (0, typeorm_2.Like)(`%${searchTerm}%`), isActive: true },
                { email: (0, typeorm_2.Like)(`%${searchTerm}%`), isActive: true },
            ],
            order: { createdAt: 'DESC' },
        });
        this.logger.log(`Encontrados ${patients.length} pacientes con el término: ${searchTerm}`);
        return patients.map(patient => this.mapToResponseDto(patient));
    }
    async update(id, updatePatientDto) {
        this.logger.log(`=== ACTUALIZANDO PACIENTE ===`);
        this.logger.log(`ID: ${id}`);
        const patient = await this.patientRepository.findOne({
            where: { id },
        });
        if (!patient) {
            this.logger.error(`Paciente no encontrado con ID: ${id}`);
            throw new common_1.NotFoundException('Paciente no encontrado');
        }
        if (updatePatientDto.identificationType || updatePatientDto.identificationNumber) {
            const identificationType = updatePatientDto.identificationType || patient.identificationType;
            const identificationNumber = updatePatientDto.identificationNumber || patient.identificationNumber;
            const existingPatient = await this.patientRepository.findOne({
                where: {
                    identificationType,
                    identificationNumber,
                    id: (0, typeorm_2.Not)(id),
                },
            });
            if (existingPatient) {
                this.logger.error(`Ya existe otro paciente con identificación: ${identificationType} ${identificationNumber}`);
                throw new common_1.ConflictException('Ya existe otro paciente con este tipo y número de identificación');
            }
        }
        try {
            const updateData = { ...updatePatientDto };
            if (updatePatientDto.birthDate) {
                updateData.birthDate = new Date(updatePatientDto.birthDate);
            }
            await this.patientRepository.update(id, updateData);
            const updatedPatient = await this.patientRepository.findOne({
                where: { id },
            });
            if (!updatedPatient) {
                throw new common_1.NotFoundException('Error al actualizar paciente');
            }
            this.logger.log(`Paciente actualizado exitosamente: ${updatedPatient.getFullName()}`);
            return this.mapToResponseDto(updatedPatient);
        }
        catch (error) {
            this.logger.error(`Error al actualizar paciente: ${error.message}`);
            throw error;
        }
    }
    async deactivate(id) {
        this.logger.log(`=== DESACTIVANDO PACIENTE ===`);
        this.logger.log(`ID: ${id}`);
        const patient = await this.patientRepository.findOne({
            where: { id },
        });
        if (!patient) {
            this.logger.error(`Paciente no encontrado con ID: ${id}`);
            throw new common_1.NotFoundException('Paciente no encontrado');
        }
        await this.patientRepository.update(id, { isActive: false });
        this.logger.log(`Paciente desactivado exitosamente: ${patient.getFullName()}`);
    }
    async reactivate(id) {
        this.logger.log(`=== REACTIVANDO PACIENTE ===`);
        this.logger.log(`ID: ${id}`);
        const patient = await this.patientRepository.findOne({
            where: { id },
        });
        if (!patient) {
            this.logger.error(`Paciente no encontrado con ID: ${id}`);
            throw new common_1.NotFoundException('Paciente no encontrado');
        }
        await this.patientRepository.update(id, { isActive: true });
        const reactivatedPatient = await this.patientRepository.findOne({
            where: { id },
        });
        if (!reactivatedPatient) {
            throw new common_1.NotFoundException('Error al reactivar paciente');
        }
        this.logger.log(`Paciente reactivado exitosamente: ${reactivatedPatient.getFullName()}`);
        return this.mapToResponseDto(reactivatedPatient);
    }
    mapToResponseDto(patient) {
        return {
            id: patient.id,
            firstName: patient.firstName,
            secondName: patient.secondName,
            firstLastname: patient.firstLastname,
            secondLastname: patient.secondLastname,
            identificationType: patient.identificationType,
            identificationNumber: patient.identificationNumber,
            birthDate: patient.birthDate,
            age: patient.getAge(),
            gender: patient.gender,
            maritalStatus: patient.maritalStatus,
            educationLevel: patient.educationLevel,
            phone: patient.phone,
            email: patient.email,
            address: patient.address,
            emergencyContactName: patient.emergencyContactName,
            emergencyContactPhone: patient.emergencyContactPhone,
            emergencyContactRelationship: patient.emergencyContactRelationship,
            bloodType: patient.bloodType,
            allergies: patient.allergies,
            observations: patient.observations,
            isActive: patient.isActive,
            createdAt: patient.createdAt,
            updatedAt: patient.updatedAt,
            fullName: patient.getFullName(),
            fullIdentification: patient.getFullIdentification(),
        };
    }
};
exports.PatientsService = PatientsService;
exports.PatientsService = PatientsService = PatientsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(patient_entity_1.Patient)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PatientsService);
//# sourceMappingURL=patients.service.js.map
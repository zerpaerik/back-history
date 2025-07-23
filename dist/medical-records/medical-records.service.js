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
var MedicalRecordsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicalRecordsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const medical_record_entity_1 = require("./entities/medical-record.entity");
const triage_entity_1 = require("./entities/triage.entity");
const medical_history_base_entity_1 = require("./entities/medical-history-base.entity");
const specialty_medical_history_entity_1 = require("./entities/specialty-medical-history.entity");
const patient_entity_1 = require("../patients/entities/patient.entity");
const professional_entity_1 = require("../professionals/entities/professional.entity");
const specialty_entity_1 = require("../specialties/entities/specialty.entity");
const medical_record_response_dto_1 = require("./dto/medical-record-response.dto");
const medical_history_response_dto_1 = require("./dto/medical-history-response.dto");
let MedicalRecordsService = MedicalRecordsService_1 = class MedicalRecordsService {
    medicalRecordRepository;
    triageRepository;
    medicalHistoryBaseRepository;
    specialtyMedicalHistoryRepository;
    patientRepository;
    professionalRepository;
    specialtyRepository;
    logger = new common_1.Logger(MedicalRecordsService_1.name);
    constructor(medicalRecordRepository, triageRepository, medicalHistoryBaseRepository, specialtyMedicalHistoryRepository, patientRepository, professionalRepository, specialtyRepository) {
        this.medicalRecordRepository = medicalRecordRepository;
        this.triageRepository = triageRepository;
        this.medicalHistoryBaseRepository = medicalHistoryBaseRepository;
        this.specialtyMedicalHistoryRepository = specialtyMedicalHistoryRepository;
        this.patientRepository = patientRepository;
        this.professionalRepository = professionalRepository;
        this.specialtyRepository = specialtyRepository;
    }
    async create(createMedicalRecordDto) {
        this.logger.log(`=== CREANDO NUEVA HISTORIA CLÍNICA ===`);
        this.logger.log(`Paciente ID: ${createMedicalRecordDto.patientId}`);
        this.logger.log(`Profesional ID: ${createMedicalRecordDto.professionalId}`);
        this.logger.log(`Especialidad ID: ${createMedicalRecordDto.specialtyId}`);
        try {
            const patient = await this.patientRepository.findOne({
                where: { id: createMedicalRecordDto.patientId, isActive: true },
            });
            if (!patient) {
                throw new common_1.NotFoundException('Paciente no encontrado o inactivo');
            }
            const professional = await this.professionalRepository.findOne({
                where: { id: createMedicalRecordDto.professionalId, isActive: true },
                relations: ['specialties'],
            });
            if (!professional) {
                throw new common_1.NotFoundException('Profesional no encontrado o inactivo');
            }
            const specialty = await this.specialtyRepository.findOne({
                where: { id: createMedicalRecordDto.specialtyId, isActive: true },
            });
            if (!specialty) {
                throw new common_1.NotFoundException('Especialidad no encontrada o inactiva');
            }
            const hasSpecialty = professional.specialties.some(spec => spec.id === createMedicalRecordDto.specialtyId);
            if (!hasSpecialty) {
                throw new common_1.BadRequestException(`El profesional ${professional.getFullName()} no tiene la especialidad ${specialty.name}`);
            }
            const recordNumber = await this.generateRecordNumber();
            let triage = null;
            if (createMedicalRecordDto.triage && this.hasTriageData(createMedicalRecordDto.triage)) {
                triage = this.triageRepository.create(createMedicalRecordDto.triage);
                await this.triageRepository.save(triage);
                this.logger.log(`Triaje creado con ID: ${triage.id}`);
            }
            this.logger.log('🕐 Valores de tiempo recibidos:');
            this.logger.log(`appointmentTimeFrom: "${createMedicalRecordDto.appointmentTimeFrom}"`);
            this.logger.log(`appointmentTimeTo: "${createMedicalRecordDto.appointmentTimeTo}"`);
            const timeFromProcessed = createMedicalRecordDto.appointmentTimeFrom && createMedicalRecordDto.appointmentTimeFrom.trim() !== '' ?
                createMedicalRecordDto.appointmentTimeFrom : undefined;
            const timeToProcessed = createMedicalRecordDto.appointmentTimeTo && createMedicalRecordDto.appointmentTimeTo.trim() !== '' ?
                createMedicalRecordDto.appointmentTimeTo : undefined;
            this.logger.log(`Procesados - timeFrom: ${timeFromProcessed}, timeTo: ${timeToProcessed}`);
            const medicalRecordData = {
                recordNumber,
                appointmentDate: createMedicalRecordDto.appointmentDate ?
                    new Date(createMedicalRecordDto.appointmentDate) : undefined,
                appointmentTimeFrom: timeFromProcessed,
                appointmentTimeTo: timeToProcessed,
                status: createMedicalRecordDto.status || medical_record_entity_1.MedicalRecordStatus.PENDING,
                chiefComplaint: createMedicalRecordDto.chiefComplaint,
                currentIllness: createMedicalRecordDto.currentIllness,
                physicalExamination: createMedicalRecordDto.physicalExamination,
                diagnosis: createMedicalRecordDto.diagnosis,
                treatment: createMedicalRecordDto.treatment,
                observations: createMedicalRecordDto.observations,
            };
            const medicalRecord = this.medicalRecordRepository.create(medicalRecordData);
            medicalRecord.patient = patient;
            medicalRecord.professional = professional;
            medicalRecord.specialty = specialty;
            if (triage) {
                medicalRecord.triage = triage;
            }
            const savedMedicalRecord = await this.medicalRecordRepository.save(medicalRecord);
            this.logger.log(`✅ Historia clínica creada exitosamente: ${recordNumber}`);
            this.logger.log(`Paciente: ${patient.getFullName()}`);
            this.logger.log(`Profesional: ${professional.getFullName()}`);
            this.logger.log(`Especialidad: ${specialty.name}`);
            return new medical_record_response_dto_1.MedicalRecordResponseDto(savedMedicalRecord);
        }
        catch (error) {
            this.logger.error(`❌ Error al crear historia clínica: ${error.message}`);
            throw error;
        }
    }
    async findAll(includeInactive = false) {
        this.logger.log(`=== LISTANDO HISTORIAS CLÍNICAS ===`);
        this.logger.log(`Incluir inactivas: ${includeInactive}`);
        try {
            const whereCondition = includeInactive ? {} : { isActive: true };
            const medicalRecords = await this.medicalRecordRepository.find({
                where: whereCondition,
                relations: ['patient', 'professional', 'specialty', 'triage'],
                order: { createdAt: 'DESC' },
            });
            this.logger.log(`✅ Encontradas ${medicalRecords.length} historias clínicas`);
            return medicalRecords.map(record => new medical_record_response_dto_1.MedicalRecordResponseDto(record));
        }
        catch (error) {
            this.logger.error(`❌ Error al listar historias clínicas: ${error.message}`);
            throw error;
        }
    }
    async findOne(id) {
        this.logger.log(`=== BUSCANDO HISTORIA CLÍNICA POR ID ===`);
        this.logger.log(`ID: ${id}`);
        try {
            const medicalRecord = await this.medicalRecordRepository.findOne({
                where: { id },
                relations: ['patient', 'professional', 'specialty', 'triage'],
            });
            if (!medicalRecord) {
                this.logger.warn(`Historia clínica con ID '${id}' no encontrada`);
                throw new common_1.NotFoundException('Historia clínica no encontrada');
            }
            this.logger.log(`✅ Historia clínica encontrada: ${medicalRecord.recordNumber}`);
            return new medical_record_response_dto_1.MedicalRecordResponseDto(medicalRecord);
        }
        catch (error) {
            this.logger.error(`❌ Error al buscar historia clínica: ${error.message}`);
            throw error;
        }
    }
    async findByRecordNumber(recordNumber) {
        this.logger.log(`=== BUSCANDO HISTORIA CLÍNICA POR NÚMERO ===`);
        this.logger.log(`Número: ${recordNumber}`);
        try {
            const medicalRecord = await this.medicalRecordRepository.findOne({
                where: { recordNumber, isActive: true },
                relations: ['patient', 'professional', 'specialty', 'triage'],
            });
            if (!medicalRecord) {
                this.logger.warn(`Historia clínica con número '${recordNumber}' no encontrada`);
                throw new common_1.NotFoundException('Historia clínica no encontrada');
            }
            this.logger.log(`✅ Historia clínica encontrada: ${medicalRecord.getSummary()}`);
            return new medical_record_response_dto_1.MedicalRecordResponseDto(medicalRecord);
        }
        catch (error) {
            this.logger.error(`❌ Error al buscar historia clínica por número: ${error.message}`);
            throw error;
        }
    }
    async findByPatientDni(dni) {
        this.logger.log(`=== BUSCANDO HISTORIAS CLÍNICAS POR DNI DE PACIENTE ===`);
        this.logger.log(`DNI: ${dni}`);
        try {
            const patient = await this.patientRepository.findOne({
                where: {
                    identificationType: 'DNI',
                    identificationNumber: dni,
                    isActive: true
                },
            });
            if (!patient) {
                throw new common_1.NotFoundException(`Paciente con DNI ${dni} no encontrado`);
            }
            const medicalRecords = await this.medicalRecordRepository.find({
                where: {
                    patient: { id: patient.id },
                    isActive: true
                },
                relations: ['patient', 'professional', 'specialty', 'triage'],
                order: { createdAt: 'DESC' },
            });
            this.logger.log(`✅ Encontradas ${medicalRecords.length} historias clínicas para el paciente ${patient.getFullName()}`);
            return medicalRecords.map(record => new medical_record_response_dto_1.MedicalRecordResponseDto(record));
        }
        catch (error) {
            this.logger.error(`❌ Error al buscar historias clínicas por DNI: ${error.message}`);
            throw error;
        }
    }
    async findBySpecialty(specialtyId) {
        this.logger.log(`=== BUSCANDO HISTORIAS CLÍNICAS POR ESPECIALIDAD ===`);
        this.logger.log(`Especialidad ID: ${specialtyId}`);
        try {
            const medicalRecords = await this.medicalRecordRepository.find({
                where: {
                    specialty: { id: specialtyId },
                    isActive: true
                },
                relations: ['patient', 'professional', 'specialty', 'triage'],
                order: { createdAt: 'DESC' },
            });
            this.logger.log(`✅ Encontradas ${medicalRecords.length} historias clínicas para la especialidad`);
            return medicalRecords.map(record => new medical_record_response_dto_1.MedicalRecordResponseDto(record));
        }
        catch (error) {
            this.logger.error(`❌ Error al buscar historias clínicas por especialidad: ${error.message}`);
            throw error;
        }
    }
    async findByProfessional(professionalId) {
        this.logger.log(`=== BUSCANDO HISTORIAS CLÍNICAS POR PROFESIONAL ===`);
        this.logger.log(`Profesional ID: ${professionalId}`);
        try {
            const medicalRecords = await this.medicalRecordRepository.find({
                where: {
                    professional: { id: professionalId },
                    isActive: true
                },
                relations: ['patient', 'professional', 'specialty', 'triage'],
                order: { createdAt: 'DESC' },
            });
            this.logger.log(`✅ Encontradas ${medicalRecords.length} historias clínicas para el profesional`);
            return medicalRecords.map(record => new medical_record_response_dto_1.MedicalRecordResponseDto(record));
        }
        catch (error) {
            this.logger.error(`❌ Error al buscar historias clínicas por profesional: ${error.message}`);
            throw error;
        }
    }
    async update(id, updateMedicalRecordDto) {
        this.logger.log(`=== ACTUALIZANDO HISTORIA CLÍNICA ===`);
        this.logger.log(`ID: ${id}`);
        try {
            const medicalRecord = await this.medicalRecordRepository.findOne({
                where: { id },
                relations: ['patient', 'professional', 'specialty', 'triage'],
            });
            if (!medicalRecord) {
                throw new common_1.NotFoundException('Historia clínica no encontrada');
            }
            if (updateMedicalRecordDto.triage) {
                if (medicalRecord.triage) {
                    Object.assign(medicalRecord.triage, updateMedicalRecordDto.triage);
                    await this.triageRepository.save(medicalRecord.triage);
                }
                else if (this.hasTriageData(updateMedicalRecordDto.triage)) {
                    const triage = this.triageRepository.create(updateMedicalRecordDto.triage);
                    await this.triageRepository.save(triage);
                    medicalRecord.triage = triage;
                }
            }
            const { triage, ...updateData } = updateMedicalRecordDto;
            if (updateData.appointmentDate) {
                updateData.appointmentDate = new Date(updateData.appointmentDate);
            }
            Object.assign(medicalRecord, updateData);
            const updatedMedicalRecord = await this.medicalRecordRepository.save(medicalRecord);
            this.logger.log(`✅ Historia clínica actualizada exitosamente: ${medicalRecord.recordNumber}`);
            return new medical_record_response_dto_1.MedicalRecordResponseDto(updatedMedicalRecord);
        }
        catch (error) {
            this.logger.error(`❌ Error al actualizar historia clínica: ${error.message}`);
            throw error;
        }
    }
    async deactivate(id) {
        this.logger.log(`=== DESACTIVANDO HISTORIA CLÍNICA ===`);
        this.logger.log(`ID: ${id}`);
        try {
            const medicalRecord = await this.medicalRecordRepository.findOne({
                where: { id },
                relations: ['patient', 'professional', 'specialty', 'triage'],
            });
            if (!medicalRecord) {
                throw new common_1.NotFoundException('Historia clínica no encontrada');
            }
            if (!medicalRecord.isActive) {
                throw new common_1.BadRequestException('La historia clínica ya está desactivada');
            }
            await this.medicalRecordRepository.update(id, { isActive: false });
            const deactivatedRecord = await this.medicalRecordRepository.findOne({
                where: { id },
                relations: ['patient', 'professional', 'specialty', 'triage'],
            });
            this.logger.log(`✅ Historia clínica desactivada exitosamente: ${medicalRecord.recordNumber}`);
            return new medical_record_response_dto_1.MedicalRecordResponseDto(deactivatedRecord);
        }
        catch (error) {
            this.logger.error(`❌ Error al desactivar historia clínica: ${error.message}`);
            throw error;
        }
    }
    async generateRecordNumber() {
        const year = new Date().getFullYear();
        const prefix = `HC${year}`;
        const lastRecord = await this.medicalRecordRepository
            .createQueryBuilder('record')
            .where('record.recordNumber LIKE :prefix', { prefix: `${prefix}%` })
            .orderBy('record.recordNumber', 'DESC')
            .getOne();
        let nextNumber = 1;
        if (lastRecord) {
            const lastNumber = parseInt(lastRecord.recordNumber.replace(prefix, ''));
            nextNumber = lastNumber + 1;
        }
        return `${prefix}${nextNumber.toString().padStart(6, '0')}`;
    }
    hasTriageData(triageDto) {
        return !!(triageDto.weight ||
            triageDto.height ||
            triageDto.bloodPressure ||
            triageDto.oxygenSaturation ||
            triageDto.heartRate ||
            triageDto.temperature ||
            triageDto.observations);
    }
    async updateTriage(id, triageData) {
        try {
            this.logger.log(`🩺 Actualizando triaje para historia clínica: ${id}`);
            this.logger.log('Datos de triaje recibidos:', triageData);
            const medicalRecord = await this.medicalRecordRepository.findOne({
                where: { id, isActive: true },
                relations: ['patient', 'professional', 'specialty', 'triage']
            });
            if (!medicalRecord) {
                throw new common_1.NotFoundException(`Historia clínica con ID ${id} no encontrada`);
            }
            let triage;
            if (medicalRecord.triage) {
                this.logger.log('Actualizando triaje existente:', medicalRecord.triage.id);
                Object.assign(medicalRecord.triage, triageData);
                const savedTriage = await this.triageRepository.save(medicalRecord.triage);
                triage = Array.isArray(savedTriage) ? savedTriage[0] : savedTriage;
            }
            else {
                this.logger.log('Creando nuevo triaje');
                const newTriage = this.triageRepository.create(triageData);
                const savedTriage = await this.triageRepository.save(newTriage);
                triage = Array.isArray(savedTriage) ? savedTriage[0] : savedTriage;
                medicalRecord.triage = triage;
                await this.medicalRecordRepository.save(medicalRecord);
            }
            const updatedRecord = await this.medicalRecordRepository.findOne({
                where: { id },
                relations: ['patient', 'professional', 'specialty', 'triage']
            });
            if (!updatedRecord) {
                throw new common_1.NotFoundException(`No se pudo obtener la historia clínica actualizada`);
            }
            this.logger.log(`✅ Triaje actualizado exitosamente para historia clínica: ${medicalRecord.recordNumber}`);
            return new medical_record_response_dto_1.MedicalRecordResponseDto(updatedRecord);
        }
        catch (error) {
            this.logger.error(`❌ Error al actualizar triaje: ${error.message}`);
            throw error;
        }
    }
    async getStats() {
        try {
            this.logger.log('📊 Obteniendo estadísticas de historias clínicas');
            const [total, pending, inProgress, completed, withTriage, withoutTriage] = await Promise.all([
                this.medicalRecordRepository.count({ where: { isActive: true } }),
                this.medicalRecordRepository.count({
                    where: {
                        status: medical_record_entity_1.MedicalRecordStatus.PENDING,
                        isActive: true
                    }
                }),
                this.medicalRecordRepository.count({
                    where: {
                        status: medical_record_entity_1.MedicalRecordStatus.IN_PROGRESS,
                        isActive: true
                    }
                }),
                this.medicalRecordRepository.count({
                    where: {
                        status: medical_record_entity_1.MedicalRecordStatus.COMPLETED,
                        isActive: true
                    }
                }),
                this.medicalRecordRepository.createQueryBuilder('medicalRecord')
                    .where('medicalRecord.isActive = :isActive', { isActive: true })
                    .andWhere('medicalRecord.triage IS NOT NULL')
                    .getCount(),
                this.medicalRecordRepository.createQueryBuilder('medicalRecord')
                    .where('medicalRecord.isActive = :isActive', { isActive: true })
                    .andWhere('medicalRecord.triage IS NULL')
                    .getCount()
            ]);
            const stats = {
                total,
                pending,
                inProgress,
                completed,
                withTriage,
                withoutTriage
            };
            this.logger.log('✅ Estadísticas obtenidas:', stats);
            return stats;
        }
        catch (error) {
            this.logger.error('❌ Error al obtener estadísticas:', error.message);
            throw error;
        }
    }
    async createMedicalHistoryBase(medicalRecordId, createMedicalHistoryBaseDto) {
        try {
            this.logger.log(`=== CREANDO ANTECEDENTES PARA HISTORIA CLÍNICA ${medicalRecordId} ===`);
            const medicalRecord = await this.medicalRecordRepository.findOne({
                where: { id: medicalRecordId, isActive: true },
                relations: ['medicalHistoryBase']
            });
            if (!medicalRecord) {
                throw new common_1.NotFoundException('Historia clínica no encontrada');
            }
            if (medicalRecord.medicalHistoryBase) {
                throw new common_1.ConflictException('Esta historia clínica ya tiene antecedentes registrados');
            }
            const medicalHistoryBase = this.medicalHistoryBaseRepository.create({
                ...createMedicalHistoryBaseDto,
                medicalRecord,
            });
            const savedMedicalHistoryBase = await this.medicalHistoryBaseRepository.save(medicalHistoryBase);
            this.logger.log(`✅ Antecedentes creados exitosamente: ${savedMedicalHistoryBase.id}`);
            return new medical_history_response_dto_1.MedicalHistoryBaseResponseDto(savedMedicalHistoryBase);
        }
        catch (error) {
            this.logger.error(`❌ Error al crear antecedentes: ${error.message}`);
            throw error;
        }
    }
    async getMedicalHistoryBase(medicalRecordId) {
        try {
            this.logger.log(`=== OBTENIENDO ANTECEDENTES DE HISTORIA CLÍNICA ${medicalRecordId} ===`);
            const medicalRecord = await this.medicalRecordRepository.findOne({
                where: { id: medicalRecordId, isActive: true },
                relations: ['medicalHistoryBase']
            });
            if (!medicalRecord) {
                throw new common_1.NotFoundException('Historia clínica no encontrada');
            }
            if (!medicalRecord.medicalHistoryBase) {
                throw new common_1.NotFoundException('No se encontraron antecedentes para esta historia clínica');
            }
            return new medical_history_response_dto_1.MedicalHistoryBaseResponseDto(medicalRecord.medicalHistoryBase);
        }
        catch (error) {
            this.logger.error(`❌ Error al obtener antecedentes: ${error.message}`);
            throw error;
        }
    }
    async updateMedicalHistoryBase(medicalRecordId, updateMedicalHistoryBaseDto) {
        try {
            this.logger.log(`=== ACTUALIZANDO ANTECEDENTES DE HISTORIA CLÍNICA ${medicalRecordId} ===`);
            const medicalRecord = await this.medicalRecordRepository.findOne({
                where: { id: medicalRecordId, isActive: true },
                relations: ['medicalHistoryBase']
            });
            if (!medicalRecord) {
                throw new common_1.NotFoundException('Historia clínica no encontrada');
            }
            if (!medicalRecord.medicalHistoryBase) {
                throw new common_1.NotFoundException('No se encontraron antecedentes para actualizar');
            }
            await this.medicalHistoryBaseRepository.update(medicalRecord.medicalHistoryBase.id, updateMedicalHistoryBaseDto);
            const updatedMedicalHistoryBase = await this.medicalHistoryBaseRepository.findOne({
                where: { id: medicalRecord.medicalHistoryBase.id }
            });
            if (!updatedMedicalHistoryBase) {
                throw new common_1.NotFoundException('No se pudo obtener los antecedentes actualizados');
            }
            this.logger.log(`✅ Antecedentes actualizados exitosamente: ${updatedMedicalHistoryBase.id}`);
            return new medical_history_response_dto_1.MedicalHistoryBaseResponseDto(updatedMedicalHistoryBase);
        }
        catch (error) {
            this.logger.error(`❌ Error al actualizar antecedentes: ${error.message}`);
            throw error;
        }
    }
    async createSpecialtyMedicalHistory(medicalRecordId, createSpecialtyMedicalHistoryDto) {
        try {
            this.logger.log(`=== CREANDO HISTORIA CLÍNICA POR ESPECIALIDAD PARA ${medicalRecordId} ===`);
            const medicalRecord = await this.medicalRecordRepository.findOne({
                where: { id: medicalRecordId, isActive: true },
                relations: ['specialtyMedicalHistory']
            });
            if (!medicalRecord) {
                throw new common_1.NotFoundException('Historia clínica no encontrada');
            }
            if (medicalRecord.specialtyMedicalHistory) {
                throw new common_1.ConflictException('Esta historia clínica ya tiene historia por especialidad registrada');
            }
            const specialtyMedicalHistory = this.specialtyMedicalHistoryRepository.create({
                ...createSpecialtyMedicalHistoryDto,
                medicalRecord,
            });
            const savedSpecialtyMedicalHistory = await this.specialtyMedicalHistoryRepository.save(specialtyMedicalHistory);
            this.logger.log(`✅ Historia clínica por especialidad creada exitosamente: ${savedSpecialtyMedicalHistory.id}`);
            return new medical_history_response_dto_1.SpecialtyMedicalHistoryResponseDto(savedSpecialtyMedicalHistory);
        }
        catch (error) {
            this.logger.error(`❌ Error al crear historia clínica por especialidad: ${error.message}`);
            throw error;
        }
    }
    async getSpecialtyMedicalHistory(medicalRecordId) {
        try {
            this.logger.log(`=== OBTENIENDO HISTORIA CLÍNICA POR ESPECIALIDAD DE ${medicalRecordId} ===`);
            const medicalRecord = await this.medicalRecordRepository.findOne({
                where: { id: medicalRecordId, isActive: true },
                relations: ['specialtyMedicalHistory']
            });
            if (!medicalRecord) {
                throw new common_1.NotFoundException('Historia clínica no encontrada');
            }
            if (!medicalRecord.specialtyMedicalHistory) {
                throw new common_1.NotFoundException('No se encontró historia clínica por especialidad');
            }
            return new medical_history_response_dto_1.SpecialtyMedicalHistoryResponseDto(medicalRecord.specialtyMedicalHistory);
        }
        catch (error) {
            this.logger.error(`❌ Error al obtener historia clínica por especialidad: ${error.message}`);
            throw error;
        }
    }
    async updateSpecialtyMedicalHistory(medicalRecordId, updateSpecialtyMedicalHistoryDto) {
        try {
            this.logger.log(`=== ACTUALIZANDO HISTORIA CLÍNICA POR ESPECIALIDAD DE ${medicalRecordId} ===`);
            const medicalRecord = await this.medicalRecordRepository.findOne({
                where: { id: medicalRecordId, isActive: true },
                relations: ['specialtyMedicalHistory']
            });
            if (!medicalRecord) {
                throw new common_1.NotFoundException('Historia clínica no encontrada');
            }
            if (!medicalRecord.specialtyMedicalHistory) {
                throw new common_1.NotFoundException('No se encontró historia clínica por especialidad para actualizar');
            }
            await this.specialtyMedicalHistoryRepository.update(medicalRecord.specialtyMedicalHistory.id, updateSpecialtyMedicalHistoryDto);
            const updatedSpecialtyMedicalHistory = await this.specialtyMedicalHistoryRepository.findOne({
                where: { id: medicalRecord.specialtyMedicalHistory.id }
            });
            if (!updatedSpecialtyMedicalHistory) {
                throw new common_1.NotFoundException('No se pudo obtener la historia clínica por especialidad actualizada');
            }
            this.logger.log(`✅ Historia clínica por especialidad actualizada exitosamente: ${updatedSpecialtyMedicalHistory.id}`);
            return new medical_history_response_dto_1.SpecialtyMedicalHistoryResponseDto(updatedSpecialtyMedicalHistory);
        }
        catch (error) {
            this.logger.error(`❌ Error al actualizar historia clínica por especialidad: ${error.message}`);
            throw error;
        }
    }
    async getCompletionStatus(medicalRecordId) {
        try {
            this.logger.log(`=== VERIFICANDO COMPLETITUD DE HISTORIA CLÍNICA ${medicalRecordId} ===`);
            const medicalRecord = await this.medicalRecordRepository.findOne({
                where: { id: medicalRecordId, isActive: true },
                relations: ['triage', 'medicalHistoryBase', 'specialtyMedicalHistory']
            });
            if (!medicalRecord) {
                throw new common_1.NotFoundException('Historia clínica no encontrada');
            }
            const hasTriage = !!medicalRecord.triage;
            const hasMedicalHistoryBase = !!medicalRecord.medicalHistoryBase;
            const hasSpecialtyHistory = !!medicalRecord.specialtyMedicalHistory;
            const missingSteps = [];
            if (!hasTriage)
                missingSteps.push('triaje');
            if (!hasMedicalHistoryBase)
                missingSteps.push('antecedentes');
            if (!hasSpecialtyHistory)
                missingSteps.push('historia por especialidad');
            const canFinalize = hasTriage && hasMedicalHistoryBase && hasSpecialtyHistory;
            const status = {
                hasTriage,
                hasMedicalHistoryBase,
                hasSpecialtyHistory,
                canFinalize,
                missingSteps,
            };
            this.logger.log(`✅ Estado de completitud:`, status);
            return status;
        }
        catch (error) {
            this.logger.error(`❌ Error al verificar completitud: ${error.message}`);
            throw error;
        }
    }
    async finalizeRecord(medicalRecordId) {
        try {
            this.logger.log(`=== FINALIZANDO HISTORIA CLÍNICA ${medicalRecordId} ===`);
            const completionStatus = await this.getCompletionStatus(medicalRecordId);
            if (!completionStatus.canFinalize) {
                throw new common_1.BadRequestException(`No se puede finalizar la historia clínica. Faltan: ${completionStatus.missingSteps.join(', ')}`);
            }
            await this.medicalRecordRepository.update(medicalRecordId, {
                status: medical_record_entity_1.MedicalRecordStatus.COMPLETED,
            });
            const finalizedRecord = await this.medicalRecordRepository.findOne({
                where: { id: medicalRecordId },
                relations: ['patient', 'professional', 'specialty', 'triage']
            });
            if (!finalizedRecord) {
                throw new common_1.NotFoundException('No se pudo obtener la historia clínica finalizada');
            }
            this.logger.log(`✅ Historia clínica finalizada exitosamente: ${finalizedRecord.recordNumber}`);
            return new medical_record_response_dto_1.MedicalRecordResponseDto(finalizedRecord);
        }
        catch (error) {
            this.logger.error(`❌ Error al finalizar historia clínica: ${error.message}`);
            throw error;
        }
    }
};
exports.MedicalRecordsService = MedicalRecordsService;
exports.MedicalRecordsService = MedicalRecordsService = MedicalRecordsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(medical_record_entity_1.MedicalRecord)),
    __param(1, (0, typeorm_1.InjectRepository)(triage_entity_1.Triage)),
    __param(2, (0, typeorm_1.InjectRepository)(medical_history_base_entity_1.MedicalHistoryBase)),
    __param(3, (0, typeorm_1.InjectRepository)(specialty_medical_history_entity_1.SpecialtyMedicalHistory)),
    __param(4, (0, typeorm_1.InjectRepository)(patient_entity_1.Patient)),
    __param(5, (0, typeorm_1.InjectRepository)(professional_entity_1.Professional)),
    __param(6, (0, typeorm_1.InjectRepository)(specialty_entity_1.Specialty)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], MedicalRecordsService);
//# sourceMappingURL=medical-records.service.js.map
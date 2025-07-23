import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { MedicalRecord, MedicalRecordStatus } from './entities/medical-record.entity';
import { Triage } from './entities/triage.entity';
import { MedicalHistoryBase } from './entities/medical-history-base.entity';
import { SpecialtyMedicalHistory } from './entities/specialty-medical-history.entity';
import { Patient } from '../patients/entities/patient.entity';
import { Professional } from '../professionals/entities/professional.entity';
import { Specialty } from '../specialties/entities/specialty.entity';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { UpdateMedicalRecordDto } from './dto/update-medical-record.dto';
import { MedicalRecordResponseDto } from './dto/medical-record-response.dto';
import { CreateMedicalHistoryBaseDto } from './dto/create-medical-history-base.dto';
import { UpdateMedicalHistoryBaseDto } from './dto/update-medical-history-base.dto';
import { CreateSpecialtyMedicalHistoryDto } from './dto/create-specialty-medical-history.dto';
import { UpdateSpecialtyMedicalHistoryDto } from './dto/update-specialty-medical-history.dto';
import { MedicalHistoryBaseResponseDto, SpecialtyMedicalHistoryResponseDto } from './dto/medical-history-response.dto';

@Injectable()
export class MedicalRecordsService {
  private readonly logger = new Logger(MedicalRecordsService.name);

  constructor(
    @InjectRepository(MedicalRecord)
    private readonly medicalRecordRepository: Repository<MedicalRecord>,
    @InjectRepository(Triage)
    private readonly triageRepository: Repository<Triage>,
    @InjectRepository(MedicalHistoryBase)
    private readonly medicalHistoryBaseRepository: Repository<MedicalHistoryBase>,
    @InjectRepository(SpecialtyMedicalHistory)
    private readonly specialtyMedicalHistoryRepository: Repository<SpecialtyMedicalHistory>,
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    @InjectRepository(Professional)
    private readonly professionalRepository: Repository<Professional>,
    @InjectRepository(Specialty)
    private readonly specialtyRepository: Repository<Specialty>,
  ) {}

  async create(createMedicalRecordDto: CreateMedicalRecordDto): Promise<MedicalRecordResponseDto> {
    this.logger.log(`=== CREANDO NUEVA HISTORIA CLÍNICA ===`);
    this.logger.log(`Paciente ID: ${createMedicalRecordDto.patientId}`);
    this.logger.log(`Profesional ID: ${createMedicalRecordDto.professionalId}`);
    this.logger.log(`Especialidad ID: ${createMedicalRecordDto.specialtyId}`);

    try {
      // Verificar que el paciente existe y está activo
      const patient = await this.patientRepository.findOne({
        where: { id: createMedicalRecordDto.patientId, isActive: true },
      });

      if (!patient) {
        throw new NotFoundException('Paciente no encontrado o inactivo');
      }

      // Verificar que el profesional existe y está activo
      const professional = await this.professionalRepository.findOne({
        where: { id: createMedicalRecordDto.professionalId, isActive: true },
        relations: ['specialties'],
      });

      if (!professional) {
        throw new NotFoundException('Profesional no encontrado o inactivo');
      }

      // Verificar que la especialidad existe y está activa
      const specialty = await this.specialtyRepository.findOne({
        where: { id: createMedicalRecordDto.specialtyId, isActive: true },
      });

      if (!specialty) {
        throw new NotFoundException('Especialidad no encontrada o inactiva');
      }

      // Verificar que el profesional tiene la especialidad seleccionada
      const hasSpecialty = professional.specialties.some(
        spec => spec.id === createMedicalRecordDto.specialtyId
      );

      if (!hasSpecialty) {
        throw new BadRequestException(
          `El profesional ${professional.getFullName()} no tiene la especialidad ${specialty.name}`
        );
      }

      // Generar número de historia clínica único
      const recordNumber = await this.generateRecordNumber();

      // Crear el triaje si se proporcionó
      let triage: Triage | null = null;
      if (createMedicalRecordDto.triage && this.hasTriageData(createMedicalRecordDto.triage)) {
        triage = this.triageRepository.create(createMedicalRecordDto.triage);
        await this.triageRepository.save(triage);
        this.logger.log(`Triaje creado con ID: ${triage.id}`);
      }

      // Debug: Verificar valores de tiempo recibidos
      this.logger.log('🕐 Valores de tiempo recibidos:');
      this.logger.log(`appointmentTimeFrom: "${createMedicalRecordDto.appointmentTimeFrom}"`);
      this.logger.log(`appointmentTimeTo: "${createMedicalRecordDto.appointmentTimeTo}"`);
      
      const timeFromProcessed = createMedicalRecordDto.appointmentTimeFrom && createMedicalRecordDto.appointmentTimeFrom.trim() !== '' ? 
        createMedicalRecordDto.appointmentTimeFrom : undefined;
      const timeToProcessed = createMedicalRecordDto.appointmentTimeTo && createMedicalRecordDto.appointmentTimeTo.trim() !== '' ? 
        createMedicalRecordDto.appointmentTimeTo : undefined;
        
      this.logger.log(`Procesados - timeFrom: ${timeFromProcessed}, timeTo: ${timeToProcessed}`);

      // Crear la historia clínica
      const medicalRecordData = {
        recordNumber,
        appointmentDate: createMedicalRecordDto.appointmentDate ? 
          new Date(createMedicalRecordDto.appointmentDate) : undefined,
        appointmentTimeFrom: timeFromProcessed,
        appointmentTimeTo: timeToProcessed,
        status: createMedicalRecordDto.status || MedicalRecordStatus.PENDING,
        chiefComplaint: createMedicalRecordDto.chiefComplaint,
        currentIllness: createMedicalRecordDto.currentIllness,
        physicalExamination: createMedicalRecordDto.physicalExamination,
        diagnosis: createMedicalRecordDto.diagnosis,
        treatment: createMedicalRecordDto.treatment,
        observations: createMedicalRecordDto.observations,
      };
      
      const medicalRecord = this.medicalRecordRepository.create(medicalRecordData);

      // Asignar las relaciones
      medicalRecord.patient = patient;
      medicalRecord.professional = professional;
      medicalRecord.specialty = specialty;
      if (triage) {
        medicalRecord.triage = triage;
      }

      const savedMedicalRecord = await this.medicalRecordRepository.save(medicalRecord) as MedicalRecord;

      this.logger.log(`✅ Historia clínica creada exitosamente: ${recordNumber}`);
      this.logger.log(`Paciente: ${patient.getFullName()}`);
      this.logger.log(`Profesional: ${professional.getFullName()}`);
      this.logger.log(`Especialidad: ${specialty.name}`);

      return new MedicalRecordResponseDto(savedMedicalRecord);
    } catch (error) {
      this.logger.error(`❌ Error al crear historia clínica: ${error.message}`);
      throw error;
    }
  }

  async findAll(includeInactive = false): Promise<MedicalRecordResponseDto[]> {
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
      return medicalRecords.map(record => new MedicalRecordResponseDto(record));
    } catch (error) {
      this.logger.error(`❌ Error al listar historias clínicas: ${error.message}`);
      throw error;
    }
  }

  async findOne(id: string): Promise<MedicalRecordResponseDto> {
    this.logger.log(`=== BUSCANDO HISTORIA CLÍNICA POR ID ===`);
    this.logger.log(`ID: ${id}`);

    try {
      const medicalRecord = await this.medicalRecordRepository.findOne({
        where: { id },
        relations: ['patient', 'professional', 'specialty', 'triage'],
      });

      if (!medicalRecord) {
        this.logger.warn(`Historia clínica con ID '${id}' no encontrada`);
        throw new NotFoundException('Historia clínica no encontrada');
      }

      this.logger.log(`✅ Historia clínica encontrada: ${medicalRecord.recordNumber}`);
      return new MedicalRecordResponseDto(medicalRecord);
    } catch (error) {
      this.logger.error(`❌ Error al buscar historia clínica: ${error.message}`);
      throw error;
    }
  }

  async findByRecordNumber(recordNumber: string): Promise<MedicalRecordResponseDto> {
    this.logger.log(`=== BUSCANDO HISTORIA CLÍNICA POR NÚMERO ===`);
    this.logger.log(`Número: ${recordNumber}`);

    try {
      const medicalRecord = await this.medicalRecordRepository.findOne({
        where: { recordNumber, isActive: true },
        relations: ['patient', 'professional', 'specialty', 'triage'],
      });

      if (!medicalRecord) {
        this.logger.warn(`Historia clínica con número '${recordNumber}' no encontrada`);
        throw new NotFoundException('Historia clínica no encontrada');
      }

      this.logger.log(`✅ Historia clínica encontrada: ${medicalRecord.getSummary()}`);
      return new MedicalRecordResponseDto(medicalRecord);
    } catch (error) {
      this.logger.error(`❌ Error al buscar historia clínica por número: ${error.message}`);
      throw error;
    }
  }

  async findByPatientDni(dni: string): Promise<MedicalRecordResponseDto[]> {
    this.logger.log(`=== BUSCANDO HISTORIAS CLÍNICAS POR DNI DE PACIENTE ===`);
    this.logger.log(`DNI: ${dni}`);

    try {
      // Buscar el paciente por DNI
      const patient = await this.patientRepository.findOne({
        where: { 
          identificationType: 'DNI' as any,
          identificationNumber: dni,
          isActive: true 
        },
      });

      if (!patient) {
        throw new NotFoundException(`Paciente con DNI ${dni} no encontrado`);
      }

      // Buscar todas las historias clínicas del paciente
      const medicalRecords = await this.medicalRecordRepository.find({
        where: { 
          patient: { id: patient.id },
          isActive: true 
        },
        relations: ['patient', 'professional', 'specialty', 'triage'],
        order: { createdAt: 'DESC' },
      });

      this.logger.log(`✅ Encontradas ${medicalRecords.length} historias clínicas para el paciente ${patient.getFullName()}`);
      return medicalRecords.map(record => new MedicalRecordResponseDto(record));
    } catch (error) {
      this.logger.error(`❌ Error al buscar historias clínicas por DNI: ${error.message}`);
      throw error;
    }
  }

  async findBySpecialty(specialtyId: string): Promise<MedicalRecordResponseDto[]> {
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
      return medicalRecords.map(record => new MedicalRecordResponseDto(record));
    } catch (error) {
      this.logger.error(`❌ Error al buscar historias clínicas por especialidad: ${error.message}`);
      throw error;
    }
  }

  async findByProfessional(professionalId: string): Promise<MedicalRecordResponseDto[]> {
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
      return medicalRecords.map(record => new MedicalRecordResponseDto(record));
    } catch (error) {
      this.logger.error(`❌ Error al buscar historias clínicas por profesional: ${error.message}`);
      throw error;
    }
  }

  async update(id: string, updateMedicalRecordDto: UpdateMedicalRecordDto): Promise<MedicalRecordResponseDto> {
    this.logger.log(`=== ACTUALIZANDO HISTORIA CLÍNICA ===`);
    this.logger.log(`ID: ${id}`);

    try {
      const medicalRecord = await this.medicalRecordRepository.findOne({
        where: { id },
        relations: ['patient', 'professional', 'specialty', 'triage'],
      });

      if (!medicalRecord) {
        throw new NotFoundException('Historia clínica no encontrada');
      }

      // Actualizar triaje si se proporcionó
      if (updateMedicalRecordDto.triage) {
        if (medicalRecord.triage) {
          // Actualizar triaje existente
          Object.assign(medicalRecord.triage, updateMedicalRecordDto.triage);
          await this.triageRepository.save(medicalRecord.triage);
        } else if (this.hasTriageData(updateMedicalRecordDto.triage)) {
          // Crear nuevo triaje
          const triage = this.triageRepository.create(updateMedicalRecordDto.triage);
          await this.triageRepository.save(triage);
          medicalRecord.triage = triage;
        }
      }

      // Actualizar otros campos
      const { triage, ...updateData } = updateMedicalRecordDto;
      if (updateData.appointmentDate) {
        updateData.appointmentDate = new Date(updateData.appointmentDate) as any;
      }

      Object.assign(medicalRecord, updateData);
      const updatedMedicalRecord = await this.medicalRecordRepository.save(medicalRecord);

      this.logger.log(`✅ Historia clínica actualizada exitosamente: ${medicalRecord.recordNumber}`);
      return new MedicalRecordResponseDto(updatedMedicalRecord);
    } catch (error) {
      this.logger.error(`❌ Error al actualizar historia clínica: ${error.message}`);
      throw error;
    }
  }

  async deactivate(id: string): Promise<MedicalRecordResponseDto> {
    this.logger.log(`=== DESACTIVANDO HISTORIA CLÍNICA ===`);
    this.logger.log(`ID: ${id}`);

    try {
      const medicalRecord = await this.medicalRecordRepository.findOne({
        where: { id },
        relations: ['patient', 'professional', 'specialty', 'triage'],
      });

      if (!medicalRecord) {
        throw new NotFoundException('Historia clínica no encontrada');
      }

      if (!medicalRecord.isActive) {
        throw new BadRequestException('La historia clínica ya está desactivada');
      }

      await this.medicalRecordRepository.update(id, { isActive: false });
      const deactivatedRecord = await this.medicalRecordRepository.findOne({
        where: { id },
        relations: ['patient', 'professional', 'specialty', 'triage'],
      });

      this.logger.log(`✅ Historia clínica desactivada exitosamente: ${medicalRecord.recordNumber}`);
      return new MedicalRecordResponseDto(deactivatedRecord!);
    } catch (error) {
      this.logger.error(`❌ Error al desactivar historia clínica: ${error.message}`);
      throw error;
    }
  }

  // Método privado para generar número de historia clínica único
  private async generateRecordNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `HC${year}`;
    
    // Buscar el último número de historia del año
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

  // Método privado para verificar si el triaje tiene datos
  private hasTriageData(triageDto: any): boolean {
    return !!(
      triageDto.weight || 
      triageDto.height || 
      triageDto.bloodPressure || 
      triageDto.oxygenSaturation ||
      triageDto.heartRate ||
      triageDto.temperature ||
      triageDto.observations
    );
  }

  // Actualizar datos de triaje de una historia clínica
  async updateTriage(id: string, triageData: any): Promise<MedicalRecordResponseDto> {
    try {
      this.logger.log(`🩺 Actualizando triaje para historia clínica: ${id}`);
      this.logger.log('Datos de triaje recibidos:', triageData);
      
      // Buscar la historia clínica
      const medicalRecord = await this.medicalRecordRepository.findOne({
        where: { id, isActive: true },
        relations: ['patient', 'professional', 'specialty', 'triage']
      });
      
      if (!medicalRecord) {
        throw new NotFoundException(`Historia clínica con ID ${id} no encontrada`);
      }
      
      let triage: Triage;
      
      if (medicalRecord.triage) {
        // Actualizar triaje existente
        this.logger.log('Actualizando triaje existente:', medicalRecord.triage.id);
        Object.assign(medicalRecord.triage, triageData);
        const savedTriage = await this.triageRepository.save(medicalRecord.triage);
        triage = Array.isArray(savedTriage) ? savedTriage[0] : savedTriage;
      } else {
        // Crear nuevo triaje
        this.logger.log('Creando nuevo triaje');
        const newTriage = this.triageRepository.create(triageData);
        const savedTriage = await this.triageRepository.save(newTriage);
        triage = Array.isArray(savedTriage) ? savedTriage[0] : savedTriage;
        
        // Asociar el triaje a la historia clínica
        medicalRecord.triage = triage;
        await this.medicalRecordRepository.save(medicalRecord);
      }
      
      // Obtener la historia clínica actualizada con todas las relaciones
      const updatedRecord = await this.medicalRecordRepository.findOne({
        where: { id },
        relations: ['patient', 'professional', 'specialty', 'triage']
      });
      
      if (!updatedRecord) {
        throw new NotFoundException(`No se pudo obtener la historia clínica actualizada`);
      }
      
      this.logger.log(`✅ Triaje actualizado exitosamente para historia clínica: ${medicalRecord.recordNumber}`);
      return new MedicalRecordResponseDto(updatedRecord);
      
    } catch (error) {
      this.logger.error(`❌ Error al actualizar triaje: ${error.message}`);
      throw error;
    }
  }

  // Obtener estadísticas de historias clínicas
  async getStats(): Promise<any> {
    try {
      this.logger.log('📊 Obteniendo estadísticas de historias clínicas');
      
      const [total, pending, inProgress, completed, withTriage, withoutTriage] = await Promise.all([
        // Total de historias clínicas activas
        this.medicalRecordRepository.count({ where: { isActive: true } }),
        
        // Historias pendientes
        this.medicalRecordRepository.count({ 
          where: { 
            status: MedicalRecordStatus.PENDING,
            isActive: true 
          } 
        }),
        
        // Historias en progreso
        this.medicalRecordRepository.count({ 
          where: { 
            status: MedicalRecordStatus.IN_PROGRESS,
            isActive: true 
          } 
        }),
        
        // Historias completadas
        this.medicalRecordRepository.count({ 
          where: { 
            status: MedicalRecordStatus.COMPLETED,
            isActive: true 
          } 
        }),
        
        // Historias con triaje
        this.medicalRecordRepository.createQueryBuilder('medicalRecord')
          .where('medicalRecord.isActive = :isActive', { isActive: true })
          .andWhere('medicalRecord.triage IS NOT NULL')
          .getCount(),
        
        // Historias sin triaje
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
      
    } catch (error) {
      this.logger.error('❌ Error al obtener estadísticas:', error.message);
      throw error;
    }
  }

  // === MÉTODOS PARA ANTECEDENTES (HISTORIAL BASE) ===

  async createMedicalHistoryBase(
    medicalRecordId: string,
    createMedicalHistoryBaseDto: CreateMedicalHistoryBaseDto,
  ): Promise<MedicalHistoryBaseResponseDto> {
    try {
      this.logger.log(`=== CREANDO ANTECEDENTES PARA HISTORIA CLÍNICA ${medicalRecordId} ===`);
      
      // Verificar que la historia clínica existe
      const medicalRecord = await this.medicalRecordRepository.findOne({
        where: { id: medicalRecordId, isActive: true },
        relations: ['medicalHistoryBase']
      });
      
      if (!medicalRecord) {
        throw new NotFoundException('Historia clínica no encontrada');
      }
      
      // Verificar si ya tiene antecedentes
      if (medicalRecord.medicalHistoryBase) {
        throw new ConflictException('Esta historia clínica ya tiene antecedentes registrados');
      }
      
      // Crear los antecedentes
      const medicalHistoryBase = this.medicalHistoryBaseRepository.create({
        ...createMedicalHistoryBaseDto,
        medicalRecord,
      });
      
      const savedMedicalHistoryBase = await this.medicalHistoryBaseRepository.save(medicalHistoryBase);
      
      this.logger.log(`✅ Antecedentes creados exitosamente: ${savedMedicalHistoryBase.id}`);
      return new MedicalHistoryBaseResponseDto(savedMedicalHistoryBase);
      
    } catch (error) {
      this.logger.error(`❌ Error al crear antecedentes: ${error.message}`);
      throw error;
    }
  }

  async getMedicalHistoryBase(medicalRecordId: string): Promise<MedicalHistoryBaseResponseDto> {
    try {
      this.logger.log(`=== OBTENIENDO ANTECEDENTES DE HISTORIA CLÍNICA ${medicalRecordId} ===`);
      
      const medicalRecord = await this.medicalRecordRepository.findOne({
        where: { id: medicalRecordId, isActive: true },
        relations: ['medicalHistoryBase']
      });
      
      if (!medicalRecord) {
        throw new NotFoundException('Historia clínica no encontrada');
      }
      
      if (!medicalRecord.medicalHistoryBase) {
        throw new NotFoundException('No se encontraron antecedentes para esta historia clínica');
      }
      
      return new MedicalHistoryBaseResponseDto(medicalRecord.medicalHistoryBase);
      
    } catch (error) {
      this.logger.error(`❌ Error al obtener antecedentes: ${error.message}`);
      throw error;
    }
  }

  async updateMedicalHistoryBase(
    medicalRecordId: string,
    updateMedicalHistoryBaseDto: UpdateMedicalHistoryBaseDto,
  ): Promise<MedicalHistoryBaseResponseDto> {
    try {
      this.logger.log(`=== ACTUALIZANDO ANTECEDENTES DE HISTORIA CLÍNICA ${medicalRecordId} ===`);
      
      const medicalRecord = await this.medicalRecordRepository.findOne({
        where: { id: medicalRecordId, isActive: true },
        relations: ['medicalHistoryBase']
      });
      
      if (!medicalRecord) {
        throw new NotFoundException('Historia clínica no encontrada');
      }
      
      if (!medicalRecord.medicalHistoryBase) {
        throw new NotFoundException('No se encontraron antecedentes para actualizar');
      }
      
      // Actualizar los antecedentes
      await this.medicalHistoryBaseRepository.update(
        medicalRecord.medicalHistoryBase.id,
        updateMedicalHistoryBaseDto,
      );
      
      const updatedMedicalHistoryBase = await this.medicalHistoryBaseRepository.findOne({
        where: { id: medicalRecord.medicalHistoryBase.id }
      });
      
      if (!updatedMedicalHistoryBase) {
        throw new NotFoundException('No se pudo obtener los antecedentes actualizados');
      }
      
      this.logger.log(`✅ Antecedentes actualizados exitosamente: ${updatedMedicalHistoryBase.id}`);
      return new MedicalHistoryBaseResponseDto(updatedMedicalHistoryBase);
      
    } catch (error) {
      this.logger.error(`❌ Error al actualizar antecedentes: ${error.message}`);
      throw error;
    }
  }

  // === MÉTODOS PARA HISTORIA CLÍNICA POR ESPECIALIDAD ===

  async createSpecialtyMedicalHistory(
    medicalRecordId: string,
    createSpecialtyMedicalHistoryDto: CreateSpecialtyMedicalHistoryDto,
  ): Promise<SpecialtyMedicalHistoryResponseDto> {
    try {
      this.logger.log(`=== CREANDO HISTORIA CLÍNICA POR ESPECIALIDAD PARA ${medicalRecordId} ===`);
      
      // Verificar que la historia clínica existe
      const medicalRecord = await this.medicalRecordRepository.findOne({
        where: { id: medicalRecordId, isActive: true },
        relations: ['specialtyMedicalHistory']
      });
      
      if (!medicalRecord) {
        throw new NotFoundException('Historia clínica no encontrada');
      }
      
      // Verificar si ya tiene historia clínica por especialidad
      if (medicalRecord.specialtyMedicalHistory) {
        throw new ConflictException('Esta historia clínica ya tiene historia por especialidad registrada');
      }
      
      // Crear la historia clínica por especialidad
      const specialtyMedicalHistory = this.specialtyMedicalHistoryRepository.create({
        ...createSpecialtyMedicalHistoryDto,
        medicalRecord,
      });
      
      const savedSpecialtyMedicalHistory = await this.specialtyMedicalHistoryRepository.save(specialtyMedicalHistory);
      
      this.logger.log(`✅ Historia clínica por especialidad creada exitosamente: ${savedSpecialtyMedicalHistory.id}`);
      return new SpecialtyMedicalHistoryResponseDto(savedSpecialtyMedicalHistory);
      
    } catch (error) {
      this.logger.error(`❌ Error al crear historia clínica por especialidad: ${error.message}`);
      throw error;
    }
  }

  async getSpecialtyMedicalHistory(medicalRecordId: string): Promise<SpecialtyMedicalHistoryResponseDto> {
    try {
      this.logger.log(`=== OBTENIENDO HISTORIA CLÍNICA POR ESPECIALIDAD DE ${medicalRecordId} ===`);
      
      const medicalRecord = await this.medicalRecordRepository.findOne({
        where: { id: medicalRecordId, isActive: true },
        relations: ['specialtyMedicalHistory']
      });
      
      if (!medicalRecord) {
        throw new NotFoundException('Historia clínica no encontrada');
      }
      
      if (!medicalRecord.specialtyMedicalHistory) {
        throw new NotFoundException('No se encontró historia clínica por especialidad');
      }
      
      return new SpecialtyMedicalHistoryResponseDto(medicalRecord.specialtyMedicalHistory);
      
    } catch (error) {
      this.logger.error(`❌ Error al obtener historia clínica por especialidad: ${error.message}`);
      throw error;
    }
  }

  async updateSpecialtyMedicalHistory(
    medicalRecordId: string,
    updateSpecialtyMedicalHistoryDto: UpdateSpecialtyMedicalHistoryDto,
  ): Promise<SpecialtyMedicalHistoryResponseDto> {
    try {
      this.logger.log(`=== ACTUALIZANDO HISTORIA CLÍNICA POR ESPECIALIDAD DE ${medicalRecordId} ===`);
      
      const medicalRecord = await this.medicalRecordRepository.findOne({
        where: { id: medicalRecordId, isActive: true },
        relations: ['specialtyMedicalHistory']
      });
      
      if (!medicalRecord) {
        throw new NotFoundException('Historia clínica no encontrada');
      }
      
      if (!medicalRecord.specialtyMedicalHistory) {
        throw new NotFoundException('No se encontró historia clínica por especialidad para actualizar');
      }
      
      // Actualizar la historia clínica por especialidad
      await this.specialtyMedicalHistoryRepository.update(
        medicalRecord.specialtyMedicalHistory.id,
        updateSpecialtyMedicalHistoryDto,
      );
      
      const updatedSpecialtyMedicalHistory = await this.specialtyMedicalHistoryRepository.findOne({
        where: { id: medicalRecord.specialtyMedicalHistory.id }
      });
      
      if (!updatedSpecialtyMedicalHistory) {
        throw new NotFoundException('No se pudo obtener la historia clínica por especialidad actualizada');
      }
      
      this.logger.log(`✅ Historia clínica por especialidad actualizada exitosamente: ${updatedSpecialtyMedicalHistory.id}`);
      return new SpecialtyMedicalHistoryResponseDto(updatedSpecialtyMedicalHistory);
      
    } catch (error) {
      this.logger.error(`❌ Error al actualizar historia clínica por especialidad: ${error.message}`);
      throw error;
    }
  }

  // === MÉTODO PARA VERIFICAR COMPLETITUD ===

  async getCompletionStatus(medicalRecordId: string): Promise<{
    hasTriage: boolean;
    hasMedicalHistoryBase: boolean;
    hasSpecialtyHistory: boolean;
    canFinalize: boolean;
    missingSteps: string[];
  }> {
    try {
      this.logger.log(`=== VERIFICANDO COMPLETITUD DE HISTORIA CLÍNICA ${medicalRecordId} ===`);
      
      const medicalRecord = await this.medicalRecordRepository.findOne({
        where: { id: medicalRecordId, isActive: true },
        relations: ['triage', 'medicalHistoryBase', 'specialtyMedicalHistory']
      });
      
      if (!medicalRecord) {
        throw new NotFoundException('Historia clínica no encontrada');
      }
      
      const hasTriage = !!medicalRecord.triage;
      const hasMedicalHistoryBase = !!medicalRecord.medicalHistoryBase;
      const hasSpecialtyHistory = !!medicalRecord.specialtyMedicalHistory;
      
      const missingSteps: string[] = [];
      if (!hasTriage) missingSteps.push('triaje');
      if (!hasMedicalHistoryBase) missingSteps.push('antecedentes');
      if (!hasSpecialtyHistory) missingSteps.push('historia por especialidad');
      
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
      
    } catch (error) {
      this.logger.error(`❌ Error al verificar completitud: ${error.message}`);
      throw error;
    }
  }

  // === MÉTODO PARA FINALIZAR HISTORIA CLÍNICA ===

  async finalizeRecord(medicalRecordId: string): Promise<MedicalRecordResponseDto> {
    try {
      this.logger.log(`=== FINALIZANDO HISTORIA CLÍNICA ${medicalRecordId} ===`);
      
      // Verificar completitud
      const completionStatus = await this.getCompletionStatus(medicalRecordId);
      
      if (!completionStatus.canFinalize) {
        throw new BadRequestException(
          `No se puede finalizar la historia clínica. Faltan: ${completionStatus.missingSteps.join(', ')}`
        );
      }
      
      // Actualizar el estado a completado
      await this.medicalRecordRepository.update(medicalRecordId, {
        status: MedicalRecordStatus.COMPLETED,
      });
      
      const finalizedRecord = await this.medicalRecordRepository.findOne({
        where: { id: medicalRecordId },
        relations: ['patient', 'professional', 'specialty', 'triage']
      });
      
      if (!finalizedRecord) {
        throw new NotFoundException('No se pudo obtener la historia clínica finalizada');
      }
      
      this.logger.log(`✅ Historia clínica finalizada exitosamente: ${finalizedRecord.recordNumber}`);
      return new MedicalRecordResponseDto(finalizedRecord);
      
    } catch (error) {
      this.logger.error(`❌ Error al finalizar historia clínica: ${error.message}`);
      throw error;
    }
  }
}

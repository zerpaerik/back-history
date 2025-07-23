import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { MedicalRecordsService } from './medical-records.service';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { UpdateMedicalRecordDto } from './dto/update-medical-record.dto';
import { MedicalRecordResponseDto } from './dto/medical-record-response.dto';
import { CreateMedicalHistoryBaseDto } from './dto/create-medical-history-base.dto';
import { UpdateMedicalHistoryBaseDto } from './dto/update-medical-history-base.dto';
import { CreateSpecialtyMedicalHistoryDto } from './dto/create-specialty-medical-history.dto';
import { UpdateSpecialtyMedicalHistoryDto } from './dto/update-specialty-medical-history.dto';
import { MedicalHistoryBaseResponseDto, SpecialtyMedicalHistoryResponseDto } from './dto/medical-history-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../users/entities/user.entity';
import { User } from '../users/entities/user.entity';

@Controller('medical-records')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MedicalRecordsController {
  private readonly logger = new Logger(MedicalRecordsController.name);

  constructor(private readonly medicalRecordsService: MedicalRecordsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.RECEPTIONIST)
  async create(
    @Body() createMedicalRecordDto: CreateMedicalRecordDto,
    @CurrentUser() user: User,
  ): Promise<MedicalRecordResponseDto> {
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

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.RECEPTIONIST)
  async findAll(
    @CurrentUser() user: User,
    @Query('includeInactive') includeInactive?: string,
  ): Promise<MedicalRecordResponseDto[]> {
    this.logger.log(`=== SOLICITUD DE LISTADO DE HISTORIAS CLÍNICAS ===`);
    this.logger.log(`Usuario: ${user.email} (${user.role})`);
    this.logger.log(`Incluir inactivas: ${includeInactive === 'true'}`);

    const result = await this.medicalRecordsService.findAll(includeInactive === 'true');
    
    this.logger.log(`✅ Listado de historias clínicas devuelto a ${user.email}: ${result.length} historias`);
    return result;
  }

  @Get('by-patient-dni/:dni')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.RECEPTIONIST)
  async findByPatientDni(
    @Param('dni') dni: string,
    @CurrentUser() user: User,
  ): Promise<MedicalRecordResponseDto[]> {
    this.logger.log(`=== SOLICITUD DE BÚSQUEDA POR DNI DE PACIENTE ===`);
    this.logger.log(`Usuario: ${user.email} (${user.role})`);
    this.logger.log(`DNI: ${dni}`);

    const result = await this.medicalRecordsService.findByPatientDni(dni);
    
    this.logger.log(`✅ Historias clínicas por DNI encontradas para ${user.email}: ${result.length} historias`);
    return result;
  }

  @Get('by-record-number/:recordNumber')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.RECEPTIONIST)
  async findByRecordNumber(
    @Param('recordNumber') recordNumber: string,
    @CurrentUser() user: User,
  ): Promise<MedicalRecordResponseDto> {
    this.logger.log(`=== SOLICITUD DE BÚSQUEDA POR NÚMERO DE HISTORIA ===`);
    this.logger.log(`Usuario: ${user.email} (${user.role})`);
    this.logger.log(`Número de historia: ${recordNumber}`);

    const result = await this.medicalRecordsService.findByRecordNumber(recordNumber);
    
    this.logger.log(`✅ Historia clínica encontrada por número para ${user.email}: ${result.summary}`);
    return result;
  }

  @Get('by-specialty/:specialtyId')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE)
  async findBySpecialty(
    @Param('specialtyId') specialtyId: string,
    @CurrentUser() user: User,
  ): Promise<MedicalRecordResponseDto[]> {
    this.logger.log(`=== SOLICITUD DE BÚSQUEDA POR ESPECIALIDAD ===`);
    this.logger.log(`Usuario: ${user.email} (${user.role})`);
    this.logger.log(`Especialidad ID: ${specialtyId}`);

    const result = await this.medicalRecordsService.findBySpecialty(specialtyId);
    
    this.logger.log(`✅ Historias clínicas por especialidad encontradas para ${user.email}: ${result.length} historias`);
    return result;
  }

  @Get('by-professional/:professionalId')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE)
  async findByProfessional(
    @Param('professionalId') professionalId: string,
    @CurrentUser() user: User,
  ): Promise<MedicalRecordResponseDto[]> {
    this.logger.log(`=== SOLICITUD DE BÚSQUEDA POR PROFESIONAL ===`);
    this.logger.log(`Usuario: ${user.email} (${user.role})`);
    this.logger.log(`Profesional ID: ${professionalId}`);

    const result = await this.medicalRecordsService.findByProfessional(professionalId);
    
    this.logger.log(`✅ Historias clínicas por profesional encontradas para ${user.email}: ${result.length} historias`);
    return result;
  }

  @Get('stats')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.RECEPTIONIST)
  async getStats(
    @CurrentUser() user: User,
  ): Promise<any> {
    this.logger.log(`=== SOLICITUD DE ESTADÍSTICAS ===`);
    this.logger.log(`Usuario: ${user.email} (${user.role})`);

    const stats = await this.medicalRecordsService.getStats();
    
    this.logger.log(`✅ Estadísticas obtenidas para ${user.email}`);
    return stats;
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.RECEPTIONIST)
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<MedicalRecordResponseDto> {
    this.logger.log(`=== SOLICITUD DE BÚSQUEDA POR ID ===`);
    this.logger.log(`Usuario: ${user.email} (${user.role})`);
    this.logger.log(`ID: ${id}`);

    const result = await this.medicalRecordsService.findOne(id);
    
    this.logger.log(`✅ Historia clínica encontrada para ${user.email}: ${result.summary}`);
    return result;
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE)
  async update(
    @Param('id') id: string,
    @Body() updateMedicalRecordDto: UpdateMedicalRecordDto,
    @CurrentUser() user: User,
  ): Promise<MedicalRecordResponseDto> {
    this.logger.log(`=== SOLICITUD DE ACTUALIZACIÓN DE HISTORIA CLÍNICA ===`);
    this.logger.log(`Usuario: ${user.email} (${user.role})`);
    this.logger.log(`ID: ${id}`);
    this.logger.log(`Datos a actualizar:`, updateMedicalRecordDto);

    const result = await this.medicalRecordsService.update(id, updateMedicalRecordDto);
    
    this.logger.log(`✅ Historia clínica actualizada exitosamente por ${user.email}: ${result.recordNumber}`);
    return result;
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  async deactivate(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<MedicalRecordResponseDto> {
    this.logger.log(`=== SOLICITUD DE DESACTIVACIÓN DE HISTORIA CLÍNICA ===`);
    this.logger.log(`Usuario: ${user.email} (${user.role})`);
    this.logger.log(`ID: ${id}`);

    const result = await this.medicalRecordsService.deactivate(id);
    
    this.logger.log(`✅ Historia clínica desactivada exitosamente por ${user.email}: ${result.recordNumber}`);
    return result;
  }

  @Patch(':id/triage')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE)
  async updateTriage(
    @Param('id') id: string,
    @Body() triageData: any,
    @CurrentUser() user: User,
  ): Promise<MedicalRecordResponseDto> {
    this.logger.log(`=== SOLICITUD DE ACTUALIZACIÓN DE TRIAJE ===`);
    this.logger.log(`Usuario: ${user.email} (${user.role})`);
    this.logger.log(`ID Historia Clínica: ${id}`);
    this.logger.log(`Datos de triaje:`, triageData);

    const result = await this.medicalRecordsService.updateTriage(id, triageData);
    
    this.logger.log(`✅ Triaje actualizado exitosamente por ${user.email}: ${result.recordNumber}`);
    return result;
  }

  // === ENDPOINTS PARA ANTECEDENTES (HISTORIAL BASE) ===

  @Post(':id/medical-history-base')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  async createMedicalHistoryBase(
    @Param('id') medicalRecordId: string,
    @Body() createMedicalHistoryBaseDto: CreateMedicalHistoryBaseDto,
    @CurrentUser() user: User,
  ): Promise<MedicalHistoryBaseResponseDto> {
    this.logger.log(`=== SOLICITUD DE CREACIÓN DE ANTECEDENTES ===`);
    this.logger.log(`Usuario: ${user.email} (${user.role})`);
    this.logger.log(`ID Historia Clínica: ${medicalRecordId}`);

    const result = await this.medicalRecordsService.createMedicalHistoryBase(medicalRecordId, createMedicalHistoryBaseDto);
    
    this.logger.log(`✅ Antecedentes creados exitosamente por ${user.email}`);
    return result;
  }

  @Get(':id/medical-history-base')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE)
  async getMedicalHistoryBase(
    @Param('id') medicalRecordId: string,
    @CurrentUser() user: User,
  ): Promise<MedicalHistoryBaseResponseDto> {
    this.logger.log(`=== SOLICITUD DE OBTENCIÓN DE ANTECEDENTES ===`);
    this.logger.log(`Usuario: ${user.email} (${user.role})`);
    this.logger.log(`ID Historia Clínica: ${medicalRecordId}`);

    return await this.medicalRecordsService.getMedicalHistoryBase(medicalRecordId);
  }

  @Patch(':id/medical-history-base')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  async updateMedicalHistoryBase(
    @Param('id') medicalRecordId: string,
    @Body() updateMedicalHistoryBaseDto: UpdateMedicalHistoryBaseDto,
    @CurrentUser() user: User,
  ): Promise<MedicalHistoryBaseResponseDto> {
    this.logger.log(`=== SOLICITUD DE ACTUALIZACIÓN DE ANTECEDENTES ===`);
    this.logger.log(`Usuario: ${user.email} (${user.role})`);
    this.logger.log(`ID Historia Clínica: ${medicalRecordId}`);

    const result = await this.medicalRecordsService.updateMedicalHistoryBase(medicalRecordId, updateMedicalHistoryBaseDto);
    
    this.logger.log(`✅ Antecedentes actualizados exitosamente por ${user.email}`);
    return result;
  }

  // === ENDPOINTS PARA HISTORIA CLÍNICA POR ESPECIALIDAD ===

  @Post(':id/specialty-history')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  async createSpecialtyMedicalHistory(
    @Param('id') medicalRecordId: string,
    @Body() createSpecialtyMedicalHistoryDto: CreateSpecialtyMedicalHistoryDto,
    @CurrentUser() user: User,
  ): Promise<SpecialtyMedicalHistoryResponseDto> {
    this.logger.log(`=== SOLICITUD DE CREACIÓN DE HISTORIA CLÍNICA POR ESPECIALIDAD ===`);
    this.logger.log(`Usuario: ${user.email} (${user.role})`);
    this.logger.log(`ID Historia Clínica: ${medicalRecordId}`);
    this.logger.log(`Tipo de Especialidad: ${createSpecialtyMedicalHistoryDto.specialtyType}`);

    const result = await this.medicalRecordsService.createSpecialtyMedicalHistory(medicalRecordId, createSpecialtyMedicalHistoryDto);
    
    this.logger.log(`✅ Historia clínica por especialidad creada exitosamente por ${user.email}`);
    return result;
  }

  @Get(':id/specialty-history')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE)
  async getSpecialtyMedicalHistory(
    @Param('id') medicalRecordId: string,
    @CurrentUser() user: User,
  ): Promise<SpecialtyMedicalHistoryResponseDto> {
    this.logger.log(`=== SOLICITUD DE OBTENCIÓN DE HISTORIA CLÍNICA POR ESPECIALIDAD ===`);
    this.logger.log(`Usuario: ${user.email} (${user.role})`);
    this.logger.log(`ID Historia Clínica: ${medicalRecordId}`);

    return await this.medicalRecordsService.getSpecialtyMedicalHistory(medicalRecordId);
  }

  @Patch(':id/specialty-history')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  async updateSpecialtyMedicalHistory(
    @Param('id') medicalRecordId: string,
    @Body() updateSpecialtyMedicalHistoryDto: UpdateSpecialtyMedicalHistoryDto,
    @CurrentUser() user: User,
  ): Promise<SpecialtyMedicalHistoryResponseDto> {
    this.logger.log(`=== SOLICITUD DE ACTUALIZACIÓN DE HISTORIA CLÍNICA POR ESPECIALIDAD ===`);
    this.logger.log(`Usuario: ${user.email} (${user.role})`);
    this.logger.log(`ID Historia Clínica: ${medicalRecordId}`);

    const result = await this.medicalRecordsService.updateSpecialtyMedicalHistory(medicalRecordId, updateSpecialtyMedicalHistoryDto);
    
    this.logger.log(`✅ Historia clínica por especialidad actualizada exitosamente por ${user.email}`);
    return result;
  }

  // === ENDPOINT PARA VERIFICAR COMPLETITUD DE HISTORIA CLÍNICA ===

  @Get(':id/completion-status')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE)
  async getCompletionStatus(
    @Param('id') medicalRecordId: string,
    @CurrentUser() user: User,
  ): Promise<{
    hasTriage: boolean;
    hasMedicalHistoryBase: boolean;
    hasSpecialtyHistory: boolean;
    canFinalize: boolean;
    missingSteps: string[];
  }> {
    this.logger.log(`=== SOLICITUD DE ESTADO DE COMPLETITUD ===`);
    this.logger.log(`Usuario: ${user.email} (${user.role})`);
    this.logger.log(`ID Historia Clínica: ${medicalRecordId}`);

    return await this.medicalRecordsService.getCompletionStatus(medicalRecordId);
  }

  // === ENDPOINT PARA FINALIZAR HISTORIA CLÍNICA ===

  @Patch(':id/finalize')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  async finalizeRecord(
    @Param('id') medicalRecordId: string,
    @CurrentUser() user: User,
  ): Promise<MedicalRecordResponseDto> {
    this.logger.log(`=== SOLICITUD DE FINALIZACIÓN DE HISTORIA CLÍNICA ===`);
    this.logger.log(`Usuario: ${user.email} (${user.role})`);
    this.logger.log(`ID Historia Clínica: ${medicalRecordId}`);

    const result = await this.medicalRecordsService.finalizeRecord(medicalRecordId);
    
    this.logger.log(`✅ Historia clínica finalizada exitosamente por ${user.email}: ${result.recordNumber}`);
    return result;
  }
}

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
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PatientResponseDto } from './dto/patient-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../users/entities/user.entity';
import { User } from '../users/entities/user.entity';

@Controller('patients')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PatientsController {
  private readonly logger = new Logger(PatientsController.name);

  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.RECEPTIONIST)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createPatientDto: CreatePatientDto,
    @CurrentUser() user: User,
  ): Promise<PatientResponseDto> {
    this.logger.log(`=== SOLICITUD DE CREACIÓN DE PACIENTE ===`);
    this.logger.log(`Usuario: ${user.email} (${user.role})`);
    this.logger.log(`Paciente: ${createPatientDto.firstName} ${createPatientDto.firstLastname}`);

    try {
      const patient = await this.patientsService.create(createPatientDto, user);
      this.logger.log(`Paciente creado exitosamente: ${patient.id}`);
      return patient;
    } catch (error) {
      this.logger.error(`Error al crear paciente: ${error.message}`);
      throw error;
    }
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.RECEPTIONIST)
  async findAll(
    @CurrentUser() user: User,
    @Query('includeInactive') includeInactive?: string,
  ): Promise<PatientResponseDto[]> {
    this.logger.log(`=== SOLICITUD DE LISTADO DE PACIENTES ===`);
    this.logger.log(`Usuario: ${user.email} (${user.role})`);
    this.logger.log(`Incluir inactivos: ${includeInactive === 'true'}`);

    const patients = await this.patientsService.findAll(user, includeInactive === 'true');
    this.logger.log(`Devolviendo ${patients.length} pacientes`);
    return patients;
  }

  @Get('search')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.RECEPTIONIST)
  async searchPatients(
    @Query('q') searchTerm: string,
    @CurrentUser() user: User,
  ): Promise<PatientResponseDto[]> {
    this.logger.log(`=== SOLICITUD DE BÚSQUEDA DE PACIENTES ===`);
    this.logger.log(`Usuario: ${user.email} (${user.role})`);
    this.logger.log(`Término de búsqueda: ${searchTerm}`);

    if (!searchTerm || searchTerm.trim().length < 2) {
      this.logger.warn('Término de búsqueda muy corto');
      return [];
    }

    const patients = await this.patientsService.searchPatients(searchTerm.trim(), user);
    this.logger.log(`Encontrados ${patients.length} pacientes`);
    return patients;
  }

  @Get('by-identification/:type/:number')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.RECEPTIONIST)
  async findByIdentification(
    @Param('type') identificationType: string,
    @Param('number') identificationNumber: string,
    @CurrentUser() user: User,
  ): Promise<PatientResponseDto> {
    this.logger.log(`=== SOLICITUD DE BÚSQUEDA POR IDENTIFICACIÓN ===`);
    this.logger.log(`Usuario: ${user.email} (${user.role})`);
    this.logger.log(`Identificación: ${identificationType} ${identificationNumber}`);

    const patient = await this.patientsService.findByIdentification(
      identificationType,
      identificationNumber,
      user,
    );
    this.logger.log(`Paciente encontrado: ${patient.fullName}`);
    return patient;
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.RECEPTIONIST)
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<PatientResponseDto> {
    this.logger.log(`=== SOLICITUD DE PACIENTE POR ID ===`);
    this.logger.log(`Usuario: ${user.email} (${user.role})`);
    this.logger.log(`ID: ${id}`);

    const patient = await this.patientsService.findById(id, user);
    this.logger.log(`Paciente encontrado: ${patient.fullName}`);
    return patient;
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.RECEPTIONIST)
  async update(
    @Param('id') id: string,
    @Body() updatePatientDto: UpdatePatientDto,
    @CurrentUser() user: User,
  ): Promise<PatientResponseDto> {
    this.logger.log(`=== SOLICITUD DE ACTUALIZACIÓN DE PACIENTE ===`);
    this.logger.log(`Usuario: ${user.email} (${user.role})`);
    this.logger.log(`ID del paciente: ${id}`);

    try {
      const patient = await this.patientsService.update(id, updatePatientDto, user);
      this.logger.log(`Paciente actualizado exitosamente: ${patient.fullName}`);
      return patient;
    } catch (error) {
      this.logger.error(`Error al actualizar paciente: ${error.message}`);
      throw error;
    }
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deactivate(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<void> {
    this.logger.log(`=== SOLICITUD DE DESACTIVACIÓN DE PACIENTE ===`);
    this.logger.log(`Usuario: ${user.email} (${user.role})`);
    this.logger.log(`ID del paciente: ${id}`);

    try {
      await this.patientsService.deactivate(id, user);
      this.logger.log(`Paciente desactivado exitosamente`);
    } catch (error) {
      this.logger.error(`Error al desactivar paciente: ${error.message}`);
      throw error;
    }
  }

  @Patch(':id/reactivate')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  async reactivate(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<PatientResponseDto> {
    this.logger.log(`=== SOLICITUD DE REACTIVACIÓN DE PACIENTE ===`);
    this.logger.log(`Usuario: ${user.email} (${user.role})`);
    this.logger.log(`ID del paciente: ${id}`);

    try {
      const patient = await this.patientsService.reactivate(id, user);
      this.logger.log(`Paciente reactivado exitosamente: ${patient.fullName}`);
      return patient;
    } catch (error) {
      this.logger.error(`Error al reactivar paciente: ${error.message}`);
      throw error;
    }
  }
}

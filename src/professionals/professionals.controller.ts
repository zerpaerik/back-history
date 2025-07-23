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
import { ProfessionalsService } from './professionals.service';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { UpdateProfessionalDto } from './dto/update-professional.dto';
import { ProfessionalResponseDto } from './dto/professional-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../users/entities/user.entity';
import { User } from '../users/entities/user.entity';

@Controller('professionals')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProfessionalsController {
  private readonly logger = new Logger(ProfessionalsController.name);

  constructor(private readonly professionalsService: ProfessionalsService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  async create(
    @Body() createProfessionalDto: CreateProfessionalDto,
    @CurrentUser() user: User,
  ): Promise<ProfessionalResponseDto> {
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

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.RECEPTIONIST)
  async findAll(
    @CurrentUser() user: User,
    @Query('includeInactive') includeInactive?: string,
  ): Promise<ProfessionalResponseDto[]> {
    this.logger.log(`=== SOLICITUD DE LISTADO DE PROFESIONALES ===`);
    this.logger.log(`Usuario: ${user.email} (${user.role})`);
    this.logger.log(`Incluir inactivos: ${includeInactive === 'true'}`);

    const result = await this.professionalsService.findAll(includeInactive === 'true');
    
    this.logger.log(`✅ Listado de profesionales devuelto a ${user.email}: ${result.length} profesionales`);
    return result;
  }

  @Get('search')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.RECEPTIONIST)
  async search(
    @Query('term') term: string,
    @CurrentUser() user: User,
  ): Promise<ProfessionalResponseDto[]> {
    this.logger.log(`=== SOLICITUD DE BÚSQUEDA DE PROFESIONALES ===`);
    this.logger.log(`Usuario: ${user.email} (${user.role})`);
    this.logger.log(`Término de búsqueda: ${term}`);

    const result = await this.professionalsService.search(term);
    
    this.logger.log(`✅ Búsqueda completada para ${user.email}: ${result.length} profesionales encontrados`);
    return result;
  }

  @Get('by-license/:licenseNumber')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.RECEPTIONIST)
  async findByLicense(
    @Param('licenseNumber') licenseNumber: string,
    @CurrentUser() user: User,
  ): Promise<ProfessionalResponseDto> {
    this.logger.log(`=== SOLICITUD DE BÚSQUEDA POR COLEGIATURA ===`);
    this.logger.log(`Usuario: ${user.email} (${user.role})`);
    this.logger.log(`Colegiatura: ${licenseNumber}`);

    const result = await this.professionalsService.findByLicense(licenseNumber);
    
    this.logger.log(`✅ Profesional encontrado por colegiatura para ${user.email}: ${result.fullName}`);
    return result;
  }

  @Get('by-identification/:type/:number')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.RECEPTIONIST)
  async findByIdentification(
    @Param('type') type: string,
    @Param('number') number: string,
    @CurrentUser() user: User,
  ): Promise<ProfessionalResponseDto> {
    this.logger.log(`=== SOLICITUD DE BÚSQUEDA POR IDENTIFICACIÓN ===`);
    this.logger.log(`Usuario: ${user.email} (${user.role})`);
    this.logger.log(`Identificación: ${type} - ${number}`);

    const result = await this.professionalsService.findByIdentification(type, number);
    
    this.logger.log(`✅ Profesional encontrado por identificación para ${user.email}: ${result.fullName}`);
    return result;
  }

  @Get('by-specialty/:specialtyId')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.RECEPTIONIST)
  async findBySpecialty(
    @Param('specialtyId') specialtyId: string,
    @CurrentUser() user: User,
  ): Promise<ProfessionalResponseDto[]> {
    this.logger.log(`=== SOLICITUD DE BÚSQUEDA POR ESPECIALIDAD ===`);
    this.logger.log(`Usuario: ${user.email} (${user.role})`);
    this.logger.log(`Especialidad ID: ${specialtyId}`);

    const result = await this.professionalsService.findBySpecialty(specialtyId);
    
    this.logger.log(`✅ Profesionales por especialidad encontrados para ${user.email}: ${result.length} profesionales`);
    return result;
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.RECEPTIONIST)
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<ProfessionalResponseDto> {
    this.logger.log(`=== SOLICITUD DE BÚSQUEDA POR ID ===`);
    this.logger.log(`Usuario: ${user.email} (${user.role})`);
    this.logger.log(`ID: ${id}`);

    const result = await this.professionalsService.findOne(id);
    
    this.logger.log(`✅ Profesional encontrado para ${user.email}: ${result.fullName}`);
    return result;
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateProfessionalDto: UpdateProfessionalDto,
    @CurrentUser() user: User,
  ): Promise<ProfessionalResponseDto> {
    this.logger.log(`=== SOLICITUD DE ACTUALIZACIÓN DE PROFESIONAL ===`);
    this.logger.log(`Usuario: ${user.email} (${user.role})`);
    this.logger.log(`ID: ${id}`);
    this.logger.log(`Datos a actualizar:`, updateProfessionalDto);

    const result = await this.professionalsService.update(id, updateProfessionalDto);
    
    this.logger.log(`✅ Profesional actualizado exitosamente por ${user.email}: ${result.fullName}`);
    return result;
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async deactivate(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<ProfessionalResponseDto> {
    this.logger.log(`=== SOLICITUD DE DESACTIVACIÓN DE PROFESIONAL ===`);
    this.logger.log(`Usuario: ${user.email} (${user.role})`);
    this.logger.log(`ID: ${id}`);

    const result = await this.professionalsService.deactivate(id);
    
    this.logger.log(`✅ Profesional desactivado exitosamente por ${user.email}: ${result.fullName}`);
    return result;
  }

  @Patch(':id/reactivate')
  @Roles(UserRole.ADMIN)
  async reactivate(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<ProfessionalResponseDto> {
    this.logger.log(`=== SOLICITUD DE REACTIVACIÓN DE PROFESIONAL ===`);
    this.logger.log(`Usuario: ${user.email} (${user.role})`);
    this.logger.log(`ID: ${id}`);

    const result = await this.professionalsService.reactivate(id);
    
    this.logger.log(`✅ Profesional reactivado exitosamente por ${user.email}: ${result.fullName}`);
    return result;
  }
}

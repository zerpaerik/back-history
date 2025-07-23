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
import { SpecialtiesService } from './specialties.service';
import { CreateSpecialtyDto } from './dto/create-specialty.dto';
import { UpdateSpecialtyDto } from './dto/update-specialty.dto';
import { SpecialtyResponseDto } from './dto/specialty-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../users/entities/user.entity';
import { User } from '../users/entities/user.entity';

@Controller('specialties')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SpecialtiesController {
  private readonly logger = new Logger(SpecialtiesController.name);

  constructor(private readonly specialtiesService: SpecialtiesService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  async create(
    @Body() createSpecialtyDto: CreateSpecialtyDto,
    @CurrentUser() user: User,
  ): Promise<SpecialtyResponseDto> {
    this.logger.log(`=== SOLICITUD DE CREACIÓN DE ESPECIALIDAD ===`);
    this.logger.log(`Usuario: ${user.email} (${user.role})`);
    this.logger.log(`Datos de especialidad:`, createSpecialtyDto);

    const result = await this.specialtiesService.create(createSpecialtyDto);
    
    this.logger.log(`✅ Especialidad creada exitosamente por ${user.email}`);
    return result;
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.RECEPTIONIST)
  async findAll(
    @CurrentUser() user: User,
    @Query('includeInactive') includeInactive?: string,
  ): Promise<SpecialtyResponseDto[]> {
    this.logger.log(`=== SOLICITUD DE LISTADO DE ESPECIALIDADES ===`);
    this.logger.log(`Usuario: ${user.email} (${user.role})`);
    this.logger.log(`Incluir inactivas: ${includeInactive === 'true'}`);

    const result = await this.specialtiesService.findAll(includeInactive === 'true');
    
    this.logger.log(`✅ Listado de especialidades devuelto a ${user.email}: ${result.length} especialidades`);
    return result;
  }

  @Get('search')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.RECEPTIONIST)
  async search(
    @Query('term') term: string,
    @CurrentUser() user: User,
  ): Promise<SpecialtyResponseDto[]> {
    this.logger.log(`=== SOLICITUD DE BÚSQUEDA DE ESPECIALIDADES ===`);
    this.logger.log(`Usuario: ${user.email} (${user.role})`);
    this.logger.log(`Término de búsqueda: ${term}`);

    const result = await this.specialtiesService.search(term);
    
    this.logger.log(`✅ Búsqueda completada para ${user.email}: ${result.length} especialidades encontradas`);
    return result;
  }

  @Get('by-code/:code')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.RECEPTIONIST)
  async findByCode(
    @Param('code') code: string,
    @CurrentUser() user: User,
  ): Promise<SpecialtyResponseDto> {
    this.logger.log(`=== SOLICITUD DE BÚSQUEDA POR CÓDIGO ===`);
    this.logger.log(`Usuario: ${user.email} (${user.role})`);
    this.logger.log(`Código: ${code}`);

    const result = await this.specialtiesService.findByCode(code);
    
    this.logger.log(`✅ Especialidad encontrada por código para ${user.email}: ${result.name}`);
    return result;
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.RECEPTIONIST)
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<SpecialtyResponseDto> {
    this.logger.log(`=== SOLICITUD DE BÚSQUEDA POR ID ===`);
    this.logger.log(`Usuario: ${user.email} (${user.role})`);
    this.logger.log(`ID: ${id}`);

    const result = await this.specialtiesService.findOne(id);
    
    this.logger.log(`✅ Especialidad encontrada para ${user.email}: ${result.name}`);
    return result;
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateSpecialtyDto: UpdateSpecialtyDto,
    @CurrentUser() user: User,
  ): Promise<SpecialtyResponseDto> {
    this.logger.log(`=== SOLICITUD DE ACTUALIZACIÓN DE ESPECIALIDAD ===`);
    this.logger.log(`Usuario: ${user.email} (${user.role})`);
    this.logger.log(`ID: ${id}`);
    this.logger.log(`Datos a actualizar:`, updateSpecialtyDto);

    const result = await this.specialtiesService.update(id, updateSpecialtyDto);
    
    this.logger.log(`✅ Especialidad actualizada exitosamente por ${user.email}`);
    return result;
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async deactivate(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<SpecialtyResponseDto> {
    this.logger.log(`=== SOLICITUD DE DESACTIVACIÓN DE ESPECIALIDAD ===`);
    this.logger.log(`Usuario: ${user.email} (${user.role})`);
    this.logger.log(`ID: ${id}`);

    const result = await this.specialtiesService.deactivate(id);
    
    this.logger.log(`✅ Especialidad desactivada exitosamente por ${user.email}`);
    return result;
  }

  @Patch(':id/reactivate')
  @Roles(UserRole.ADMIN)
  async reactivate(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<SpecialtyResponseDto> {
    this.logger.log(`=== SOLICITUD DE REACTIVACIÓN DE ESPECIALIDAD ===`);
    this.logger.log(`Usuario: ${user.email} (${user.role})`);
    this.logger.log(`ID: ${id}`);

    const result = await this.specialtiesService.reactivate(id);
    
    this.logger.log(`✅ Especialidad reactivada exitosamente por ${user.email}`);
    return result;
  }
}

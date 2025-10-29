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
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
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

  @Post('upload-signature')
  @Roles(UserRole.ADMIN)
  @UseInterceptors(
    FileInterceptor('signature', {
      storage: diskStorage({
        destination: './uploads/signatures',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `signature-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|svg\+xml)$/)) {
          return cb(new BadRequestException('Solo se permiten imágenes (jpg, jpeg, png, gif, svg)'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 2 * 1024 * 1024, // 2MB
      },
    }),
  )
  async uploadSignature(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: User,
  ) {
    this.logger.log(`=== SOLICITUD DE SUBIDA DE FIRMA ===`);
    this.logger.log(`Usuario: ${user.email} (${user.role})`);
    this.logger.log(`Archivo: ${file?.originalname}`);

    if (!file) {
      throw new BadRequestException('No se proporcionó archivo de firma');
    }

    // Construir URL de la firma
    const signatureUrl = `/uploads/signatures/${file.filename}`;
    
    this.logger.log(`✅ Firma subida exitosamente: ${signatureUrl}`);
    
    return {
      success: true,
      signatureUrl,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
    };
  }
}

import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { Professional } from './entities/professional.entity';
import { Specialty } from '../specialties/entities/specialty.entity';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { UpdateProfessionalDto } from './dto/update-professional.dto';
import { ProfessionalResponseDto } from './dto/professional-response.dto';
import { User } from '../users/entities/user.entity';
import { CompanyAccessHelper } from '../common/helpers/company-access.helper';

@Injectable()
export class ProfessionalsService {
  private readonly logger = new Logger(ProfessionalsService.name);

  constructor(
    @InjectRepository(Professional)
    private readonly professionalRepository: Repository<Professional>,
    @InjectRepository(Specialty)
    private readonly specialtyRepository: Repository<Specialty>,
  ) {}

  async create(createProfessionalDto: CreateProfessionalDto, user: User): Promise<ProfessionalResponseDto> {
    this.logger.log(`=== CREANDO NUEVO PROFESIONAL ===`);
    this.logger.log(`Nombre: ${createProfessionalDto.firstName} ${createProfessionalDto.firstLastname}`);
    this.logger.log(`Email: ${createProfessionalDto.email}`);
    this.logger.log(`Colegiatura: ${createProfessionalDto.licenseNumber}`);

    const companyId = CompanyAccessHelper.getCompanyIdForCreate(user);

    try {
      // Verificar si ya existe un profesional con la misma identificación en la misma empresa
      const existingByIdentification = await this.professionalRepository.findOne({
        where: {
          identificationType: createProfessionalDto.identificationType,
          identificationNumber: createProfessionalDto.identificationNumber,
          companyId,
        },
      });

      if (existingByIdentification) {
        this.logger.warn(`Profesional con identificación '${createProfessionalDto.identificationType}: ${createProfessionalDto.identificationNumber}' ya existe`);
        throw new ConflictException('Ya existe un profesional con esta identificación');
      }

      // Verificar si ya existe un profesional con el mismo número de colegiatura en la misma empresa
      const existingByLicense = await this.professionalRepository.findOne({
        where: { licenseNumber: createProfessionalDto.licenseNumber, companyId },
      });

      if (existingByLicense) {
        this.logger.warn(`Profesional con colegiatura '${createProfessionalDto.licenseNumber}' ya existe`);
        throw new ConflictException('Ya existe un profesional con este número de colegiatura');
      }

      // Verificar si ya existe un profesional con el mismo email en la misma empresa
      const existingByEmail = await this.professionalRepository.findOne({
        where: { email: createProfessionalDto.email, companyId },
      });

      if (existingByEmail) {
        this.logger.warn(`Profesional con email '${createProfessionalDto.email}' ya existe`);
        throw new ConflictException('Ya existe un profesional con este email');
      }

      // Crear el profesional
      const { specialtyIds, licenseExpiryDate, ...professionalData } = createProfessionalDto;
      const professional = this.professionalRepository.create({
        ...professionalData,
        licenseExpiryDate: licenseExpiryDate ? new Date(licenseExpiryDate) : undefined,
        companyId,
      });

      // Si se proporcionaron especialidades, cargarlas
      if (specialtyIds && specialtyIds.length > 0) {
        const specialties = await this.specialtyRepository.find({
          where: { id: In(specialtyIds), isActive: true },
        });

        if (specialties.length !== specialtyIds.length) {
          throw new BadRequestException('Una o más especialidades no existen o están inactivas');
        }

        professional.specialties = specialties;
        this.logger.log(`Asignadas ${specialties.length} especialidades al profesional`);
      }

      const savedProfessional = await this.professionalRepository.save(professional);

      this.logger.log(`✅ Profesional creado exitosamente con ID: ${savedProfessional.id}`);
      return new ProfessionalResponseDto(savedProfessional);
    } catch (error) {
      this.logger.error(`❌ Error al crear profesional: ${error.message}`);
      throw error;
    }
  }

  async findAll(user: User, includeInactive = false): Promise<ProfessionalResponseDto[]> {
    this.logger.log(`=== LISTANDO PROFESIONALES ===`);
    this.logger.log(`Incluir inactivos: ${includeInactive}`);

    try {
      const companyFilter = CompanyAccessHelper.getCompanyFilter(user);
      const whereCondition = includeInactive ? companyFilter : { ...companyFilter, isActive: true };
      const professionals = await this.professionalRepository.find({
        where: whereCondition,
        relations: ['specialties'],
        order: { firstLastname: 'ASC', firstName: 'ASC' },
      });

      this.logger.log(`✅ Encontrados ${professionals.length} profesionales`);
      return professionals.map(professional => new ProfessionalResponseDto(professional));
    } catch (error) {
      this.logger.error(`❌ Error al listar profesionales: ${error.message}`);
      throw error;
    }
  }

  async findOne(id: string, user: User): Promise<ProfessionalResponseDto> {
    this.logger.log(`=== BUSCANDO PROFESIONAL POR ID ===`);
    this.logger.log(`ID: ${id}`);

    try {
      const professional = await this.professionalRepository.findOne({
        where: { id },
        relations: ['specialties'],
      });

      if (!professional) {
        this.logger.warn(`Profesional con ID '${id}' no encontrado`);
        throw new NotFoundException('Profesional no encontrado');
      }

      // Validar acceso por empresa
      CompanyAccessHelper.validateAccess(user, professional.companyId);

      this.logger.log(`✅ Profesional encontrado: ${professional.getFullName()}`);
      return new ProfessionalResponseDto(professional);
    } catch (error) {
      this.logger.error(`❌ Error al buscar profesional: ${error.message}`);
      throw error;
    }
  }

  async findByLicense(licenseNumber: string, user: User): Promise<ProfessionalResponseDto> {
    this.logger.log(`=== BUSCANDO PROFESIONAL POR COLEGIATURA ===`);
    this.logger.log(`Colegiatura: ${licenseNumber}`);

    try {
      const companyFilter = CompanyAccessHelper.getCompanyFilter(user);
      const professional = await this.professionalRepository.findOne({
        where: { licenseNumber, ...companyFilter, isActive: true },
        relations: ['specialties'],
      });

      if (!professional) {
        this.logger.warn(`Profesional con colegiatura '${licenseNumber}' no encontrado`);
        throw new NotFoundException('Profesional no encontrado');
      }

      this.logger.log(`✅ Profesional encontrado: ${professional.getFullName()}`);
      return new ProfessionalResponseDto(professional);
    } catch (error) {
      this.logger.error(`❌ Error al buscar profesional por colegiatura: ${error.message}`);
      throw error;
    }
  }

  async findByIdentification(identificationType: string, identificationNumber: string, user: User): Promise<ProfessionalResponseDto> {
    this.logger.log(`=== BUSCANDO PROFESIONAL POR IDENTIFICACIÓN ===`);
    this.logger.log(`Tipo: ${identificationType}, Número: ${identificationNumber}`);

    try {
      const companyFilter = CompanyAccessHelper.getCompanyFilter(user);
      const professional = await this.professionalRepository.findOne({
        where: { 
          identificationType: identificationType as any,
          identificationNumber,
          ...companyFilter,
          isActive: true 
        },
        relations: ['specialties'],
      });

      if (!professional) {
        this.logger.warn(`Profesional con identificación '${identificationType}: ${identificationNumber}' no encontrado`);
        throw new NotFoundException('Profesional no encontrado');
      }

      this.logger.log(`✅ Profesional encontrado: ${professional.getFullName()}`);
      return new ProfessionalResponseDto(professional);
    } catch (error) {
      this.logger.error(`❌ Error al buscar profesional por identificación: ${error.message}`);
      throw error;
    }
  }

  async findBySpecialty(specialtyId: string, user: User): Promise<ProfessionalResponseDto[]> {
    this.logger.log(`=== BUSCANDO PROFESIONALES POR ESPECIALIDAD ===`);
    this.logger.log(`Especialidad ID: ${specialtyId}`);

    try {
      const companyFilter = CompanyAccessHelper.getCompanyFilter(user);
      
      // Verificar que la especialidad existe
      const specialty = await this.specialtyRepository.findOne({
        where: { id: specialtyId, ...companyFilter, isActive: true },
      });

      if (!specialty) {
        throw new NotFoundException('Especialidad no encontrada');
      }

      const queryBuilder = this.professionalRepository
        .createQueryBuilder('professional')
        .leftJoinAndSelect('professional.specialties', 'specialty')
        .where('professional.isActive = :isActive', { isActive: true })
        .andWhere('specialty.id = :specialtyId', { specialtyId });

      // Agregar filtro de empresa si no es ADMIN
      if (companyFilter.companyId) {
        queryBuilder.andWhere('professional.companyId = :companyId', { companyId: companyFilter.companyId });
      }

      const professionals = await queryBuilder
        .orderBy('professional.firstLastname', 'ASC')
        .addOrderBy('professional.firstName', 'ASC')
        .getMany();

      this.logger.log(`✅ Encontrados ${professionals.length} profesionales en la especialidad '${specialty.name}'`);
      return professionals.map(professional => new ProfessionalResponseDto(professional));
    } catch (error) {
      this.logger.error(`❌ Error al buscar profesionales por especialidad: ${error.message}`);
      throw error;
    }
  }

  async search(term: string, user: User): Promise<ProfessionalResponseDto[]> {
    this.logger.log(`=== BUSCANDO PROFESIONALES ===`);
    this.logger.log(`Término de búsqueda: ${term}`);

    if (!term || term.trim().length < 2) {
      throw new BadRequestException('El término de búsqueda debe tener al menos 2 caracteres');
    }

    try {
      const companyFilter = CompanyAccessHelper.getCompanyFilter(user);
      const searchTerm = `%${term.trim()}%`;
      const professionals = await this.professionalRepository.find({
        where: [
          { firstName: Like(searchTerm), ...companyFilter, isActive: true },
          { secondName: Like(searchTerm), ...companyFilter, isActive: true },
          { firstLastname: Like(searchTerm), ...companyFilter, isActive: true },
          { secondLastname: Like(searchTerm), ...companyFilter, isActive: true },
          { identificationNumber: Like(searchTerm), ...companyFilter, isActive: true },
          { licenseNumber: Like(searchTerm), ...companyFilter, isActive: true },
          { email: Like(searchTerm), ...companyFilter, isActive: true },
        ],
        relations: ['specialties'],
        order: { firstLastname: 'ASC', firstName: 'ASC' },
      });

      this.logger.log(`✅ Encontrados ${professionals.length} profesionales que coinciden con '${term}'`);
      return professionals.map(professional => new ProfessionalResponseDto(professional));
    } catch (error) {
      this.logger.error(`❌ Error al buscar profesionales: ${error.message}`);
      throw error;
    }
  }

  async update(id: string, updateProfessionalDto: UpdateProfessionalDto, user: User): Promise<ProfessionalResponseDto> {
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
        throw new NotFoundException('Profesional no encontrado');
      }

      // Validar acceso por empresa
      CompanyAccessHelper.validateAccess(user, professional.companyId);

      // Verificar conflictos si se está actualizando la identificación
      if (updateProfessionalDto.identificationType && updateProfessionalDto.identificationNumber) {
        if (updateProfessionalDto.identificationType !== professional.identificationType || 
            updateProfessionalDto.identificationNumber !== professional.identificationNumber) {
          const existingByIdentification = await this.professionalRepository.findOne({
            where: {
              identificationType: updateProfessionalDto.identificationType,
              identificationNumber: updateProfessionalDto.identificationNumber,
              companyId: professional.companyId,
            },
          });

          if (existingByIdentification && existingByIdentification.id !== id) {
            throw new ConflictException('Ya existe un profesional con esta identificación');
          }
        }
      }

      // Verificar conflictos si se está actualizando el número de colegiatura
      if (updateProfessionalDto.licenseNumber && updateProfessionalDto.licenseNumber !== professional.licenseNumber) {
        const existingByLicense = await this.professionalRepository.findOne({
          where: { licenseNumber: updateProfessionalDto.licenseNumber, companyId: professional.companyId },
        });

        if (existingByLicense && existingByLicense.id !== id) {
          throw new ConflictException('Ya existe un profesional con este número de colegiatura');
        }
      }

      // Verificar conflictos si se está actualizando el email
      if (updateProfessionalDto.email && updateProfessionalDto.email !== professional.email) {
        const existingByEmail = await this.professionalRepository.findOne({
          where: { email: updateProfessionalDto.email, companyId: professional.companyId },
        });

        if (existingByEmail && existingByEmail.id !== id) {
          throw new ConflictException('Ya existe un profesional con este email');
        }
      }

      // Manejar actualización de especialidades
      if (updateProfessionalDto.specialtyIds !== undefined) {
        if (updateProfessionalDto.specialtyIds.length > 0) {
          const specialties = await this.specialtyRepository.find({
            where: { id: In(updateProfessionalDto.specialtyIds), companyId: professional.companyId, isActive: true },
          });

          if (specialties.length !== updateProfessionalDto.specialtyIds.length) {
            throw new BadRequestException('Una o más especialidades no existen o están inactivas');
          }

          professional.specialties = specialties;
        } else {
          professional.specialties = [];
        }
      }

      // Actualizar otros campos
      const { specialtyIds, ...updateData } = updateProfessionalDto;
      if (updateData.licenseExpiryDate) {
        updateData.licenseExpiryDate = new Date(updateData.licenseExpiryDate) as any;
      }

      Object.assign(professional, updateData);
      const updatedProfessional = await this.professionalRepository.save(professional);

      this.logger.log(`✅ Profesional actualizado exitosamente`);
      return new ProfessionalResponseDto(updatedProfessional);
    } catch (error) {
      this.logger.error(`❌ Error al actualizar profesional: ${error.message}`);
      throw error;
    }
  }

  async deactivate(id: string, user: User): Promise<ProfessionalResponseDto> {
    this.logger.log(`=== DESACTIVANDO PROFESIONAL ===`);
    this.logger.log(`ID: ${id}`);

    try {
      const professional = await this.professionalRepository.findOne({
        where: { id },
        relations: ['specialties'],
      });

      if (!professional) {
        this.logger.warn(`Profesional con ID '${id}' no encontrado`);
        throw new NotFoundException('Profesional no encontrado');
      }

      // Validar acceso por empresa
      CompanyAccessHelper.validateAccess(user, professional.companyId);

      if (!professional.isActive) {
        this.logger.warn(`Profesional '${professional.getFullName()}' ya está desactivado`);
        throw new BadRequestException('El profesional ya está desactivado');
      }

      await this.professionalRepository.update(id, { isActive: false });
      const deactivatedProfessional = await this.professionalRepository.findOne({
        where: { id },
        relations: ['specialties'],
      });

      this.logger.log(`✅ Profesional '${professional.getFullName()}' desactivado exitosamente`);
      return new ProfessionalResponseDto(deactivatedProfessional!);
    } catch (error) {
      this.logger.error(`❌ Error al desactivar profesional: ${error.message}`);
      throw error;
    }
  }

  async reactivate(id: string, user: User): Promise<ProfessionalResponseDto> {
    this.logger.log(`=== REACTIVANDO PROFESIONAL ===`);
    this.logger.log(`ID: ${id}`);

    try {
      const professional = await this.professionalRepository.findOne({
        where: { id },
        relations: ['specialties'],
      });

      if (!professional) {
        this.logger.warn(`Profesional con ID '${id}' no encontrado`);
        throw new NotFoundException('Profesional no encontrado');
      }

      // Validar acceso por empresa
      CompanyAccessHelper.validateAccess(user, professional.companyId);

      if (professional.isActive) {
        this.logger.warn(`Profesional '${professional.getFullName()}' ya está activo`);
        throw new BadRequestException('El profesional ya está activo');
      }

      await this.professionalRepository.update(id, { isActive: true });
      const reactivatedProfessional = await this.professionalRepository.findOne({
        where: { id },
        relations: ['specialties'],
      });

      this.logger.log(`✅ Profesional '${professional.getFullName()}' reactivado exitosamente`);
      return new ProfessionalResponseDto(reactivatedProfessional!);
    } catch (error) {
      this.logger.error(`❌ Error al reactivar profesional: ${error.message}`);
      throw error;
    }
  }
}

import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Specialty } from './entities/specialty.entity';
import { CreateSpecialtyDto } from './dto/create-specialty.dto';
import { UpdateSpecialtyDto } from './dto/update-specialty.dto';
import { SpecialtyResponseDto } from './dto/specialty-response.dto';

@Injectable()
export class SpecialtiesService {
  private readonly logger = new Logger(SpecialtiesService.name);

  constructor(
    @InjectRepository(Specialty)
    private readonly specialtyRepository: Repository<Specialty>,
  ) {}

  async create(createSpecialtyDto: CreateSpecialtyDto): Promise<SpecialtyResponseDto> {
    this.logger.log(`=== CREANDO NUEVA ESPECIALIDAD ===`);
    this.logger.log(`Nombre: ${createSpecialtyDto.name}`);
    this.logger.log(`Código: ${createSpecialtyDto.code}`);

    try {
      // Verificar si ya existe una especialidad con el mismo nombre
      const existingByName = await this.specialtyRepository.findOne({
        where: { name: createSpecialtyDto.name },
      });

      if (existingByName) {
        this.logger.warn(`Especialidad con nombre '${createSpecialtyDto.name}' ya existe`);
        throw new ConflictException('Ya existe una especialidad con este nombre');
      }

      // Verificar si ya existe una especialidad con el mismo código
      const existingByCode = await this.specialtyRepository.findOne({
        where: { code: createSpecialtyDto.code },
      });

      if (existingByCode) {
        this.logger.warn(`Especialidad con código '${createSpecialtyDto.code}' ya existe`);
        throw new ConflictException('Ya existe una especialidad con este código');
      }

      // Crear la nueva especialidad
      const specialty = this.specialtyRepository.create(createSpecialtyDto);
      const savedSpecialty = await this.specialtyRepository.save(specialty);

      this.logger.log(`✅ Especialidad creada exitosamente con ID: ${savedSpecialty.id}`);
      return new SpecialtyResponseDto(savedSpecialty);
    } catch (error) {
      this.logger.error(`❌ Error al crear especialidad: ${error.message}`);
      throw error;
    }
  }

  async findAll(includeInactive = false): Promise<SpecialtyResponseDto[]> {
    this.logger.log(`=== LISTANDO ESPECIALIDADES ===`);
    this.logger.log(`Incluir inactivas: ${includeInactive}`);

    try {
      const whereCondition = includeInactive ? {} : { isActive: true };
      const specialties = await this.specialtyRepository.find({
        where: whereCondition,
        order: { name: 'ASC' },
      });

      this.logger.log(`✅ Encontradas ${specialties.length} especialidades`);
      return specialties.map(specialty => new SpecialtyResponseDto(specialty));
    } catch (error) {
      this.logger.error(`❌ Error al listar especialidades: ${error.message}`);
      throw error;
    }
  }

  async findOne(id: string): Promise<SpecialtyResponseDto> {
    this.logger.log(`=== BUSCANDO ESPECIALIDAD POR ID ===`);
    this.logger.log(`ID: ${id}`);

    try {
      const specialty = await this.specialtyRepository.findOne({
        where: { id },
      });

      if (!specialty) {
        this.logger.warn(`Especialidad con ID '${id}' no encontrada`);
        throw new NotFoundException('Especialidad no encontrada');
      }

      this.logger.log(`✅ Especialidad encontrada: ${specialty.name}`);
      return new SpecialtyResponseDto(specialty);
    } catch (error) {
      this.logger.error(`❌ Error al buscar especialidad: ${error.message}`);
      throw error;
    }
  }

  async findByCode(code: string): Promise<SpecialtyResponseDto> {
    this.logger.log(`=== BUSCANDO ESPECIALIDAD POR CÓDIGO ===`);
    this.logger.log(`Código: ${code}`);

    try {
      const specialty = await this.specialtyRepository.findOne({
        where: { code, isActive: true },
      });

      if (!specialty) {
        this.logger.warn(`Especialidad con código '${code}' no encontrada`);
        throw new NotFoundException('Especialidad no encontrada');
      }

      this.logger.log(`✅ Especialidad encontrada: ${specialty.name}`);
      return new SpecialtyResponseDto(specialty);
    } catch (error) {
      this.logger.error(`❌ Error al buscar especialidad por código: ${error.message}`);
      throw error;
    }
  }

  async search(term: string): Promise<SpecialtyResponseDto[]> {
    this.logger.log(`=== BUSCANDO ESPECIALIDADES ===`);
    this.logger.log(`Término de búsqueda: ${term}`);

    if (!term || term.trim().length < 2) {
      throw new BadRequestException('El término de búsqueda debe tener al menos 2 caracteres');
    }

    try {
      const searchTerm = `%${term.trim()}%`;
      const specialties = await this.specialtyRepository.find({
        where: [
          { name: Like(searchTerm), isActive: true },
          { code: Like(searchTerm), isActive: true },
          { description: Like(searchTerm), isActive: true },
          { department: Like(searchTerm), isActive: true },
        ],
        order: { name: 'ASC' },
      });

      this.logger.log(`✅ Encontradas ${specialties.length} especialidades que coinciden con '${term}'`);
      return specialties.map(specialty => new SpecialtyResponseDto(specialty));
    } catch (error) {
      this.logger.error(`❌ Error al buscar especialidades: ${error.message}`);
      throw error;
    }
  }

  async update(id: string, updateSpecialtyDto: UpdateSpecialtyDto): Promise<SpecialtyResponseDto> {
    this.logger.log(`=== ACTUALIZANDO ESPECIALIDAD ===`);
    this.logger.log(`ID: ${id}`);
    this.logger.log(`Datos a actualizar:`, updateSpecialtyDto);

    try {
      const specialty = await this.specialtyRepository.findOne({
        where: { id },
      });

      if (!specialty) {
        this.logger.warn(`Especialidad con ID '${id}' no encontrada`);
        throw new NotFoundException('Especialidad no encontrada');
      }

      // Verificar conflictos si se está actualizando el nombre
      if (updateSpecialtyDto.name && updateSpecialtyDto.name !== specialty.name) {
        const existingByName = await this.specialtyRepository.findOne({
          where: { name: updateSpecialtyDto.name },
        });

        if (existingByName && existingByName.id !== id) {
          this.logger.warn(`Especialidad con nombre '${updateSpecialtyDto.name}' ya existe`);
          throw new ConflictException('Ya existe una especialidad con este nombre');
        }
      }

      // Verificar conflictos si se está actualizando el código
      if (updateSpecialtyDto.code && updateSpecialtyDto.code !== specialty.code) {
        const existingByCode = await this.specialtyRepository.findOne({
          where: { code: updateSpecialtyDto.code },
        });

        if (existingByCode && existingByCode.id !== id) {
          this.logger.warn(`Especialidad con código '${updateSpecialtyDto.code}' ya existe`);
          throw new ConflictException('Ya existe una especialidad con este código');
        }
      }

      // Actualizar la especialidad
      await this.specialtyRepository.update(id, updateSpecialtyDto);
      const updatedSpecialty = await this.specialtyRepository.findOne({
        where: { id },
      });

      this.logger.log(`✅ Especialidad actualizada exitosamente`);
      return new SpecialtyResponseDto(updatedSpecialty!);
    } catch (error) {
      this.logger.error(`❌ Error al actualizar especialidad: ${error.message}`);
      throw error;
    }
  }

  async deactivate(id: string): Promise<SpecialtyResponseDto> {
    this.logger.log(`=== DESACTIVANDO ESPECIALIDAD ===`);
    this.logger.log(`ID: ${id}`);

    try {
      const specialty = await this.specialtyRepository.findOne({
        where: { id },
      });

      if (!specialty) {
        this.logger.warn(`Especialidad con ID '${id}' no encontrada`);
        throw new NotFoundException('Especialidad no encontrada');
      }

      if (!specialty.isActive) {
        this.logger.warn(`Especialidad '${specialty.name}' ya está desactivada`);
        throw new BadRequestException('La especialidad ya está desactivada');
      }

      await this.specialtyRepository.update(id, { isActive: false });
      const deactivatedSpecialty = await this.specialtyRepository.findOne({
        where: { id },
      });

      this.logger.log(`✅ Especialidad '${specialty.name}' desactivada exitosamente`);
      return new SpecialtyResponseDto(deactivatedSpecialty!);
    } catch (error) {
      this.logger.error(`❌ Error al desactivar especialidad: ${error.message}`);
      throw error;
    }
  }

  async reactivate(id: string): Promise<SpecialtyResponseDto> {
    this.logger.log(`=== REACTIVANDO ESPECIALIDAD ===`);
    this.logger.log(`ID: ${id}`);

    try {
      const specialty = await this.specialtyRepository.findOne({
        where: { id },
      });

      if (!specialty) {
        this.logger.warn(`Especialidad con ID '${id}' no encontrada`);
        throw new NotFoundException('Especialidad no encontrada');
      }

      if (specialty.isActive) {
        this.logger.warn(`Especialidad '${specialty.name}' ya está activa`);
        throw new BadRequestException('La especialidad ya está activa');
      }

      await this.specialtyRepository.update(id, { isActive: true });
      const reactivatedSpecialty = await this.specialtyRepository.findOne({
        where: { id },
      });

      this.logger.log(`✅ Especialidad '${specialty.name}' reactivada exitosamente`);
      return new SpecialtyResponseDto(reactivatedSpecialty!);
    } catch (error) {
      this.logger.error(`❌ Error al reactivar especialidad: ${error.message}`);
      throw error;
    }
  }
}

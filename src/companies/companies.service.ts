import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompanyResponseDto } from './dto/company-response.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<CompanyResponseDto> {
    // Verificar si ya existe una empresa con ese RUC
    const existing = await this.companyRepository.findOne({
      where: { ruc: createCompanyDto.ruc },
    });

    if (existing) {
      throw new ConflictException('Ya existe una empresa con ese RUC');
    }

    const company = this.companyRepository.create(createCompanyDto);
    const saved = await this.companyRepository.save(company);
    
    // Recargar con relaciones
    const result = await this.companyRepository.findOne({
      where: { id: saved.id },
      relations: ['subscription'],
    });

    if (!result) {
      throw new NotFoundException('Error al crear empresa');
    }

    return new CompanyResponseDto(result);
  }

  async findAll(includeInactive = false): Promise<CompanyResponseDto[]> {
    const where = includeInactive ? {} : { isActive: true };
    const companies = await this.companyRepository.find({
      where,
      relations: ['subscription'],
      order: { name: 'ASC' },
    });

    return companies.map(company => new CompanyResponseDto(company));
  }

  async findOne(id: string): Promise<CompanyResponseDto> {
    const company = await this.companyRepository.findOne({
      where: { id },
      relations: ['subscription'],
    });

    if (!company) {
      throw new NotFoundException('Empresa no encontrada');
    }

    return new CompanyResponseDto(company);
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto): Promise<CompanyResponseDto> {
    const company = await this.companyRepository.findOne({
      where: { id },
    });

    if (!company) {
      throw new NotFoundException('Empresa no encontrada');
    }

    // Si se cambia el RUC, verificar que no exista
    if (updateCompanyDto.ruc && updateCompanyDto.ruc !== company.ruc) {
      const existing = await this.companyRepository.findOne({
        where: { ruc: updateCompanyDto.ruc },
      });

      if (existing) {
        throw new ConflictException('Ya existe una empresa con ese RUC');
      }
    }

    await this.companyRepository.update(id, updateCompanyDto);
    
    const updated = await this.companyRepository.findOne({
      where: { id },
      relations: ['subscription'],
    });

    if (!updated) {
      throw new NotFoundException('Error al actualizar empresa');
    }

    return new CompanyResponseDto(updated);
  }

  async remove(id: string): Promise<void> {
    const company = await this.companyRepository.findOne({
      where: { id },
    });

    if (!company) {
      throw new NotFoundException('Empresa no encontrada');
    }

    // Soft delete
    await this.companyRepository.update(id, { isActive: false });
  }

  async activate(id: string): Promise<CompanyResponseDto> {
    const company = await this.companyRepository.findOne({
      where: { id },
    });

    if (!company) {
      throw new NotFoundException('Empresa no encontrada');
    }

    await this.companyRepository.update(id, { isActive: true });
    
    const updated = await this.companyRepository.findOne({
      where: { id },
      relations: ['subscription'],
    });

    if (!updated) {
      throw new NotFoundException('Error al activar empresa');
    }

    return new CompanyResponseDto(updated);
  }

  async search(term: string): Promise<CompanyResponseDto[]> {
    const companies = await this.companyRepository
      .createQueryBuilder('company')
      .leftJoinAndSelect('company.subscription', 'subscription')
      .where('company.name ILIKE :term', { term: `%${term}%` })
      .orWhere('company.ruc LIKE :term', { term: `%${term}%` })
      .andWhere('company.isActive = :isActive', { isActive: true })
      .orderBy('company.name', 'ASC')
      .getMany();

    return companies.map(company => new CompanyResponseDto(company));
  }
}

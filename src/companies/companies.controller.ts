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
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompanyResponseDto } from './dto/company-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('companies')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CompaniesController {
  private readonly logger = new Logger(CompaniesController.name);

  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  async create(
    @Body() createCompanyDto: CreateCompanyDto,
    @CurrentUser() user: User,
  ): Promise<CompanyResponseDto> {
    this.logger.log(`Usuario ${user.email} creando empresa: ${createCompanyDto.name}`);
    return await this.companiesService.create(createCompanyDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  async findAll(
    @Query('includeInactive') includeInactive?: string,
    @CurrentUser() user?: User,
  ): Promise<CompanyResponseDto[]> {
    this.logger.log(`Usuario ${user?.email} listando empresas`);
    return await this.companiesService.findAll(includeInactive === 'true');
  }

  @Get('search')
  @Roles(UserRole.ADMIN)
  async search(
    @Query('term') term: string,
    @CurrentUser() user: User,
  ): Promise<CompanyResponseDto[]> {
    this.logger.log(`Usuario ${user.email} buscando empresas: ${term}`);
    return await this.companiesService.search(term);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<CompanyResponseDto> {
    this.logger.log(`Usuario ${user.email} consultando empresa ${id}`);
    return await this.companiesService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @CurrentUser() user: User,
  ): Promise<CompanyResponseDto> {
    this.logger.log(`Usuario ${user.email} actualizando empresa ${id}`);
    return await this.companiesService.update(id, updateCompanyDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<{ message: string }> {
    this.logger.log(`Usuario ${user.email} eliminando empresa ${id}`);
    await this.companiesService.remove(id);
    return { message: 'Empresa desactivada exitosamente' };
  }

  @Patch(':id/activate')
  @Roles(UserRole.ADMIN)
  async activate(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<CompanyResponseDto> {
    this.logger.log(`Usuario ${user.email} activando empresa ${id}`);
    return await this.companiesService.activate(id);
  }
}

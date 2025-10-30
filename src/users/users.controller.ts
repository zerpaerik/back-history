import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Logger,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from './entities/user.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from './entities/user.entity';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  async create(
    @Body() createUserDto: CreateUserDto,
    @CurrentUser() user: User,
  ): Promise<UserResponseDto> {
    this.logger.log(`Usuario ${user.email} creando nuevo usuario: ${createUserDto.username}`);
    const newUser = await this.usersService.create(createUserDto);
    return new UserResponseDto(newUser);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  async findAll(
    @Query('includeInactive') includeInactive?: string,
    @CurrentUser() user?: User,
  ): Promise<UserResponseDto[]> {
    this.logger.log(`Usuario ${user?.email} listando usuarios`);
    const users = await this.usersService.findAll(includeInactive === 'true');
    return users.map(u => new UserResponseDto(u));
  }

  @Get('search')
  @Roles(UserRole.ADMIN)
  async search(
    @Query('term') term: string,
    @CurrentUser() user: User,
  ): Promise<UserResponseDto[]> {
    this.logger.log(`Usuario ${user.email} buscando usuarios: ${term}`);
    const users = await this.usersService.search(term);
    return users.map(u => new UserResponseDto(u));
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<UserResponseDto> {
    this.logger.log(`Usuario ${user.email} consultando usuario ${id}`);
    const foundUser = await this.usersService.findById(id);
    if (!foundUser) {
      throw new Error('Usuario no encontrado');
    }
    return new UserResponseDto(foundUser);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: User,
  ): Promise<UserResponseDto> {
    this.logger.log(`Usuario ${user.email} actualizando usuario ${id}`);
    const updated = await this.usersService.update(id, updateUserDto);
    return new UserResponseDto(updated);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<{ message: string }> {
    this.logger.log(`Usuario ${user.email} desactivando usuario ${id}`);
    await this.usersService.deactivate(id);
    return { message: 'Usuario desactivado exitosamente' };
  }

  @Patch(':id/activate')
  @Roles(UserRole.ADMIN)
  async activate(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<UserResponseDto> {
    this.logger.log(`Usuario ${user.email} activando usuario ${id}`);
    const activated = await this.usersService.activate(id);
    return new UserResponseDto(activated);
  }
}

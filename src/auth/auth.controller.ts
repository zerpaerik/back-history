import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtResponseDto } from './dto/jwt-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto): Promise<JwtResponseDto> {
    this.logger.log(`=== REGISTRO DE NUEVO USUARIO ===`);
    this.logger.log(`Email: ${registerDto.email}`);
    this.logger.log(`Username: ${registerDto.username}`);
    this.logger.log(`Role: ${registerDto.role || 'receptionist'}`);

    try {
      const result = await this.authService.register(registerDto);
      this.logger.log(`Usuario registrado exitosamente: ${result.user.id}`);
      return result;
    } catch (error) {
      this.logger.error(`Error en registro: ${error.message}`);
      throw error;
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<JwtResponseDto> {
    this.logger.log(`=== INTENTO DE LOGIN ===`);
    this.logger.log(`Email: ${loginDto.email}`);

    try {
      const result = await this.authService.login(loginDto);
      this.logger.log(`Login exitoso para usuario: ${result.user.id}`);
      return result;
    } catch (error) {
      this.logger.error(`Error en login: ${error.message}`);
      throw error;
    }
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user: User) {
    this.logger.log(`=== CONSULTA DE PERFIL ===`);
    this.logger.log(`Usuario: ${user.email}`);

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@CurrentUser() user: User) {
    this.logger.log(`=== LOGOUT ===`);
    this.logger.log(`Usuario: ${user.email}`);

    // En JWT no necesitamos invalidar el token en el servidor
    // El cliente debe eliminar el token del localStorage/sessionStorage
    return {
      message: 'Logout exitoso',
      timestamp: new Date().toISOString(),
    };
  }
}

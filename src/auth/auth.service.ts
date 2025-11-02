import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtResponseDto } from './dto/jwt-response.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<JwtResponseDto> {
    this.logger.log(`Registrando nuevo usuario: ${registerDto.email}`);
    
    const user = await this.usersService.create(registerDto);
    
    this.logger.log(`Usuario registrado exitosamente: ${user.id}`);
    return this.generateJwtResponse(user);
  }

  async login(loginDto: LoginDto): Promise<JwtResponseDto> {
    this.logger.log(`Intento de login para: ${loginDto.email}`);
    
    const user = await this.validateUser(loginDto.email, loginDto.password);
    
    if (!user) {
      this.logger.warn(`Login fallido para: ${loginDto.email}`);
      throw new UnauthorizedException('Credenciales inválidas');
    }

    this.logger.log(`Login exitoso para: ${user.email}`);
    return this.generateJwtResponse(user);
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    
    if (user && await user.validatePassword(password)) {
      return user;
    }
    
    return null;
  }

  async validateUserById(userId: string): Promise<User | null> {
    return await this.usersService.findById(userId);
  }

  private generateJwtResponse(user: User): JwtResponseDto {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        companyId: user.companyId,
        companyName: user.company?.name,
      },
    };
  }
}

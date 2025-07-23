import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtResponseDto } from './dto/jwt-response.dto';
import { User } from '../users/entities/user.entity';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    private readonly logger;
    constructor(usersService: UsersService, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<JwtResponseDto>;
    login(loginDto: LoginDto): Promise<JwtResponseDto>;
    validateUser(email: string, password: string): Promise<User | null>;
    validateUserById(userId: string): Promise<User | null>;
    private generateJwtResponse;
}

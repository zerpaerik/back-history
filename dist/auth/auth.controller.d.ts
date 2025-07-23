import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtResponseDto } from './dto/jwt-response.dto';
import { User } from '../users/entities/user.entity';
export declare class AuthController {
    private readonly authService;
    private readonly logger;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<JwtResponseDto>;
    login(loginDto: LoginDto): Promise<JwtResponseDto>;
    getProfile(user: User): Promise<{
        id: string;
        username: string;
        email: string;
        role: import("../users/entities/user.entity").UserRole;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    logout(user: User): Promise<{
        message: string;
        timestamp: string;
    }>;
}

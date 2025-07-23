"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
let AuthService = AuthService_1 = class AuthService {
    usersService;
    jwtService;
    logger = new common_1.Logger(AuthService_1.name);
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async register(registerDto) {
        this.logger.log(`Registrando nuevo usuario: ${registerDto.email}`);
        const user = await this.usersService.create(registerDto);
        this.logger.log(`Usuario registrado exitosamente: ${user.id}`);
        return this.generateJwtResponse(user);
    }
    async login(loginDto) {
        this.logger.log(`Intento de login para: ${loginDto.email}`);
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            this.logger.warn(`Login fallido para: ${loginDto.email}`);
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        this.logger.log(`Login exitoso para: ${user.email}`);
        return this.generateJwtResponse(user);
    }
    async validateUser(email, password) {
        const user = await this.usersService.findByEmail(email);
        if (user && await user.validatePassword(password)) {
            return user;
        }
        return null;
    }
    async validateUserById(userId) {
        return await this.usersService.findById(userId);
    }
    generateJwtResponse(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
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
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map
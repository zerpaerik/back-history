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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
let UsersService = class UsersService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async create(registerDto) {
        const existingUser = await this.userRepository.findOne({
            where: [
                { email: registerDto.email },
                { username: registerDto.username }
            ]
        });
        if (existingUser) {
            throw new common_1.ConflictException('El usuario con este email o username ya existe');
        }
        const user = this.userRepository.create(registerDto);
        return await this.userRepository.save(user);
    }
    async findByEmail(email) {
        return await this.userRepository.findOne({
            where: { email, isActive: true }
        });
    }
    async findById(id) {
        return await this.userRepository.findOne({
            where: { id, isActive: true }
        });
    }
    async findAll() {
        return await this.userRepository.find({
            where: { isActive: true },
            select: ['id', 'username', 'email', 'role', 'isActive', 'createdAt', 'updatedAt']
        });
    }
    async update(id, updateData) {
        const user = await this.findById(id);
        if (!user) {
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
        await this.userRepository.update(id, updateData);
        const updatedUser = await this.findById(id);
        if (!updatedUser) {
            throw new common_1.NotFoundException('Error al actualizar usuario');
        }
        return updatedUser;
    }
    async deactivate(id) {
        const user = await this.findById(id);
        if (!user) {
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
        await this.userRepository.update(id, { isActive: false });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map
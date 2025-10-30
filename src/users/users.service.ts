import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RegisterDto } from '../auth/dto/register.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(registerDto: RegisterDto): Promise<User> {
    // Verificar si el usuario ya existe
    const existingUser = await this.userRepository.findOne({
      where: [
        { email: registerDto.email },
        { username: registerDto.username }
      ]
    });

    if (existingUser) {
      throw new ConflictException('El usuario con este email o username ya existe');
    }

    // Crear nuevo usuario
    const user = this.userRepository.create(registerDto);
    return await this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email, isActive: true }
    });
  }

  async findById(id: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { id, isActive: true },
      relations: ['company', 'company.subscription'],
    });
  }

  async findAll(includeInactive = false): Promise<User[]> {
    const where = includeInactive ? {} : { isActive: true };
    return await this.userRepository.find({
      where,
      relations: ['company', 'company.subscription'],
      select: ['id', 'username', 'email', 'role', 'companyId', 'isActive', 'createdAt', 'updatedAt'],
      order: { username: 'ASC' },
    });
  }

  async update(id: string, updateData: Partial<User>): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    await this.userRepository.update(id, updateData);
    const updatedUser = await this.findById(id);
    if (!updatedUser) {
      throw new NotFoundException('Error al actualizar usuario');
    }
    return updatedUser;
  }

  async deactivate(id: string): Promise<void> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    await this.userRepository.update(id, { isActive: false });
  }

  async activate(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['company', 'company.subscription'],
    });
    
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    await this.userRepository.update(id, { isActive: true });
    
    const updated = await this.userRepository.findOne({
      where: { id },
      relations: ['company', 'company.subscription'],
    });

    if (!updated) {
      throw new NotFoundException('Error al activar usuario');
    }

    return updated;
  }

  async search(term: string): Promise<User[]> {
    return await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.company', 'company')
      .leftJoinAndSelect('company.subscription', 'subscription')
      .where('user.username ILIKE :term', { term: `%${term}%` })
      .orWhere('user.email ILIKE :term', { term: `%${term}%` })
      .andWhere('user.isActive = :isActive', { isActive: true })
      .orderBy('user.username', 'ASC')
      .getMany();
  }
}

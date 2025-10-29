import { Controller, Post, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Controller('auth')
export class SeedAdminController {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  @Post('seed-admin')
  @HttpCode(HttpStatus.CREATED)
  async seedAdmin() {
    try {
      // Eliminar usuario admin anterior si existe
      await this.userRepository.delete({ username: 'admin' });
      await this.userRepository.delete({ email: 'admin@sysmedic.com' });

      // Hashear la contraseña manualmente para evitar doble hash
      const hashedPassword = await bcrypt.hash('admin123', 12);

      // Crear usuario admin directamente con INSERT para evitar @BeforeInsert
      await this.userRepository.query(`
        INSERT INTO users (id, username, email, password, role, "isActive", "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), 'admin', 'admin@sysmedic.com', $1, 'admin', true, NOW(), NOW())
      `, [hashedPassword]);

      // Obtener el usuario creado
      const admin = await this.userRepository.findOne({
        where: { username: 'admin' },
      });

      if (!admin) {
        throw new Error('No se pudo crear el usuario admin');
      }

      return {
        success: true,
        message: 'Usuario admin creado exitosamente',
        data: {
          id: admin.id,
          username: admin.username,
          email: admin.email,
          role: admin.role,
        },
        credentials: {
          email: 'admin@sysmedic.com',
          password: 'admin123',
          note: 'IMPORTANTE: Usa el EMAIL para hacer login, no el username. Cambia la contraseña después del primer login.',
        },
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al crear usuario admin',
        error: error.message,
      };
    }
  }

  @Delete('reset-admin')
  @HttpCode(HttpStatus.OK)
  async resetAdmin() {
    try {
      // Eliminar usuario admin
      const result = await this.userRepository.delete({ username: 'admin' });
      
      return {
        success: true,
        message: 'Usuario admin eliminado',
        deletedCount: result.affected,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al eliminar usuario admin',
        error: error.message,
      };
    }
  }
}

import { ForbiddenException } from '@nestjs/common';
import { User, UserRole } from '../../users/entities/user.entity';

/**
 * Helper para validar acceso por empresa
 */
export class CompanyAccessHelper {
  /**
   * Verifica si un usuario puede acceder a un recurso de una empresa específica
   * ADMIN puede acceder a cualquier empresa
   * Otros roles solo pueden acceder a su propia empresa
   */
  static validateAccess(user: User, resourceCompanyId: string): void {
    if (user.role === UserRole.ADMIN) {
      return; // ADMIN tiene acceso a todo
    }

    if (!user.companyId) {
      throw new ForbiddenException('Usuario sin empresa asignada');
    }

    if (user.companyId !== resourceCompanyId) {
      throw new ForbiddenException('No tienes acceso a recursos de otra empresa');
    }
  }

  /**
   * Obtiene el filtro WHERE para consultas según el rol del usuario
   * ADMIN: sin filtro (ve todo)
   * Otros roles: filtrado por su companyId
   */
  static getCompanyFilter(user: User): { companyId?: string } {
    if (user.role === UserRole.ADMIN) {
      return {}; // Sin filtro para ADMIN
    }

    if (!user.companyId) {
      throw new ForbiddenException('Usuario sin empresa asignada');
    }

    return { companyId: user.companyId };
  }

  /**
   * Obtiene el companyId que debe usarse al crear un recurso
   * Siempre usa el companyId del usuario autenticado
   */
  static getCompanyIdForCreate(user: User): string {
    if (!user.companyId) {
      throw new ForbiddenException('Usuario sin empresa asignada');
    }

    return user.companyId;
  }

  /**
   * Verifica si el usuario tiene empresa asignada
   */
  static hasCompany(user: User): boolean {
    return !!user.companyId;
  }

  /**
   * Verifica si el usuario es ADMIN
   */
  static isAdmin(user: User): boolean {
    return user.role === UserRole.ADMIN;
  }
}

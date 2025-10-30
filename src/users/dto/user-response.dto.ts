import { User, UserRole } from '../entities/user.entity';
import { CompanyResponseDto } from '../../companies/dto/company-response.dto';

export class UserResponseDto {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  companyId: string;
  company: CompanyResponseDto | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(user: User) {
    this.id = user.id;
    this.username = user.username;
    this.email = user.email;
    this.role = user.role;
    this.companyId = user.companyId;
    this.company = user.company ? new CompanyResponseDto(user.company) : null;
    this.isActive = user.isActive;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}

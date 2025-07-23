import { UserRole } from '../../users/entities/user.entity';

export class JwtResponseDto {
  accessToken: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: UserRole;
    isActive: boolean;
  };
}

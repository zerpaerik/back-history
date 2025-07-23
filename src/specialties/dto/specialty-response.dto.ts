import { Specialty } from '../entities/specialty.entity';

export class SpecialtyResponseDto {
  id: string;
  name: string;
  code: string;
  description: string;
  department: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  fullInfo: string;

  constructor(specialty: Specialty) {
    this.id = specialty.id;
    this.name = specialty.name;
    this.code = specialty.code;
    this.description = specialty.description;
    this.department = specialty.department;
    this.isActive = specialty.isActive;
    this.createdAt = specialty.createdAt;
    this.updatedAt = specialty.updatedAt;
    this.fullInfo = specialty.getFullInfo();
  }
}

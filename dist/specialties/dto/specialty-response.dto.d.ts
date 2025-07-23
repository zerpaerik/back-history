import { Specialty } from '../entities/specialty.entity';
export declare class SpecialtyResponseDto {
    id: string;
    name: string;
    code: string;
    description: string;
    department: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    fullInfo: string;
    constructor(specialty: Specialty);
}

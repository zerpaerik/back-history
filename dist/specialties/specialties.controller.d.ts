import { SpecialtiesService } from './specialties.service';
import { CreateSpecialtyDto } from './dto/create-specialty.dto';
import { UpdateSpecialtyDto } from './dto/update-specialty.dto';
import { SpecialtyResponseDto } from './dto/specialty-response.dto';
import { User } from '../users/entities/user.entity';
export declare class SpecialtiesController {
    private readonly specialtiesService;
    private readonly logger;
    constructor(specialtiesService: SpecialtiesService);
    create(createSpecialtyDto: CreateSpecialtyDto, user: User): Promise<SpecialtyResponseDto>;
    findAll(user: User, includeInactive?: string): Promise<SpecialtyResponseDto[]>;
    search(term: string, user: User): Promise<SpecialtyResponseDto[]>;
    findByCode(code: string, user: User): Promise<SpecialtyResponseDto>;
    findOne(id: string, user: User): Promise<SpecialtyResponseDto>;
    update(id: string, updateSpecialtyDto: UpdateSpecialtyDto, user: User): Promise<SpecialtyResponseDto>;
    deactivate(id: string, user: User): Promise<SpecialtyResponseDto>;
    reactivate(id: string, user: User): Promise<SpecialtyResponseDto>;
}

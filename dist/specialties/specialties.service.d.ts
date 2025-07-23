import { Repository } from 'typeorm';
import { Specialty } from './entities/specialty.entity';
import { CreateSpecialtyDto } from './dto/create-specialty.dto';
import { UpdateSpecialtyDto } from './dto/update-specialty.dto';
import { SpecialtyResponseDto } from './dto/specialty-response.dto';
export declare class SpecialtiesService {
    private readonly specialtyRepository;
    private readonly logger;
    constructor(specialtyRepository: Repository<Specialty>);
    create(createSpecialtyDto: CreateSpecialtyDto): Promise<SpecialtyResponseDto>;
    findAll(includeInactive?: boolean): Promise<SpecialtyResponseDto[]>;
    findOne(id: string): Promise<SpecialtyResponseDto>;
    findByCode(code: string): Promise<SpecialtyResponseDto>;
    search(term: string): Promise<SpecialtyResponseDto[]>;
    update(id: string, updateSpecialtyDto: UpdateSpecialtyDto): Promise<SpecialtyResponseDto>;
    deactivate(id: string): Promise<SpecialtyResponseDto>;
    reactivate(id: string): Promise<SpecialtyResponseDto>;
}

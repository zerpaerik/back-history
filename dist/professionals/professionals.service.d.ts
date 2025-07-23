import { Repository } from 'typeorm';
import { Professional } from './entities/professional.entity';
import { Specialty } from '../specialties/entities/specialty.entity';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { UpdateProfessionalDto } from './dto/update-professional.dto';
import { ProfessionalResponseDto } from './dto/professional-response.dto';
export declare class ProfessionalsService {
    private readonly professionalRepository;
    private readonly specialtyRepository;
    private readonly logger;
    constructor(professionalRepository: Repository<Professional>, specialtyRepository: Repository<Specialty>);
    create(createProfessionalDto: CreateProfessionalDto): Promise<ProfessionalResponseDto>;
    findAll(includeInactive?: boolean): Promise<ProfessionalResponseDto[]>;
    findOne(id: string): Promise<ProfessionalResponseDto>;
    findByLicense(licenseNumber: string): Promise<ProfessionalResponseDto>;
    findByIdentification(identificationType: string, identificationNumber: string): Promise<ProfessionalResponseDto>;
    findBySpecialty(specialtyId: string): Promise<ProfessionalResponseDto[]>;
    search(term: string): Promise<ProfessionalResponseDto[]>;
    update(id: string, updateProfessionalDto: UpdateProfessionalDto): Promise<ProfessionalResponseDto>;
    deactivate(id: string): Promise<ProfessionalResponseDto>;
    reactivate(id: string): Promise<ProfessionalResponseDto>;
}

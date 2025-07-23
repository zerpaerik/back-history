import { ProfessionalsService } from './professionals.service';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { UpdateProfessionalDto } from './dto/update-professional.dto';
import { ProfessionalResponseDto } from './dto/professional-response.dto';
import { User } from '../users/entities/user.entity';
export declare class ProfessionalsController {
    private readonly professionalsService;
    private readonly logger;
    constructor(professionalsService: ProfessionalsService);
    create(createProfessionalDto: CreateProfessionalDto, user: User): Promise<ProfessionalResponseDto>;
    findAll(user: User, includeInactive?: string): Promise<ProfessionalResponseDto[]>;
    search(term: string, user: User): Promise<ProfessionalResponseDto[]>;
    findByLicense(licenseNumber: string, user: User): Promise<ProfessionalResponseDto>;
    findByIdentification(type: string, number: string, user: User): Promise<ProfessionalResponseDto>;
    findBySpecialty(specialtyId: string, user: User): Promise<ProfessionalResponseDto[]>;
    findOne(id: string, user: User): Promise<ProfessionalResponseDto>;
    update(id: string, updateProfessionalDto: UpdateProfessionalDto, user: User): Promise<ProfessionalResponseDto>;
    deactivate(id: string, user: User): Promise<ProfessionalResponseDto>;
    reactivate(id: string, user: User): Promise<ProfessionalResponseDto>;
}

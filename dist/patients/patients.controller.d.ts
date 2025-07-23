import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PatientResponseDto } from './dto/patient-response.dto';
import { User } from '../users/entities/user.entity';
export declare class PatientsController {
    private readonly patientsService;
    private readonly logger;
    constructor(patientsService: PatientsService);
    create(createPatientDto: CreatePatientDto, user: User): Promise<PatientResponseDto>;
    findAll(user: User, includeInactive?: string): Promise<PatientResponseDto[]>;
    searchPatients(searchTerm: string, user: User): Promise<PatientResponseDto[]>;
    findByIdentification(identificationType: string, identificationNumber: string, user: User): Promise<PatientResponseDto>;
    findOne(id: string, user: User): Promise<PatientResponseDto>;
    update(id: string, updatePatientDto: UpdatePatientDto, user: User): Promise<PatientResponseDto>;
    deactivate(id: string, user: User): Promise<void>;
    reactivate(id: string, user: User): Promise<PatientResponseDto>;
}

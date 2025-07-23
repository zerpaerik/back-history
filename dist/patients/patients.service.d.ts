import { Repository } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PatientResponseDto } from './dto/patient-response.dto';
export declare class PatientsService {
    private readonly patientRepository;
    private readonly logger;
    constructor(patientRepository: Repository<Patient>);
    create(createPatientDto: CreatePatientDto): Promise<PatientResponseDto>;
    findAll(includeInactive?: boolean): Promise<PatientResponseDto[]>;
    findById(id: string): Promise<PatientResponseDto>;
    findByIdentification(identificationType: string, identificationNumber: string): Promise<PatientResponseDto>;
    searchPatients(searchTerm: string): Promise<PatientResponseDto[]>;
    update(id: string, updatePatientDto: UpdatePatientDto): Promise<PatientResponseDto>;
    deactivate(id: string): Promise<void>;
    reactivate(id: string): Promise<PatientResponseDto>;
    private mapToResponseDto;
}

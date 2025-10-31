import {
  Injectable,
  ConflictException,
  NotFoundException,
  Logger,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Not } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PatientResponseDto } from './dto/patient-response.dto';
import { User } from '../users/entities/user.entity';
import { CompanyAccessHelper } from '../common/helpers/company-access.helper';

@Injectable()
export class PatientsService {
  private readonly logger = new Logger(PatientsService.name);

  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
  ) {}

  async create(createPatientDto: CreatePatientDto, user: User): Promise<PatientResponseDto> {
    this.logger.log(`=== CREANDO NUEVO PACIENTE ===`);
    this.logger.log(`Identificación: ${createPatientDto.identificationType} ${createPatientDto.identificationNumber}`);
    this.logger.log(`Nombre: ${createPatientDto.firstName} ${createPatientDto.firstLastname}`);

    const companyId = CompanyAccessHelper.getCompanyIdForCreate(user);

    // Verificar si ya existe un paciente con la misma identificación en la misma empresa
    const existingPatient = await this.patientRepository.findOne({
      where: {
        identificationType: createPatientDto.identificationType,
        identificationNumber: createPatientDto.identificationNumber,
        companyId,
      },
    });

    if (existingPatient) {
      this.logger.error(`Paciente ya existe con identificación: ${createPatientDto.identificationType} ${createPatientDto.identificationNumber}`);
      throw new ConflictException(
        'Ya existe un paciente con este tipo y número de identificación',
      );
    }

    try {
      const patient = this.patientRepository.create({
        ...createPatientDto,
        birthDate: new Date(createPatientDto.birthDate),
        companyId,
      });

      const savedPatient = await this.patientRepository.save(patient);
      this.logger.log(`Paciente creado exitosamente con ID: ${savedPatient.id}`);
      
      return this.mapToResponseDto(savedPatient);
    } catch (error) {
      this.logger.error(`Error al crear paciente: ${error.message}`);
      throw error;
    }
  }

  async findAll(user: User, includeInactive = false): Promise<PatientResponseDto[]> {
    this.logger.log(`=== LISTANDO PACIENTES ===`);
    this.logger.log(`Incluir inactivos: ${includeInactive}`);

    const companyFilter = CompanyAccessHelper.getCompanyFilter(user);
    const whereCondition = includeInactive ? companyFilter : { ...companyFilter, isActive: true };
    
    const patients = await this.patientRepository.find({
      where: whereCondition,
      order: { createdAt: 'DESC' },
    });

    this.logger.log(`Encontrados ${patients.length} pacientes`);
    return patients.map(patient => this.mapToResponseDto(patient));
  }

  async findById(id: string, user: User): Promise<PatientResponseDto> {
    this.logger.log(`=== BUSCANDO PACIENTE POR ID ===`);
    this.logger.log(`ID: ${id}`);

    const patient = await this.patientRepository.findOne({
      where: { id, isActive: true },
    });

    if (!patient) {
      this.logger.error(`Paciente no encontrado con ID: ${id}`);
      throw new NotFoundException('Paciente no encontrado');
    }

    // Validar acceso por empresa
    CompanyAccessHelper.validateAccess(user, patient.companyId);

    this.logger.log(`Paciente encontrado: ${patient.getFullName()}`);
    return this.mapToResponseDto(patient);
  }

  async findByIdentification(
    identificationType: string,
    identificationNumber: string,
    user: User,
  ): Promise<PatientResponseDto> {
    this.logger.log(`=== BUSCANDO PACIENTE POR IDENTIFICACIÓN ===`);
    this.logger.log(`Identificación: ${identificationType} ${identificationNumber}`);

    const companyFilter = CompanyAccessHelper.getCompanyFilter(user);

    const patient = await this.patientRepository.findOne({
      where: {
        identificationType: identificationType as any,
        identificationNumber,
        ...companyFilter,
        isActive: true,
      },
    });

    if (!patient) {
      this.logger.error(`Paciente no encontrado con identificación: ${identificationType} ${identificationNumber}`);
      throw new NotFoundException('Paciente no encontrado');
    }

    this.logger.log(`Paciente encontrado: ${patient.getFullName()}`);
    return this.mapToResponseDto(patient);
  }

  async searchPatients(searchTerm: string, user: User): Promise<PatientResponseDto[]> {
    this.logger.log(`=== BUSCANDO PACIENTES ===`);
    this.logger.log(`Término de búsqueda: ${searchTerm}`);

    const companyFilter = CompanyAccessHelper.getCompanyFilter(user);

    const patients = await this.patientRepository.find({
      where: [
        { firstName: Like(`%${searchTerm}%`), ...companyFilter, isActive: true },
        { firstLastname: Like(`%${searchTerm}%`), ...companyFilter, isActive: true },
        { identificationNumber: Like(`%${searchTerm}%`), ...companyFilter, isActive: true },
        { email: Like(`%${searchTerm}%`), ...companyFilter, isActive: true },
      ],
      order: { createdAt: 'DESC' },
    });

    this.logger.log(`Encontrados ${patients.length} pacientes con el término: ${searchTerm}`);
    return patients.map(patient => this.mapToResponseDto(patient));
  }

  async update(id: string, updatePatientDto: UpdatePatientDto, user: User): Promise<PatientResponseDto> {
    this.logger.log(`=== ACTUALIZANDO PACIENTE ===`);
    this.logger.log(`ID: ${id}`);

    const patient = await this.patientRepository.findOne({
      where: { id },
    });

    if (!patient) {
      this.logger.error(`Paciente no encontrado con ID: ${id}`);
      throw new NotFoundException('Paciente no encontrado');
    }

    // Validar acceso por empresa
    CompanyAccessHelper.validateAccess(user, patient.companyId);

    // Si se está actualizando la identificación, verificar que no exista otro paciente con la misma
    if (updatePatientDto.identificationType || updatePatientDto.identificationNumber) {
      const identificationType = updatePatientDto.identificationType || patient.identificationType;
      const identificationNumber = updatePatientDto.identificationNumber || patient.identificationNumber;

      const existingPatient = await this.patientRepository.findOne({
        where: {
          identificationType,
          identificationNumber,
          companyId: patient.companyId,
          id: Not(id),
        },
      });

      if (existingPatient) {
        this.logger.error(`Ya existe otro paciente con identificación: ${identificationType} ${identificationNumber}`);
        throw new ConflictException(
          'Ya existe otro paciente con este tipo y número de identificación',
        );
      }
    }

    try {
      const updateData = { ...updatePatientDto };
      if (updatePatientDto.birthDate) {
        updateData.birthDate = new Date(updatePatientDto.birthDate) as any;
      }

      await this.patientRepository.update(id, updateData);
      
      const updatedPatient = await this.patientRepository.findOne({
        where: { id },
      });

      if (!updatedPatient) {
        throw new NotFoundException('Error al actualizar paciente');
      }

      this.logger.log(`Paciente actualizado exitosamente: ${updatedPatient.getFullName()}`);
      return this.mapToResponseDto(updatedPatient);
    } catch (error) {
      this.logger.error(`Error al actualizar paciente: ${error.message}`);
      throw error;
    }
  }

  async deactivate(id: string, user: User): Promise<void> {
    this.logger.log(`=== DESACTIVANDO PACIENTE ===`);
    this.logger.log(`ID: ${id}`);

    const patient = await this.patientRepository.findOne({
      where: { id },
    });

    if (!patient) {
      this.logger.error(`Paciente no encontrado con ID: ${id}`);
      throw new NotFoundException('Paciente no encontrado');
    }

    // Validar acceso por empresa
    CompanyAccessHelper.validateAccess(user, patient.companyId);

    await this.patientRepository.update(id, { isActive: false });
    this.logger.log(`Paciente desactivado exitosamente: ${patient.getFullName()}`);
  }

  async reactivate(id: string, user: User): Promise<PatientResponseDto> {
    this.logger.log(`=== REACTIVANDO PACIENTE ===`);
    this.logger.log(`ID: ${id}`);

    const patient = await this.patientRepository.findOne({
      where: { id },
    });

    if (!patient) {
      this.logger.error(`Paciente no encontrado con ID: ${id}`);
      throw new NotFoundException('Paciente no encontrado');
    }

    // Validar acceso por empresa
    CompanyAccessHelper.validateAccess(user, patient.companyId);

    await this.patientRepository.update(id, { isActive: true });
    
    const reactivatedPatient = await this.patientRepository.findOne({
      where: { id },
    });

    if (!reactivatedPatient) {
      throw new NotFoundException('Error al reactivar paciente');
    }

    this.logger.log(`Paciente reactivado exitosamente: ${reactivatedPatient.getFullName()}`);
    return this.mapToResponseDto(reactivatedPatient);
  }

  private mapToResponseDto(patient: Patient): PatientResponseDto {
    return {
      id: patient.id,
      firstName: patient.firstName,
      secondName: patient.secondName,
      firstLastname: patient.firstLastname,
      secondLastname: patient.secondLastname,
      identificationType: patient.identificationType,
      identificationNumber: patient.identificationNumber,
      birthDate: patient.birthDate,
      age: patient.getAge(),
      gender: patient.gender,
      maritalStatus: patient.maritalStatus,
      educationLevel: patient.educationLevel,
      phone: patient.phone,
      email: patient.email,
      address: patient.address,
      emergencyContactName: patient.emergencyContactName,
      emergencyContactPhone: patient.emergencyContactPhone,
      emergencyContactRelationship: patient.emergencyContactRelationship,
      bloodType: patient.bloodType,
      allergies: patient.allergies,
      observations: patient.observations,
      companyId: patient.companyId,
      isActive: patient.isActive,
      createdAt: patient.createdAt,
      updatedAt: patient.updatedAt,
      fullName: patient.getFullName(),
      fullIdentification: patient.getFullIdentification(),
    };
  }
}

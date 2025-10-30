import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { SubscriptionResponseDto } from './dto/subscription-response.dto';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) {}

  async create(createSubscriptionDto: CreateSubscriptionDto): Promise<SubscriptionResponseDto> {
    // Verificar si ya existe una suscripción con ese nombre
    const existing = await this.subscriptionRepository.findOne({
      where: { name: createSubscriptionDto.name },
    });

    if (existing) {
      throw new ConflictException('Ya existe una suscripción con ese nombre');
    }

    // Convertir features array a JSON string
    const featuresJson = createSubscriptionDto.features 
      ? JSON.stringify(createSubscriptionDto.features)
      : undefined;

    const subscription = this.subscriptionRepository.create({
      name: createSubscriptionDto.name,
      description: createSubscriptionDto.description,
      price: createSubscriptionDto.price,
      durationDays: createSubscriptionDto.durationDays,
      features: featuresJson,
      isActive: createSubscriptionDto.isActive ?? true,
    });

    const saved = await this.subscriptionRepository.save(subscription);
    return new SubscriptionResponseDto(saved);
  }

  async findAll(includeInactive = false): Promise<SubscriptionResponseDto[]> {
    const where = includeInactive ? {} : { isActive: true };
    const subscriptions = await this.subscriptionRepository.find({
      where,
      order: { price: 'ASC' },
    });

    return subscriptions.map(sub => new SubscriptionResponseDto(sub));
  }

  async findOne(id: string): Promise<SubscriptionResponseDto> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id },
    });

    if (!subscription) {
      throw new NotFoundException('Suscripción no encontrada');
    }

    return new SubscriptionResponseDto(subscription);
  }

  async update(id: string, updateSubscriptionDto: UpdateSubscriptionDto): Promise<SubscriptionResponseDto> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id },
    });

    if (!subscription) {
      throw new NotFoundException('Suscripción no encontrada');
    }

    // Preparar datos de actualización
    const updateData: any = { ...updateSubscriptionDto };
    
    // Si se actualizan features, convertir a JSON
    if (updateSubscriptionDto.features) {
      updateData.features = JSON.stringify(updateSubscriptionDto.features);
    }

    await this.subscriptionRepository.update(id, updateData);
    
    const updated = await this.subscriptionRepository.findOne({
      where: { id },
    });

    if (!updated) {
      throw new NotFoundException('Error al actualizar suscripción');
    }

    return new SubscriptionResponseDto(updated);
  }

  async remove(id: string): Promise<void> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id },
    });

    if (!subscription) {
      throw new NotFoundException('Suscripción no encontrada');
    }

    // Soft delete: marcar como inactiva
    await this.subscriptionRepository.update(id, { isActive: false });
  }

  async activate(id: string): Promise<SubscriptionResponseDto> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id },
    });

    if (!subscription) {
      throw new NotFoundException('Suscripción no encontrada');
    }

    await this.subscriptionRepository.update(id, { isActive: true });
    
    const updated = await this.subscriptionRepository.findOne({
      where: { id },
    });

    if (!updated) {
      throw new NotFoundException('Error al activar suscripción');
    }

    return new SubscriptionResponseDto(updated);
  }
}

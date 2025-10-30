import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { SubscriptionResponseDto } from './dto/subscription-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('subscriptions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SubscriptionsController {
  private readonly logger = new Logger(SubscriptionsController.name);

  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  async create(
    @Body() createSubscriptionDto: CreateSubscriptionDto,
    @CurrentUser() user: User,
  ): Promise<SubscriptionResponseDto> {
    this.logger.log(`Usuario ${user.email} creando suscripción: ${createSubscriptionDto.name}`);
    return await this.subscriptionsService.create(createSubscriptionDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  async findAll(
    @Query('includeInactive') includeInactive?: string,
    @CurrentUser() user?: User,
  ): Promise<SubscriptionResponseDto[]> {
    this.logger.log(`Usuario ${user?.email} listando suscripciones`);
    return await this.subscriptionsService.findAll(includeInactive === 'true');
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<SubscriptionResponseDto> {
    this.logger.log(`Usuario ${user.email} consultando suscripción ${id}`);
    return await this.subscriptionsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
    @CurrentUser() user: User,
  ): Promise<SubscriptionResponseDto> {
    this.logger.log(`Usuario ${user.email} actualizando suscripción ${id}`);
    return await this.subscriptionsService.update(id, updateSubscriptionDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<{ message: string }> {
    this.logger.log(`Usuario ${user.email} eliminando suscripción ${id}`);
    await this.subscriptionsService.remove(id);
    return { message: 'Suscripción desactivada exitosamente' };
  }

  @Patch(':id/activate')
  @Roles(UserRole.ADMIN)
  async activate(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<SubscriptionResponseDto> {
    this.logger.log(`Usuario ${user.email} activando suscripción ${id}`);
    return await this.subscriptionsService.activate(id);
  }
}

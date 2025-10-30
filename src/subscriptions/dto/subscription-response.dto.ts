import { Subscription } from '../entities/subscription.entity';

export class SubscriptionResponseDto {
  id: string;
  name: string;
  description: string;
  price: number;
  formattedPrice: string;
  durationDays: number;
  durationDescription: string;
  features: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(subscription: Subscription) {
    this.id = subscription.id;
    this.name = subscription.name;
    this.description = subscription.description;
    this.price = Number(subscription.price);
    this.formattedPrice = subscription.getFormattedPrice();
    this.durationDays = subscription.durationDays;
    this.durationDescription = subscription.getDurationDescription();
    this.features = subscription.getFeatures();
    this.isActive = subscription.isActive;
    this.createdAt = subscription.createdAt;
    this.updatedAt = subscription.updatedAt;
  }
}

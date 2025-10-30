import { Company, CompanyStatus } from '../entities/company.entity';
import { SubscriptionResponseDto } from '../../subscriptions/dto/subscription-response.dto';

export class CompanyResponseDto {
  id: string;
  name: string;
  ruc: string;
  address: string;
  phone: string;
  email: string;
  contactPerson: string;
  subscriptionId: string;
  subscription: SubscriptionResponseDto | null;
  subscriptionStartDate: Date;
  subscriptionEndDate: Date;
  daysRemaining: number;
  nextRenewalDate: Date | null;
  subscriptionStatus: string;
  isSubscriptionActive: boolean;
  status: CompanyStatus;
  isActive: boolean;
  fullInfo: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(company: Company) {
    this.id = company.id;
    this.name = company.name;
    this.ruc = company.ruc;
    this.address = company.address;
    this.phone = company.phone;
    this.email = company.email;
    this.contactPerson = company.contactPerson;
    this.subscriptionId = company.subscriptionId;
    this.subscription = company.subscription 
      ? new SubscriptionResponseDto(company.subscription)
      : null;
    this.subscriptionStartDate = company.subscriptionStartDate;
    this.subscriptionEndDate = company.subscriptionEndDate;
    this.daysRemaining = company.getDaysRemaining();
    this.nextRenewalDate = company.getNextRenewalDate();
    this.subscriptionStatus = company.getSubscriptionStatus();
    this.isSubscriptionActive = company.isSubscriptionActive();
    this.status = company.status;
    this.isActive = company.isActive;
    this.fullInfo = company.getFullInfo();
    this.createdAt = company.createdAt;
    this.updatedAt = company.updatedAt;
  }
}

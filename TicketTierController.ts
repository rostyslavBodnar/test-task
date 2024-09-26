import { Controller, Post, Body } from '@nestjs/common';
import { TicketTierService } from './ticket-tier.service';

@Controller('ticket-tier')
export class TicketTierController {
  constructor(private readonly ticketTierService: TicketTierService) {}

  @Post('calculate')
  async calculateTier(@Body() body: { buyerPrice?: number; promoterReceivesPrice?: number }) {
    const { buyerPrice, promoterReceivesPrice } = body;
    return this.ticketTierService.calculateTier(buyerPrice, promoterReceivesPrice);
  }
}

import { PrismaService } from './prisma.service';

export class TicketTierService {
  constructor(private readonly prisma: PrismaService) {}

  async calculateTier(buyerPrice?: number, promoterReceivesPrice?: number): Promise<any> {

    const feeSettings = await this.prisma.feeSettings.findFirst();
    const { serviceFeeRate, minimumFee } = feeSettings;

    let serviceFee;
    let calculatedBuyerPrice;
    let calculatedPromoterReceivesPrice;

    if (!buyerPrice && !promoterReceivesPrice) {
      throw new Error('Either buyerPrice or promoterReceivesPrice must be provided');
    }

    if (buyerPrice) {
      serviceFee = Math.max((serviceFeeRate / 100) * buyerPrice, minimumFee);
      calculatedPromoterReceivesPrice = buyerPrice - serviceFee;
    } 

    if (promoterReceivesPrice) {
      serviceFee = Math.max((serviceFeeRate / 100) * (promoterReceivesPrice + minimumFee), minimumFee);
      calculatedBuyerPrice = promoterReceivesPrice + serviceFee;
    } 
  
    return this.prisma.ticketTier.create({
      data: {
        buyerPrice: buyerPrice || calculatedBuyerPrice,
        promoterReceivesPrice: promoterReceivesPrice || calculatedPromoterReceivesPrice,
        serviceFee,
      },
    });
  }
}

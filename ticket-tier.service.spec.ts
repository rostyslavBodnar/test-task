import { Test, TestingModule } from '@nestjs/testing';
import { TicketTierService } from './ticket-tier.service';
import { PrismaService } from './prisma.service';

describe('TicketTierService', () => {
  let service: TicketTierService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TicketTierService, PrismaService],
    }).compile();

    service = module.get<TicketTierService>(TicketTierService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should calculate correct service fee and promoter receives price', async () => {
    jest.spyOn(prisma.feeSettings, 'findFirst').mockResolvedValue({
      id: 1,
      serviceFeeRate: 10,
      minimumFee: 5,
    });

    const result = await service.calculateTier(100);

    expect(result.serviceFee).toEqual(10);
    expect(result.promoterReceivesPrice).toEqual(90);
  });

  it('should enforce the minimum fee', async () => {
    jest.spyOn(prisma.feeSettings, 'findFirst').mockResolvedValue({
      id: 1,
      serviceFeeRate: 1,
      minimumFee: 5,
    });

    const result = await service.calculateTier(50);

    expect(result.serviceFee).toEqual(5);
    expect(result.promoterReceivesPrice).toEqual(45);
  });
});

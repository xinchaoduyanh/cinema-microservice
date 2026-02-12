import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Promotion, DiscountType } from '../../data-access/promotion/promotion.entity';
import { BaseRepository } from '../../data-access/base.repository';
import { CreatePromotionDto } from './promotion.dto';

@Injectable()
export class PromotionService {
  constructor(
    @InjectRepository(Promotion)
    private readonly promotionRepository: BaseRepository<Promotion>,
  ) {}

  async create(createPromotionDto: CreatePromotionDto) {
    const promotion = new Promotion({
      ...createPromotionDto,
      discountType: createPromotionDto.discountType as DiscountType,
    });
    await this.promotionRepository.getEntityManager().persistAndFlush(promotion);
    return promotion;
  }

  async validateCode(code: string, amount: number) {
    const promotion = await this.promotionRepository.findOne({ 
      code, 
      isActive: true,
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() },
    });

    if (!promotion) {
      throw new BadRequestException('Invalid or expired promotion code');
    }

    if (promotion.minimumOrderValue && amount < promotion.minimumOrderValue) {
      throw new BadRequestException(`Minimum order value for this promotion is ${promotion.minimumOrderValue}`);
    }

    let discount = 0;
    if (promotion.discountType === DiscountType.PERCENTAGE) {
      discount = (amount * promotion.discountValue) / 100;
    } else {
      discount = promotion.discountValue;
    }

    return {
      promotionId: promotion.id,
      discountAmount: Math.min(discount, amount),
    };
  }

  async findAll() {
    return this.promotionRepository.findAll();
  }
}

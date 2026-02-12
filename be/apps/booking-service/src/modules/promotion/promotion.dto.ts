export class CreatePromotionDto {
  code: string;
  name: string;
  description?: string;
  discountType: string; // PERCENTAGE, FIXED_AMOUNT
  discountValue: number;
  startDate: Date;
  endDate: Date;
  minimumOrderValue?: number;
}

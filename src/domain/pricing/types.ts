export type Money = number;

export type CartLine = {
  productId: string;
  unitPrice: Money;
  quantity: number;
  category?: string;
};

export type Coupon =
  | {
      type: "percent";
      percent: number; // 0~100
      maxDiscount?: Money;
      minSubtotal?: Money;
      eligibleCategories?: string[];
    }
  | {
      type: "fixed";
      amount: Money;
      maxDiscount?: Money;
      minSubtotal?: Money;
      eligibleCategories?: string[];
    };

export type PricingRules = {
  freeShippingThreshold: Money; // 할인 적용 후 기준
  baseShippingFee: Money;
  maxPointRate: number; // 0~1, 예: 0.2 = 결제금액의 20%까지 포인트 사용
};

export type PricingContext = {
  now: Date;
  coupon?: Coupon;
  pointBalance: Money;
  pointsToUse?: Money; // 사용 희망 포인트(없으면 0)
};

export type AppliedPromotion =
  | {
      kind: "coupon";
      discount: Money;
      description: string;
    }
  | {
      kind: "freeShipping";
      discount: Money;
      description: string;
    }
  | {
      kind: "points";
      discount: Money;
      description: string;
    };

export type OrderSummary = {
  subtotal: Money;
  discountTotal: Money;
  couponDiscount: Money;
  pointsDiscount: Money;
  shippingFee: Money;
  grandTotal: Money;
  appliedPromotions: AppliedPromotion[];
  warnings: string[];
};

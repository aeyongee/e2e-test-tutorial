import type { Coupon, PricingRules } from "./types";

export const defaultPricingRules: PricingRules = {
  freeShippingThreshold: 50_000,
  baseShippingFee: 3_000,
  maxPointRate: 0.2,
};

export const percentCoupon = (payload: {
  percent: number;
  maxDiscount?: number;
  minSubtotal?: number;
  eligibleCategories?: string[];
}): Coupon => ({
  type: "percent",
  ...payload,
});

export const fixedCoupon = (payload: {
  amount: number;
  maxDiscount?: number;
  minSubtotal?: number;
  eligibleCategories?: string[];
}): Coupon => ({
  type: "fixed",
  ...payload,
});

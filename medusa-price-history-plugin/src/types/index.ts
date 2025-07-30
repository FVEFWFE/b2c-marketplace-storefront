export interface PriceHistoryPluginOptions {
  enableAutoUpdate?: boolean;
  updateInterval?: number; // hours
  priceConstraints?: {
    minDiscountPercent?: number;
    maxDiscountPercent?: number;
    maxDailyChangePercent?: number;
  };
  priceIncrements?: {
    under100?: number;
    under500?: number;
    under1000?: number;
    over1000?: number;
  };
  cacheConfig?: {
    ttl?: number; // seconds
    enabled?: boolean;
  };
}

export const DEFAULT_OPTIONS: PriceHistoryPluginOptions = {
  enableAutoUpdate: true,
  updateInterval: 24,
  priceConstraints: {
    minDiscountPercent: 10,
    maxDiscountPercent: 70,
    maxDailyChangePercent: 15
  },
  priceIncrements: {
    under100: 5,
    under500: 25,
    under1000: 50,
    over1000: 100
  },
  cacheConfig: {
    ttl: 3600, // 1 hour
    enabled: true
  }
};

export enum PricePattern {
  STABLE = "stable",
  VOLATILE = "volatile",
  DECLINING = "declining"
}

export enum ChangeReason {
  SCHEDULED = "scheduled",
  MANUAL = "manual",
  COMPETITOR = "competitor",
  INVENTORY = "inventory",
  SEASONAL = "seasonal"
}

export interface PriceHistoryMetadata {
  previousPrice?: number;
  discountPercentage?: number;
  competitorPrice?: number;
  inventoryLevel?: number;
  seasonalFactor?: number;
}
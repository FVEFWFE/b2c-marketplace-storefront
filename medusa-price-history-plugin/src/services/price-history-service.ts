import {
  MedusaService,
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
} from "@medusajs/framework/utils";
import { 
  PriceHistoryPluginOptions, 
  DEFAULT_OPTIONS, 
  ChangeReason,
  PricePattern,
  PriceHistoryMetadata 
} from "../types";
import PriceHistory from "../models/price-history";

type InjectedDependencies = {
  options: PriceHistoryPluginOptions;
  productModuleService: any;
  vendorModuleService: any;
  cacheService: any;
  query: any;
};

export default class PriceHistoryService extends MedusaService({
  PriceHistory,
}) {
  protected options_: PriceHistoryPluginOptions;
  protected productModuleService_: any;
  protected vendorModuleService_: any;
  protected cacheService_: any;
  protected query_: any;

  constructor({
    options,
    productModuleService,
    vendorModuleService,
    cacheService,
    query,
  }: InjectedDependencies) {
    super(...arguments);
    this.options_ = { ...DEFAULT_OPTIONS, ...options };
    this.productModuleService_ = productModuleService;
    this.vendorModuleService_ = vendorModuleService;
    this.cacheService_ = cacheService;
    this.query_ = query;
  }

  /**
   * Record a new price history entry
   */
  @InjectTransactionManager()
  async recordPriceChange(
    productId: string,
    vendorId: string,
    price: number,
    retailPrice: number,
    currencyCode: string,
    changeReason: ChangeReason = ChangeReason.SCHEDULED,
    metadata?: PriceHistoryMetadata,
    @MedusaContext() sharedContext?: any
  ) {
    const priceHistory = await this.createPriceHistory(
      {
        product_id: productId,
        vendor_id: vendorId,
        price,
        retail_price: retailPrice,
        currency_code: currencyCode,
        change_reason: changeReason,
        metadata,
        recorded_at: new Date(),
      },
      sharedContext
    );

    // Invalidate cache for this product
    await this.invalidatePriceHistoryCache(productId);

    return priceHistory;
  }

  /**
   * Get price history for a product with optional vendor filtering
   */
  async getPriceHistory(
    productId: string,
    options: {
      vendorId?: string;
      days?: number;
      limit?: number;
    } = {}
  ) {
    const { vendorId, days = 90, limit } = options;
    
    // Check cache first
    const cacheKey = `price_history:${productId}:${vendorId || 'all'}:${days}`;
    if (this.options_.cacheConfig?.enabled) {
      const cached = await this.cacheService_.get(cacheKey);
      if (cached) {
        return cached;
      }
    }

    const filters: any = {
      product_id: productId,
      recorded_at: {
        $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
      },
    };

    if (vendorId) {
      filters.vendor_id = vendorId;
    }

    const history = await this.listPriceHistory(
      filters,
      {
        order: {
          recorded_at: "DESC",
        },
        take: limit,
      }
    );

    // Cache the result
    if (this.options_.cacheConfig?.enabled) {
      await this.cacheService_.set(
        cacheKey,
        history,
        this.options_.cacheConfig.ttl
      );
    }

    return history;
  }

  /**
   * Validate a price change against configured constraints
   */
  async validatePriceChange(
    product: any,
    newPrice: number,
    retailPrice: number
  ): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];
    const constraints = this.options_.priceConstraints!;

    // Check discount percentage
    const discountPercent = ((retailPrice - newPrice) / retailPrice) * 100;
    if (discountPercent < constraints.minDiscountPercent!) {
      errors.push(
        `Discount ${discountPercent.toFixed(2)}% is below minimum ${constraints.minDiscountPercent}%`
      );
    }
    if (discountPercent > constraints.maxDiscountPercent!) {
      errors.push(
        `Discount ${discountPercent.toFixed(2)}% exceeds maximum ${constraints.maxDiscountPercent}%`
      );
    }

    // Check daily change percentage
    if (product.variants?.[0]?.calculated_price?.calculated_amount) {
      const currentPrice = product.variants[0].calculated_price.calculated_amount;
      const changePercent = Math.abs((newPrice - currentPrice) / currentPrice) * 100;
      
      if (changePercent > constraints.maxDailyChangePercent!) {
        errors.push(
          `Price change ${changePercent.toFixed(2)}% exceeds maximum daily change ${constraints.maxDailyChangePercent}%`
        );
      }
    }

    // Check price increments
    const increment = this.getPriceIncrement(newPrice);
    if (newPrice % increment !== 0) {
      errors.push(
        `Price $${newPrice} must be in increments of $${increment}`
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Calculate next price based on pattern and constraints
   */
  calculateNextPrice(
    currentPrice: number,
    retailPrice: number,
    pattern: PricePattern,
    metadata?: any
  ): number {
    const constraints = this.options_.priceConstraints!;
    const minPrice = retailPrice * (1 - constraints.maxDiscountPercent! / 100);
    const maxPrice = retailPrice * (1 - constraints.minDiscountPercent! / 100);
    
    let newPrice = currentPrice;
    const maxChange = currentPrice * (constraints.maxDailyChangePercent! / 100);

    switch (pattern) {
      case PricePattern.STABLE:
        // Small random variations within 5%
        const stableVariation = (Math.random() - 0.5) * 0.1;
        newPrice = currentPrice * (1 + stableVariation);
        break;

      case PricePattern.VOLATILE:
        // Larger variations within max daily change
        const volatileVariation = (Math.random() - 0.5) * 2;
        newPrice = currentPrice + (volatileVariation * maxChange);
        break;

      case PricePattern.DECLINING:
        // Gradually decrease price
        const declineRate = 0.02 + Math.random() * 0.03; // 2-5% decline
        newPrice = currentPrice * (1 - declineRate);
        break;
    }

    // Apply seasonal factors if provided
    if (metadata?.seasonalFactor) {
      newPrice *= metadata.seasonalFactor;
    }

    // Ensure price stays within bounds
    newPrice = Math.max(minPrice, Math.min(maxPrice, newPrice));

    // Round to appropriate increment
    const increment = this.getPriceIncrement(newPrice);
    newPrice = Math.round(newPrice / increment) * increment;

    return newPrice;
  }

  /**
   * Get price increment based on price range
   */
  private getPriceIncrement(price: number): number {
    const increments = this.options_.priceIncrements!;
    
    if (price < 100) return increments.under100!;
    if (price < 500) return increments.under500!;
    if (price < 1000) return increments.under1000!;
    return increments.over1000!;
  }

  /**
   * Generate historical price data for a new product
   */
  async generateHistoricalData(
    productId: string,
    vendorId: string,
    currentPrice: number,
    retailPrice: number,
    currencyCode: string,
    pattern: PricePattern = PricePattern.STABLE,
    days: number = 90
  ) {
    const histories = [];
    let price = currentPrice;

    // Generate prices backwards from today
    for (let i = days; i >= 0; i--) {
      const recordedAt = new Date();
      recordedAt.setDate(recordedAt.getDate() - i);

      // Add some randomness to historical prices
      price = this.calculateNextPrice(price, retailPrice, pattern);

      histories.push({
        product_id: productId,
        vendor_id: vendorId,
        price,
        retail_price: retailPrice,
        currency_code: currencyCode,
        recorded_at: recordedAt,
        change_reason: ChangeReason.SCHEDULED,
        metadata: {
          discountPercentage: ((retailPrice - price) / retailPrice) * 100,
        },
      });
    }

    // Batch create historical entries
    await this.createPriceHistory(histories);

    return histories;
  }

  /**
   * Get price statistics for a product
   */
  async getPriceStatistics(
    productId: string,
    vendorId?: string,
    days: number = 90
  ) {
    const history = await this.getPriceHistory(productId, { vendorId, days });

    if (!history.length) {
      return null;
    }

    const prices = history.map((h) => Number(h.price));
    const currentPrice = prices[0];
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;

    // Find lowest price date
    const lowestPriceEntry = history.find((h) => Number(h.price) === minPrice);
    const daysSinceLowest = lowestPriceEntry
      ? Math.floor(
          (Date.now() - new Date(lowestPriceEntry.recorded_at).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

    return {
      currentPrice,
      minPrice,
      maxPrice,
      avgPrice,
      currentDiscount: history[0].metadata?.discountPercentage || 0,
      daysSinceLowest,
      isLowestPrice: currentPrice === minPrice,
      priceRange: maxPrice - minPrice,
      volatility: this.calculateVolatility(prices),
    };
  }

  /**
   * Calculate price volatility
   */
  private calculateVolatility(prices: number[]): number {
    if (prices.length < 2) return 0;

    const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
    const variance =
      prices.reduce((acc, price) => acc + Math.pow(price - mean, 2), 0) /
      prices.length;
    
    return Math.sqrt(variance) / mean; // Coefficient of variation
  }

  /**
   * Invalidate cache for a product's price history
   */
  private async invalidatePriceHistoryCache(productId: string) {
    if (!this.options_.cacheConfig?.enabled) return;

    // Invalidate all cache entries for this product
    const patterns = [
      `price_history:${productId}:*`,
    ];

    for (const pattern of patterns) {
      await this.cacheService_.invalidate(pattern);
    }
  }

  /**
   * Get products needing price updates
   */
  async getProductsForPriceUpdate(
    vendorId?: string,
    limit: number = 100
  ) {
    const hoursAgo = this.options_.updateInterval!;
    const cutoffTime = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);

    const filters: any = {
      $or: [
        { last_price_update: { $lt: cutoffTime } },
        { last_price_update: null },
      ],
    };

    // Use Query to fetch products with vendor filtering
    const query = {
      filters,
      take: limit,
    };

    if (vendorId) {
      query.filters.vendor_id = vendorId;
    }

    const { data: products } = await this.query_.graph({
      entity: "product",
      fields: [
        "id",
        "title",
        "variants.calculated_price.*",
        "retail_price",
        "price_pattern",
        "vendor_id",
      ],
      filters: query.filters,
      pagination: {
        take: query.take,
      },
    });

    return products;
  }
}
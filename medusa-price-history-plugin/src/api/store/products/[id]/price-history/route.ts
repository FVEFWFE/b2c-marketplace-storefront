import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { z } from "zod";
import { 
  priceHistoryRateLimit, 
  cacheMiddleware 
} from "../../../../middlewares";

// Query parameters schema
const QuerySchema = z.object({
  days: z.coerce.number().min(1).max(365).default(90),
  limit: z.coerce.number().min(1).max(1000).optional(),
});

export const GET = [
  priceHistoryRateLimit,
  cacheMiddleware,
  async (req: MedusaRequest, res: MedusaResponse) => {
    try {
      const { id } = req.params;
      const queryParams = QuerySchema.parse(req.query);

      const priceHistoryService = req.scope.resolve("priceHistoryService");
      const productModuleService = req.scope.resolve("productModuleService");

      // Verify product exists
      const product = await productModuleService.retrieveProduct(id);
      if (!product) {
        return res.status(404).json({
          error: "Product not found",
          productId: id,
        });
      }

      // Get price history
      const history = await priceHistoryService.getPriceHistory(id, {
        days: queryParams.days,
        limit: queryParams.limit,
      });

      // Get statistics
      const statistics = await priceHistoryService.getPriceStatistics(
        id,
        undefined,
        queryParams.days
      );

      // Format response
      const response = {
        product_id: id,
        currency_code: history[0]?.currency_code || product.variants?.[0]?.prices?.[0]?.currency_code || "USD",
        days: queryParams.days,
        history: history.map((h: any) => ({
          price: Number(h.price),
          retail_price: Number(h.retail_price),
          recorded_at: h.recorded_at,
          discount_percentage: h.metadata?.discountPercentage || 0,
          change_reason: h.change_reason,
        })),
        statistics: statistics ? {
          current_price: statistics.currentPrice,
          min_price: statistics.minPrice,
          max_price: statistics.maxPrice,
          avg_price: statistics.avgPrice,
          current_discount: statistics.currentDiscount,
          current_savings: Number(history[0]?.retail_price || 0) - statistics.currentPrice,
          is_lowest_price: statistics.isLowestPrice,
          days_since_lowest: statistics.daysSinceLowest,
          price_volatility: statistics.volatility,
        } : null,
        metadata: {
          retail_price: Number(history[0]?.retail_price || product.retail_price || 0),
          price_pattern: product.price_pattern,
          last_update: product.last_price_update,
          total_records: history.length,
        },
      };

      res.json(response);
    } catch (error: any) {
      const statusCode = error.name === "ZodError" ? 400 : 500;
      res.status(statusCode).json({
        error: error.name || "Internal Server Error",
        message: error.message,
        details: error.errors || undefined,
      });
    }
  },
];
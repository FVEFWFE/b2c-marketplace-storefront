import {
  createWorkflow,
  WorkflowResponse,
  createStep,
  StepResponse,
  transform,
} from "@medusajs/framework/workflows-sdk";
import { PricePattern } from "../../types";

interface SeedPriceHistoryInput {
  productId: string;
  vendorId: string;
  currentPrice: number;
  retailPrice?: number;
  currencyCode?: string;
  pattern?: PricePattern;
  days?: number;
}

// Step to validate product and get details
const validateProductStep = createStep(
  "validate-product-for-seeding",
  async (input: SeedPriceHistoryInput, { container }) => {
    const productModuleService = container.resolve("productModuleService");
    const query = container.resolve("query");
    
    // Fetch product with vendor info
    const { data: products } = await query.graph({
      entity: "product",
      fields: [
        "id",
        "title",
        "vendor_id",
        "retail_price",
        "price_pattern",
        "variants.calculated_price.*",
      ],
      filters: {
        id: input.productId,
      },
    });

    if (!products || products.length === 0) {
      throw new Error(`Product ${input.productId} not found`);
    }

    const product = products[0];

    // Verify vendor ownership
    if (product.vendor_id !== input.vendorId) {
      throw new Error(`Product ${input.productId} does not belong to vendor ${input.vendorId}`);
    }

    // Get retail price from product or use provided or calculate default
    const retailPrice = input.retailPrice || 
                       product.retail_price || 
                       (input.currentPrice * 1.5); // 50% markup default

    // Get currency from variant or use provided
    const currencyCode = input.currencyCode || 
                        product.variants[0]?.calculated_price?.currency_code || 
                        "USD";

    // Get pattern from product or use provided
    const pattern = input.pattern || product.price_pattern || PricePattern.STABLE;

    return new StepResponse({
      productId: product.id,
      vendorId: product.vendor_id,
      currentPrice: input.currentPrice,
      retailPrice,
      currencyCode,
      pattern,
      days: input.days || 90,
    });
  },
  async (data, { container }) => {
    // Compensation: Log validation cancelled
    const logger = container.resolve("logger");
    logger.info("Price history seeding validation cancelled", { productId: data.productId });
  }
);

// Step to check if history already exists
const checkExistingHistoryStep = createStep(
  "check-existing-price-history",
  async (input: any, { container }) => {
    const priceHistoryService = container.resolve("priceHistoryService");
    
    // Check if there's already history for this product
    const existingHistory = await priceHistoryService.getPriceHistory(
      input.productId,
      {
        vendorId: input.vendorId,
        days: input.days,
        limit: 1,
      }
    );

    if (existingHistory && existingHistory.length > 0) {
      throw new Error(
        `Price history already exists for product ${input.productId}. ` +
        `Use force option to regenerate.`
      );
    }

    return new StepResponse(input);
  },
  async (input, { container }) => {
    // No compensation needed for check
  }
);

// Step to generate and save historical data
const generateHistoricalDataStep = createStep(
  "generate-historical-price-data",
  async (input: any, { container }) => {
    const priceHistoryService = container.resolve("priceHistoryService");
    
    // Generate historical data
    const historyRecords = await priceHistoryService.generateHistoricalData(
      input.productId,
      input.vendorId,
      input.currentPrice,
      input.retailPrice,
      input.currencyCode,
      input.pattern,
      input.days
    );

    return new StepResponse(historyRecords, { 
      productId: input.productId,
      recordIds: historyRecords.map((r: any) => r.id),
    });
  },
  async ({ productId, recordIds }, { container }) => {
    // Compensation: Delete all created history records
    const priceHistoryService = container.resolve("priceHistoryService");
    const logger = container.resolve("logger");

    logger.info("Removing seeded price history records", { 
      productId,
      count: recordIds.length,
    });

    // Delete in batches
    const batchSize = 50;
    for (let i = 0; i < recordIds.length; i += batchSize) {
      const batch = recordIds.slice(i, i + batchSize);
      
      await Promise.all(
        batch.map((id: string) => 
          priceHistoryService.deletePriceHistory(id).catch((error: any) => {
            logger.error("Failed to delete history record", { id, error: error.message });
          })
        )
      );
    }
  }
);

// Step to update product metadata
const updateProductMetadataStep = createStep(
  "update-product-price-metadata",
  async (input: any, { container }) => {
    const productModuleService = container.resolve("productModuleService");
    
    // Update product with price pattern and last update timestamp
    await productModuleService.updateProducts(input.productId, {
      retail_price: input.retailPrice,
      price_pattern: input.pattern,
      last_price_update: new Date(),
    });

    return new StepResponse({
      productId: input.productId,
      updated: true,
    });
  },
  async ({ productId }, { container }) => {
    // Compensation: Clear the metadata updates
    const productModuleService = container.resolve("productModuleService");
    const logger = container.resolve("logger");

    logger.info("Reverting product metadata updates", { productId });

    try {
      await productModuleService.updateProducts(productId, {
        retail_price: null,
        last_price_update: null,
      });
    } catch (error: any) {
      logger.error("Failed to revert product metadata", { 
        productId, 
        error: error.message,
      });
    }
  }
);

// Main workflow
export const seedPriceHistoryWorkflow = createWorkflow(
  "seed-price-history",
  (input: SeedPriceHistoryInput) => {
    // Validate product and prepare data
    const validatedData = validateProductStep(input);

    // Check for existing history
    const checkedData = checkExistingHistoryStep(validatedData);

    // Generate historical data
    const historyRecords = generateHistoricalDataStep(checkedData);

    // Update product metadata
    const updateResult = updateProductMetadataStep(checkedData);

    // Return summary
    return new WorkflowResponse(
      transform(
        { data: checkedData, history: historyRecords, update: updateResult },
        ({ data, history, update }) => ({
          productId: data.productId,
          vendorId: data.vendorId,
          recordsCreated: history.length,
          daysGenerated: data.days,
          pattern: data.pattern,
          priceRange: {
            min: Math.min(...history.map((h: any) => Number(h.price))),
            max: Math.max(...history.map((h: any) => Number(h.price))),
            current: data.currentPrice,
            retail: data.retailPrice,
          },
          metadata: {
            currencyCode: data.currencyCode,
            updated: update.updated,
          },
        })
      )
    );
  }
);
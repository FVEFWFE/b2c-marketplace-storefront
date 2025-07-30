import {
  createWorkflow,
  WorkflowResponse,
  createStep,
  StepResponse,
  transform,
  parallelize,
} from "@medusajs/framework/workflows-sdk";
import { ChangeReason } from "../../types";

interface UpdateProductPricesInput {
  vendorId?: string;
  productIds?: string[];
  batchSize?: number;
}

interface PriceUpdateResult {
  productId: string;
  oldPrice: number;
  newPrice: number;
  success: boolean;
  error?: string;
}

// Step to fetch products needing price updates
const fetchProductsStep = createStep(
  "fetch-products-for-price-update",
  async (input: UpdateProductPricesInput, { container }) => {
    const priceHistoryService = container.resolve("priceHistoryService");
    
    const products = await priceHistoryService.getProductsForPriceUpdate(
      input.vendorId,
      input.batchSize || 100
    );

    // Filter by specific product IDs if provided
    const filteredProducts = input.productIds
      ? products.filter((p: any) => input.productIds!.includes(p.id))
      : products;

    return new StepResponse(filteredProducts, products);
  },
  async (products, { container }) => {
    // Compensation: Log that update was cancelled
    const logger = container.resolve("logger");
    logger.info("Price update workflow cancelled", {
      productCount: products.length,
    });
  }
);

// Step to calculate new prices
const calculateNewPricesStep = createStep(
  "calculate-new-prices",
  async (products: any[], { container }) => {
    const priceHistoryService = container.resolve("priceHistoryService");
    
    const priceUpdates = await Promise.all(
      products.map(async (product) => {
        try {
          const currentPrice = product.variants[0]?.calculated_price?.calculated_amount || 0;
          const retailPrice = product.retail_price || currentPrice * 1.5; // Default to 50% markup
          
          const newPrice = priceHistoryService.calculateNextPrice(
            currentPrice,
            retailPrice,
            product.price_pattern,
            {
              inventoryLevel: product.variants[0]?.inventory_quantity,
              seasonalFactor: 1.0, // Could be enhanced with seasonal logic
            }
          );

          // Validate the new price
          const validation = await priceHistoryService.validatePriceChange(
            product,
            newPrice,
            retailPrice
          );

          if (!validation.isValid) {
            throw new Error(validation.errors.join(", "));
          }

          return {
            productId: product.id,
            variantId: product.variants[0].id,
            vendorId: product.vendor_id,
            oldPrice: currentPrice,
            newPrice,
            retailPrice,
            currencyCode: product.variants[0].calculated_price?.currency_code || "USD",
          };
        } catch (error: any) {
          return {
            productId: product.id,
            error: error.message,
          };
        }
      })
    );

    const validUpdates = priceUpdates.filter((u) => !u.error);
    
    return new StepResponse(validUpdates, priceUpdates);
  },
  async (priceUpdates, { container }) => {
    // Compensation: Log calculated prices that won't be applied
    const logger = container.resolve("logger");
    logger.info("Price calculations cancelled", {
      updateCount: priceUpdates.length,
    });
  }
);

// Step to update product prices
const updateProductPricesStep = createStep(
  "update-product-prices",
  async (priceUpdates: any[], { container }) => {
    const productModuleService = container.resolve("productModuleService");
    const results: PriceUpdateResult[] = [];

    // Update prices in batches to avoid overwhelming the system
    const batchSize = 10;
    for (let i = 0; i < priceUpdates.length; i += batchSize) {
      const batch = priceUpdates.slice(i, i + batchSize);
      
      const batchResults = await Promise.all(
        batch.map(async (update) => {
          try {
            // Update variant price
            await productModuleService.updateVariants(update.variantId, {
              prices: [
                {
                  amount: update.newPrice,
                  currency_code: update.currencyCode,
                },
              ],
            });

            // Update product metadata
            await productModuleService.updateProducts(update.productId, {
              last_price_update: new Date(),
            });

            return {
              productId: update.productId,
              oldPrice: update.oldPrice,
              newPrice: update.newPrice,
              success: true,
            };
          } catch (error: any) {
            return {
              productId: update.productId,
              oldPrice: update.oldPrice,
              newPrice: update.newPrice,
              success: false,
              error: error.message,
            };
          }
        })
      );

      results.push(...batchResults);
    }

    return new StepResponse(results, { priceUpdates, results });
  },
  async ({ priceUpdates, results }, { container }) => {
    // Compensation: Revert prices to original values
    const productModuleService = container.resolve("productModuleService");
    const logger = container.resolve("logger");

    logger.info("Reverting price updates", { count: results.length });

    for (const update of priceUpdates) {
      try {
        await productModuleService.updateVariants(update.variantId, {
          prices: [
            {
              amount: update.oldPrice,
              currency_code: update.currencyCode,
            },
          ],
        });
      } catch (error: any) {
        logger.error("Failed to revert price", {
          productId: update.productId,
          error: error.message,
        });
      }
    }
  }
);

// Step to record price history
const recordPriceHistoryStep = createStep(
  "record-price-history",
  async (input: { priceUpdates: any[]; results: PriceUpdateResult[] }, { container }) => {
    const priceHistoryService = container.resolve("priceHistoryService");
    const historyRecords = [];

    for (const update of input.priceUpdates) {
      const result = input.results.find((r) => r.productId === update.productId);
      
      if (result?.success) {
        try {
          const history = await priceHistoryService.recordPriceChange(
            update.productId,
            update.vendorId,
            update.newPrice,
            update.retailPrice,
            update.currencyCode,
            ChangeReason.SCHEDULED,
            {
              previousPrice: update.oldPrice,
              discountPercentage: ((update.retailPrice - update.newPrice) / update.retailPrice) * 100,
            }
          );
          
          historyRecords.push(history);
        } catch (error: any) {
          // Log error but don't fail the workflow
          const logger = container.resolve("logger");
          logger.error("Failed to record price history", {
            productId: update.productId,
            error: error.message,
          });
        }
      }
    }

    return new StepResponse(historyRecords);
  },
  async (historyRecords, { container }) => {
    // Compensation: Delete created history records
    const priceHistoryService = container.resolve("priceHistoryService");
    const logger = container.resolve("logger");

    logger.info("Removing price history records", { count: historyRecords.length });

    for (const record of historyRecords) {
      try {
        await priceHistoryService.deletePriceHistory(record.id);
      } catch (error: any) {
        logger.error("Failed to delete history record", {
          id: record.id,
          error: error.message,
        });
      }
    }
  }
);

// Main workflow
export const updateProductPricesWorkflow = createWorkflow(
  "update-product-prices",
  (input: UpdateProductPricesInput) => {
    // Fetch products that need updates
    const products = fetchProductsStep(input);

    // Calculate new prices for all products
    const priceUpdates = calculateNewPricesStep(products);

    // Update product prices and record history in parallel
    const updateResults = updateProductPricesStep(priceUpdates);
    
    // Transform data for history recording
    const historyInput = transform(
      { priceUpdates, results: updateResults },
      (data) => ({
        priceUpdates: data.priceUpdates,
        results: data.results,
      })
    );

    // Record price history
    const historyRecords = recordPriceHistoryStep(historyInput);

    // Return summary
    return new WorkflowResponse(
      transform(
        { results: updateResults, historyRecords },
        (data) => ({
          totalProcessed: data.results.length,
          successful: data.results.filter((r: PriceUpdateResult) => r.success).length,
          failed: data.results.filter((r: PriceUpdateResult) => !r.success).length,
          results: data.results,
          historyRecorded: data.historyRecords.length,
        })
      )
    );
  }
);
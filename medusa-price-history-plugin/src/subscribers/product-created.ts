import { 
  SubscriberArgs, 
  SubscriberConfig,
} from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";
import { seedPriceHistoryWorkflow } from "../workflows/seed-price-history";
import { PricePattern } from "../types";

type ProductCreatedEvent = {
  id: string;
  vendor_id?: string;
};

export default async function handleProductCreated({
  event,
  container,
}: SubscriberArgs<{ data: ProductCreatedEvent }>) {
  const logger = container.resolve(Modules.LOGGER);
  const productModuleService = container.resolve("productModuleService");
  
  const productId = event.data.id;
  
  logger.info("New product created, seeding price history", { productId });

  try {
    // Get full product details
    const product = await productModuleService.retrieveProduct(productId, {
      relations: ["variants", "variants.prices"],
    });

    if (!product.variants || product.variants.length === 0) {
      logger.info("Product has no variants, skipping price history seed", { productId });
      return;
    }

    const variant = product.variants[0];
    const currentPrice = variant.prices?.[0]?.amount;

    if (!currentPrice) {
      logger.info("Product variant has no price, skipping price history seed", { productId });
      return;
    }

    // Determine price pattern based on product category or other factors
    // This is a simple example - you might want more sophisticated logic
    const pricePattern = determineInitialPricePattern(product);

    // Run seed workflow
    const { result } = await seedPriceHistoryWorkflow(container).run({
      input: {
        productId: product.id,
        vendorId: product.vendor_id || "system",
        currentPrice: Number(currentPrice),
        retailPrice: product.retail_price,
        currencyCode: variant.prices[0].currency_code,
        pattern: pricePattern,
        days: 90, // Generate 90 days of history
      },
    });

    logger.info("Price history seeded successfully", {
      productId,
      recordsCreated: result.recordsCreated,
      pattern: result.pattern,
    });
  } catch (error: any) {
    logger.error("Failed to seed price history for new product", {
      productId,
      error: error.message,
      stack: error.stack,
    });
    
    // Don't throw - we don't want to fail product creation
  }
}

function determineInitialPricePattern(product: any): PricePattern {
  // Simple logic - can be enhanced based on your business rules
  
  // High-value products tend to be more stable
  const firstPrice = product.variants?.[0]?.prices?.[0]?.amount || 0;
  if (Number(firstPrice) > 1000) {
    return PricePattern.STABLE;
  }
  
  // Electronics might be more volatile
  if (product.categories?.some((c: any) => 
    c.name?.toLowerCase().includes("electronics") ||
    c.name?.toLowerCase().includes("tech")
  )) {
    return PricePattern.VOLATILE;
  }
  
  // Seasonal items might have declining patterns
  if (product.categories?.some((c: any) => 
    c.name?.toLowerCase().includes("seasonal") ||
    c.name?.toLowerCase().includes("clearance")
  )) {
    return PricePattern.DECLINING;
  }
  
  // Default to stable
  return PricePattern.STABLE;
}

export const config: SubscriberConfig = {
  event: "product.created",
  context: {
    subscriberId: "price-history-product-created",
  },
};
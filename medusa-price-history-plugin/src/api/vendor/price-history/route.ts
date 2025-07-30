import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { z } from "zod";
import { ensureVendorContext } from "../../middlewares";
import { updateProductPricesWorkflow } from "../../../workflows/update-product-prices";
import { seedPriceHistoryWorkflow } from "../../../workflows/seed-price-history";
import { ChangeReason, PricePattern } from "../../../types";

// Schema for manual price update
const ManualPriceUpdateSchema = z.object({
  product_id: z.string(),
  price: z.number().positive(),
  retail_price: z.number().positive().optional(),
  reason: z.nativeEnum(ChangeReason).optional(),
  metadata: z.record(z.any()).optional(),
});

// Schema for seeding price history
const SeedHistorySchema = z.object({
  product_id: z.string(),
  current_price: z.number().positive(),
  retail_price: z.number().positive().optional(),
  currency_code: z.string().optional(),
  pattern: z.nativeEnum(PricePattern).optional(),
  days: z.number().min(1).max(365).optional(),
});

// Schema for bulk price update
const BulkUpdateSchema = z.object({
  product_ids: z.array(z.string()).optional(),
  batch_size: z.number().min(1).max(100).optional(),
});

/**
 * POST /vendor/price-history/update
 * Manually update a product's price
 */
export const POST = [
  ensureVendorContext,
  async (req: MedusaRequest, res: MedusaResponse) => {
    if (req.path.endsWith("/update")) {
      return handleManualUpdate(req, res);
    } else if (req.path.endsWith("/seed")) {
      return handleSeedHistory(req, res);
    } else if (req.path.endsWith("/bulk-update")) {
      return handleBulkUpdate(req, res);
    }

    res.status(404).json({ error: "Not found" });
  },
];

async function handleManualUpdate(req: MedusaRequest, res: MedusaResponse) {
  try {
    const data = ManualPriceUpdateSchema.parse(req.body);
    const { vendorId, isSuperAdmin } = req.vendorContext!;

    const priceHistoryService = req.scope.resolve("priceHistoryService");
    const productModuleService = req.scope.resolve("productModuleService");
    const query = req.scope.resolve("query");

    // Verify product ownership
    const { data: products } = await query.graph({
      entity: "product",
      fields: ["id", "vendor_id", "variants.*"],
      filters: { id: data.product_id },
    });

    if (!products || products.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    const product = products[0];

    // Check vendor ownership
    if (!isSuperAdmin && product.vendor_id !== vendorId) {
      return res.status(403).json({ 
        error: "Forbidden", 
        message: "You can only update prices for your own products" 
      });
    }

    // Validate price change
    const retailPrice = data.retail_price || product.retail_price || (data.price * 1.5);
    const validation = await priceHistoryService.validatePriceChange(
      product,
      data.price,
      retailPrice
    );

    if (!validation.isValid) {
      return res.status(400).json({
        error: "Invalid price",
        errors: validation.errors,
      });
    }

    // Update product price
    const variant = product.variants[0];
    await productModuleService.updateVariants(variant.id, {
      prices: [
        {
          amount: data.price,
          currency_code: variant.prices?.[0]?.currency_code || "USD",
        },
      ],
    });

    // Update product metadata
    await productModuleService.updateProducts(data.product_id, {
      last_price_update: new Date(),
      retail_price: retailPrice,
    });

    // Record price history
    const history = await priceHistoryService.recordPriceChange(
      data.product_id,
      product.vendor_id,
      data.price,
      retailPrice,
      variant.prices?.[0]?.currency_code || "USD",
      data.reason || ChangeReason.MANUAL,
      {
        ...data.metadata,
        updatedBy: vendorId || "super_admin",
        previousPrice: variant.prices?.[0]?.amount,
      }
    );

    res.json({
      success: true,
      product_id: data.product_id,
      new_price: data.price,
      retail_price: retailPrice,
      history_id: history.id,
    });
  } catch (error: any) {
    const statusCode = error.name === "ZodError" ? 400 : 500;
    res.status(statusCode).json({
      error: error.name || "Internal Server Error",
      message: error.message,
      details: error.errors || undefined,
    });
  }
}

async function handleSeedHistory(req: MedusaRequest, res: MedusaResponse) {
  try {
    const data = SeedHistorySchema.parse(req.body);
    const { vendorId, isSuperAdmin } = req.vendorContext!;

    // Only vendors can seed their own products
    if (!vendorId && !isSuperAdmin) {
      return res.status(403).json({ 
        error: "Forbidden", 
        message: "Vendor context required" 
      });
    }

    // Run seed workflow
    const { result } = await seedPriceHistoryWorkflow(req.scope).run({
      input: {
        productId: data.product_id,
        vendorId: vendorId || "super_admin",
        currentPrice: data.current_price,
        retailPrice: data.retail_price,
        currencyCode: data.currency_code,
        pattern: data.pattern,
        days: data.days,
      },
    });

    res.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    const statusCode = error.name === "ZodError" ? 400 : 500;
    res.status(statusCode).json({
      error: error.name || "Internal Server Error",
      message: error.message,
      details: error.errors || undefined,
    });
  }
}

async function handleBulkUpdate(req: MedusaRequest, res: MedusaResponse) {
  try {
    const data = BulkUpdateSchema.parse(req.body);
    const { vendorId, isSuperAdmin } = req.vendorContext!;

    // Run update workflow
    const { result } = await updateProductPricesWorkflow(req.scope).run({
      input: {
        vendorId: !isSuperAdmin ? vendorId : undefined,
        productIds: data.product_ids,
        batchSize: data.batch_size,
      },
    });

    res.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    const statusCode = error.name === "ZodError" ? 400 : 500;
    res.status(statusCode).json({
      error: error.name || "Internal Server Error",
      message: error.message,
      details: error.errors || undefined,
    });
  }
}

/**
 * GET /vendor/price-history/products
 * Get products with price history for a vendor
 */
export const GET = [
  ensureVendorContext,
  async (req: MedusaRequest, res: MedusaResponse) => {
    try {
      const { vendorId, isSuperAdmin } = req.vendorContext!;
      const { page = 1, limit = 20 } = req.query;

      const query = req.scope.resolve("query");
      const priceHistoryService = req.scope.resolve("priceHistoryService");

      // Build filters
      const filters: any = {};
      if (!isSuperAdmin && vendorId) {
        filters.vendor_id = vendorId;
      }

      // Get products
      const { data: products, metadata } = await query.graph({
        entity: "product",
        fields: [
          "id",
          "title",
          "vendor_id",
          "retail_price",
          "price_pattern",
          "last_price_update",
          "variants.prices.*",
        ],
        filters,
        pagination: {
          skip: (Number(page) - 1) * Number(limit),
          take: Number(limit),
        },
      });

      // Get price statistics for each product
      const productsWithStats = await Promise.all(
        products.map(async (product: any) => {
          const stats = await priceHistoryService.getPriceStatistics(
            product.id,
            product.vendor_id,
            30 // Last 30 days
          );

          return {
            id: product.id,
            title: product.title,
            vendor_id: product.vendor_id,
            current_price: product.variants?.[0]?.prices?.[0]?.amount || 0,
            retail_price: product.retail_price,
            price_pattern: product.price_pattern,
            last_price_update: product.last_price_update,
            statistics: stats,
          };
        })
      );

      res.json({
        products: productsWithStats,
        count: productsWithStats.length,
        offset: (Number(page) - 1) * Number(limit),
        limit: Number(limit),
        total: metadata?.count || 0,
      });
    } catch (error: any) {
      res.status(500).json({
        error: "Internal Server Error",
        message: error.message,
      });
    }
  },
];
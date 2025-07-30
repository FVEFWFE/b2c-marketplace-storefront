import { 
  MedusaRequest, 
  MedusaResponse, 
  MedusaNextFunction 
} from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

/**
 * Middleware to ensure vendor context is available
 */
export async function ensureVendorContext(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  try {
    // Get vendor context from authentication
    const authContext = req.scope.resolve("authContext");
    const vendorId = authContext?.vendor_id;

    if (!vendorId && !authContext?.is_super_admin) {
      return res.status(403).json({
        error: "Vendor context required",
        message: "This endpoint requires vendor authentication",
      });
    }

    // Add vendor context to request
    req.vendorContext = {
      vendorId,
      isSuperAdmin: authContext?.is_super_admin || false,
    };

    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Rate limiting middleware for price history API
 */
export async function priceHistoryRateLimit(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  try {
    const cacheService = req.scope.resolve("cacheService");
    const rateLimitKey = `rate_limit:price_history:${req.ip}`;
    const limit = 100; // requests per minute
    const window = 60; // seconds

    // Get current count
    const currentCount = await cacheService.get(rateLimitKey) || 0;

    if (currentCount >= limit) {
      return res.status(429).json({
        error: "Too Many Requests",
        message: "Rate limit exceeded. Please try again later.",
        retryAfter: window,
      });
    }

    // Increment counter
    await cacheService.set(rateLimitKey, currentCount + 1, window);

    next();
  } catch (error) {
    // Don't fail on rate limit errors, just continue
    next();
  }
}

/**
 * Cache middleware for GET requests
 */
export async function cacheMiddleware(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  // Only cache GET requests
  if (req.method !== "GET") {
    return next();
  }

  try {
    const cacheService = req.scope.resolve("cacheService");
    const cacheKey = `api_cache:${req.originalUrl}`;

    // Check cache
    const cached = await cacheService.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    // Store original json method
    const originalJson = res.json.bind(res);

    // Override json method to cache response
    res.json = function(data: any) {
      // Cache successful responses only
      if (res.statusCode === 200) {
        cacheService.set(cacheKey, data, 3600).catch(() => {
          // Log but don't fail on cache errors
        });
      }

      return originalJson(data);
    };

    next();
  } catch (error) {
    // Don't fail on cache errors
    next();
  }
}

// Extend Express Request type
declare module "@medusajs/framework/http" {
  interface MedusaRequest {
    vendorContext?: {
      vendorId?: string;
      isSuperAdmin: boolean;
    };
  }
}
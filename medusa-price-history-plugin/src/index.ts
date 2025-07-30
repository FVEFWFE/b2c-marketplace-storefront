import { 
  MedusaModule,
  MODULE_RESOURCE_TYPE,
  MODULE_SCOPE,
  registerModuleLoader,
} from "@medusajs/framework/utils";
import { PriceHistoryPluginOptions } from "./types";
import PriceHistoryService from "./services/price-history-service";
import { scheduledJobConfig } from "./subscribers/price-update-scheduler";

// Export types
export * from "./types";

// Export models
export { default as PriceHistory } from "./models/price-history";
export { productExtensions } from "./models/product-extensions";

// Export services
export { default as PriceHistoryService } from "./services/price-history-service";

// Export workflows
export { updateProductPricesWorkflow } from "./workflows/update-product-prices";
export { seedPriceHistoryWorkflow } from "./workflows/seed-price-history";

// Export admin widgets
export { ProductPriceHistoryWidget } from "./admin/widgets/product-price-history";

// Module definition
export const PRICE_HISTORY_MODULE = "priceHistoryModule";

export const initialize = (
  options?: PriceHistoryPluginOptions,
  moduleDeclaration?: Record<string, unknown>
) => {
  const serviceKey = `${PRICE_HISTORY_MODULE}Service`;

  registerModuleLoader(PRICE_HISTORY_MODULE, {
    service: PriceHistoryService,
    definition: {
      key: serviceKey,
      registrationName: serviceKey,
      defaultPackage: false,
      label: "PriceHistoryService",
      isRequired: false,
      defaultModuleDeclaration: {
        scope: MODULE_SCOPE.INTERNAL,
        resources: MODULE_RESOURCE_TYPE.SHARED,
      },
    },
    moduleDeclaration: {
      ...moduleDeclaration,
      options,
    },
  });

  return MedusaModule(serviceKey, {
    service: PriceHistoryService,
    options,
  });
};

// Plugin configuration
export default {
  /**
   * Load function for the plugin
   */
  load: async (container: any, options: PriceHistoryPluginOptions) => {
    // Register the module
    container.register({
      [PRICE_HISTORY_MODULE]: initialize(options),
      priceHistoryService: asFunction(
        (cradle) => new PriceHistoryService({
          ...cradle,
          options,
        })
      ).singleton(),
    });

    // Register scheduled jobs
    if (options.enableAutoUpdate) {
      const jobScheduler = container.resolve("jobScheduler");
      
      await jobScheduler.register(
        scheduledJobConfig.name,
        scheduledJobConfig.data,
        scheduledJobConfig.schedule,
        {
          keepExisting: false,
        }
      );
    }
  },

  /**
   * Models to extend in Medusa
   */
  models: [
    {
      name: "Product",
      fields: productExtensions,
    },
  ],

  /**
   * API routes to load
   */
  routes: [
    {
      method: "GET",
      path: "/store/products/:id/price-history",
      handlers: "./api/store/products/[id]/price-history/route",
    },
    {
      method: "POST",
      path: "/vendor/price-history/update",
      handlers: "./api/vendor/price-history/route",
    },
    {
      method: "POST",
      path: "/vendor/price-history/seed",
      handlers: "./api/vendor/price-history/route",
    },
    {
      method: "POST",
      path: "/vendor/price-history/bulk-update",
      handlers: "./api/vendor/price-history/route",
    },
    {
      method: "GET",
      path: "/vendor/price-history/products",
      handlers: "./api/vendor/price-history/route",
    },
  ],

  /**
   * Subscribers to load
   */
  subscribers: [
    "./subscribers/price-update-scheduler",
    "./subscribers/product-created",
  ],

  /**
   * Admin widgets to load
   */
  widgets: [
    {
      Component: ProductPriceHistoryWidget,
      zone: "product.details.after",
    },
  ],

  /**
   * Links to define
   */
  links: () => import("./links/vendor-price-history"),

  /**
   * Migrations to run
   */
  migrations: [],
};

// Helper function for dependency injection
function asFunction(fn: Function) {
  return {
    resolve: fn,
    lifetime: "SINGLETON",
  };
}
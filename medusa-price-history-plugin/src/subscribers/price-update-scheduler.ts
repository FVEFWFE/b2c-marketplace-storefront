import { 
  SubscriberArgs, 
  SubscriberConfig,
  IEventBusModuleService,
} from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";
import { updateProductPricesWorkflow } from "../workflows/update-product-prices";
import { PriceHistoryPluginOptions, DEFAULT_OPTIONS } from "../types";

export default async function schedulePriceUpdates({
  event,
  container,
  pluginOptions,
}: SubscriberArgs<Record<string, any>>) {
  const logger = container.resolve(Modules.LOGGER);
  const workflowEngine = container.resolve(Modules.WORKFLOW_ENGINE);
  const options = { ...DEFAULT_OPTIONS, ...pluginOptions } as PriceHistoryPluginOptions;

  // Only run if auto-update is enabled
  if (!options.enableAutoUpdate) {
    logger.info("Price auto-update is disabled");
    return;
  }

  logger.info("Starting scheduled price update job");

  try {
    // Run the price update workflow
    const { result, errors } = await updateProductPricesWorkflow(container).run({
      input: {
        batchSize: 50, // Process 50 products at a time
      },
    });

    if (errors && errors.length > 0) {
      logger.error("Price update workflow encountered errors", {
        errors,
      });
    }

    logger.info("Scheduled price update completed", {
      totalProcessed: result.totalProcessed,
      successful: result.successful,
      failed: result.failed,
      historyRecorded: result.historyRecorded,
    });

    // Emit event for successful update
    const eventBus = container.resolve<IEventBusModuleService>(
      Modules.EVENT_BUS
    );
    
    await eventBus.emit("price-history.scheduled-update.completed", {
      result,
      timestamp: new Date(),
    });
  } catch (error: any) {
    logger.error("Failed to run scheduled price update", {
      error: error.message,
      stack: error.stack,
    });

    // Emit event for failed update
    const eventBus = container.resolve<IEventBusModuleService>(
      Modules.EVENT_BUS
    );
    
    await eventBus.emit("price-history.scheduled-update.failed", {
      error: error.message,
      timestamp: new Date(),
    });
  }
}

export const config: SubscriberConfig = {
  event: "price-history.update-prices",
  context: {
    subscriberId: "price-update-scheduler",
  },
};

// Scheduled job configuration
export const scheduledJobConfig = {
  name: "price-history-update",
  schedule: "0 */24 * * *", // Run every 24 hours at midnight
  data: {},
};
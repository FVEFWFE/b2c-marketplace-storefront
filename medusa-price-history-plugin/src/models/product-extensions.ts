import { model } from "@medusajs/framework/utils";
import { PricePattern } from "../types";

// Extend the Product model with price history fields
export const productExtensions = {
  retail_price: model.bigNumber().nullable(),
  last_price_update: model.dateTime().nullable(),
  price_pattern: model.enum(PricePattern).default(PricePattern.STABLE),
};

// These fields will be added to the Product model when the plugin is loaded
import { defineLink } from "@medusajs/framework/utils";
import PriceHistory from "../models/price-history";

// Link price history to products
export const priceHistoryProductLink = defineLink(
  {
    linkable: PriceHistory,
    deleteCascade: true,
  },
  {
    linkable: "product",
    deleteCascade: false,
  }
);

// Link price history to vendors
export const priceHistoryVendorLink = defineLink(
  {
    linkable: PriceHistory,
    deleteCascade: true,
  },
  {
    linkable: "vendor",
    deleteCascade: false,
  }
);

// Export all links
export default [
  priceHistoryProductLink,
  priceHistoryVendorLink,
];
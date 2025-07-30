import { model } from "@medusajs/framework/utils";
import { ChangeReason, PriceHistoryMetadata } from "../types";

const PriceHistory = model.define("price_history", {
  id: model.id().primaryKey(),
  product_id: model.text().searchable(),
  vendor_id: model.text().searchable(),
  price: model.bigNumber(),
  retail_price: model.bigNumber(),
  currency_code: model.text(),
  recorded_at: model.dateTime().default(() => new Date()),
  change_reason: model.enum(ChangeReason).default(ChangeReason.SCHEDULED),
  metadata: model.json<PriceHistoryMetadata>().nullable(),
  created_at: model.dateTime().default(() => new Date()),
  updated_at: model.dateTime().default(() => new Date())
}).indexes([
  {
    name: "idx_price_history_product_vendor",
    on: ["product_id", "vendor_id"],
  },
  {
    name: "idx_price_history_recorded_at",
    on: ["recorded_at"],
  }
]);

export default PriceHistory;
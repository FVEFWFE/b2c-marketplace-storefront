import { model } from "@medusajs/framework/utils"

export const Vendor = model.define("vendor", {
  id: model.id().primaryKey(),
  name: model.text(),
  handle: model.text().unique(),
  contact_email: model.text().nullable(),
  is_active: model.boolean().default(true),
  metadata: model.json().nullable(),
})
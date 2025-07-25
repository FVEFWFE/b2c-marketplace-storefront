import { model } from "@medusajs/framework/utils"

export const VendorAdmin = model.define("vendor_admin", {
  id: model.id().primaryKey(),
  vendor_id: model.text(),
  admin_id: model.text(),
})
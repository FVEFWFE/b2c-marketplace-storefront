import {
  MedusaService,
  InjectManager,
  MedusaContext,
} from "@medusajs/framework/utils"
import { Vendor } from "./models/vendor"
import { VendorAdmin } from "./models/vendor-admin"
import { 
  CreateVendorDTO,
  UpdateVendorDTO,
} from "./types"

export default class MarketplaceService extends MedusaService({
  Vendor,
  VendorAdmin,
}) {
  @InjectManager()
  async createVendor(
    data: CreateVendorDTO,
    @MedusaContext() context?: MedusaContext
  ): Promise<Vendor> {
    return await this.createVendors(data, context)
  }

  @InjectManager()
  async updateVendor(
    id: string,
    data: UpdateVendorDTO,
    @MedusaContext() context?: MedusaContext
  ): Promise<Vendor> {
    const vendors = await this.updateVendors(
      { id },
      data,
      context
    )
    
    if (!vendors.length) {
      throw new Error(`Vendor with id ${id} not found`)
    }
    
    return vendors[0]
  }

  @InjectManager()
  async deleteVendor(
    id: string,
    @MedusaContext() context?: MedusaContext
  ): Promise<void> {
    await this.deleteVendors({ id }, context)
  }

  @InjectManager()
  async getVendorByProductId(
    productId: string,
    @MedusaContext() context?: MedusaContext
  ): Promise<Vendor | null> {
    // Use the Query to get vendor through module link
    const query = this.__container__.resolve("query")
    
    try {
      const { data } = await query.graph({
        entity: "marketplace_vendor_product",
        fields: ["vendor.*"],
        filters: { product_id: productId },
      })

      return data?.[0]?.vendor || null
    } catch (error) {
      console.error("Error fetching vendor by product ID:", error)
      return null
    }
  }

  @InjectManager()
  async linkProductToVendor(
    productId: string,
    vendorId: string,
    @MedusaContext() context?: MedusaContext
  ): Promise<void> {
    const remoteLink = this.__container__.resolve("remoteLink")
    
    // First, remove any existing links for this product
    await this.unlinkProductFromVendor(productId, context)
    
    // Create new link
    await remoteLink.create({
      [Modules.MARKETPLACE]: {
        vendor_id: vendorId,
      },
      [Modules.PRODUCT]: {
        product_id: productId,
      },
    })
  }

  @InjectManager()
  async unlinkProductFromVendor(
    productId: string,
    @MedusaContext() context?: MedusaContext
  ): Promise<void> {
    const remoteLink = this.__container__.resolve("remoteLink")
    
    await remoteLink.dismiss({
      [Modules.PRODUCT]: {
        product_id: productId,
      },
    })
  }

  @InjectManager()
  async createVendorAdmin(
    vendorId: string,
    adminId: string,
    @MedusaContext() context?: MedusaContext
  ): Promise<VendorAdmin> {
    return await this.createVendorAdmins({
      vendor_id: vendorId,
      admin_id: adminId,
    }, context)
  }

  @InjectManager()
  async getVendorsByAdminId(
    adminId: string,
    @MedusaContext() context?: MedusaContext
  ): Promise<Vendor[]> {
    const vendorAdmins = await this.listVendorAdmins(
      { admin_id: adminId },
      {},
      context
    )

    const vendorIds = vendorAdmins.map(va => va.vendor_id)
    
    if (!vendorIds.length) {
      return []
    }

    return await this.listVendors(
      { id: vendorIds },
      {},
      context
    )
  }
}

// Import the Modules enum
const Modules = {
  MARKETPLACE: "marketplace",
  PRODUCT: "product",
}
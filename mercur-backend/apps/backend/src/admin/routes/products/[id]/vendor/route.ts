import { 
  MedusaRequest, 
  MedusaResponse,
  AuthenticatedMedusaRequest,
} from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

// GET /admin/products/:id/vendor
export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const { id } = req.params
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  try {
    // First check if product exists
    const { data: products } = await query.graph({
      entity: "product",
      fields: ["id"],
      filters: { id },
    })

    if (!products.length) {
      return res.status(404).json({ message: "Product not found" })
    }

    // Get vendor through the link
    const marketplaceService = req.scope.resolve("marketplace")
    const vendor = await marketplaceService.getVendorByProductId(id)

    res.json({ vendor })
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to fetch product vendor",
      error: error.message 
    })
  }
}

// POST /admin/products/:id/vendor
export const POST = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const { id: productId } = req.params
  const { vendor_id } = req.body

  if (!vendor_id) {
    return res.status(400).json({
      message: "vendor_id is required"
    })
  }

  const marketplaceService = req.scope.resolve("marketplace")
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  try {
    // Verify product exists
    const { data: products } = await query.graph({
      entity: "product",
      fields: ["id"],
      filters: { id: productId },
    })

    if (!products.length) {
      return res.status(404).json({ message: "Product not found" })
    }

    // Verify vendor exists
    const { data: vendors } = await query.graph({
      entity: "vendor",
      fields: ["id"],
      filters: { id: vendor_id },
    })

    if (!vendors.length) {
      return res.status(404).json({ message: "Vendor not found" })
    }

    // Create or update the link
    await marketplaceService.linkProductToVendor(productId, vendor_id)

    // Fetch the updated vendor info
    const vendor = await marketplaceService.getVendorByProductId(productId)

    res.json({ 
      message: "Vendor assigned successfully",
      vendor 
    })
  } catch (error) {
    res.status(500).json({
      message: "Failed to assign vendor to product",
      error: error.message
    })
  }
}

// DELETE /admin/products/:id/vendor
export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const { id: productId } = req.params
  const marketplaceService = req.scope.resolve("marketplace")

  try {
    await marketplaceService.unlinkProductFromVendor(productId)
    
    res.status(204).end()
  } catch (error) {
    res.status(500).json({
      message: "Failed to remove vendor from product",
      error: error.message
    })
  }
}
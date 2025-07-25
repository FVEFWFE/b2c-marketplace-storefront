import { 
  MedusaRequest, 
  MedusaResponse,
  AuthenticatedMedusaRequest,
} from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

// GET /admin/marketplace/vendors/:id
export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const { id } = req.params
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  try {
    const { data: vendors } = await query.graph({
      entity: "vendor",
      fields: [
        "id",
        "name", 
        "handle",
        "contact_email",
        "is_active",
        "metadata",
        "created_at",
        "updated_at",
        "products.*",
        "vendor_admins.*",
      ],
      filters: { id },
    })

    if (!vendors.length) {
      return res.status(404).json({ message: "Vendor not found" })
    }

    res.json({ vendor: vendors[0] })
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to fetch vendor",
      error: error.message 
    })
  }
}

// PUT /admin/marketplace/vendors/:id
export const PUT = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const { id } = req.params
  const { 
    name,
    handle,
    contact_email,
    is_active,
    metadata
  } = req.body

  const marketplaceService = req.scope.resolve("marketplace")

  try {
    const vendor = await marketplaceService.updateVendor(id, {
      name,
      handle,
      contact_email,
      is_active,
      metadata,
    })

    res.json({ vendor })
  } catch (error) {
    if (error.message.includes("not found")) {
      return res.status(404).json({ message: "Vendor not found" })
    }
    res.status(500).json({
      message: "Failed to update vendor",
      error: error.message
    })
  }
}

// DELETE /admin/marketplace/vendors/:id
export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const { id } = req.params
  const marketplaceService = req.scope.resolve("marketplace")

  try {
    await marketplaceService.deleteVendor(id)
    res.status(204).end()
  } catch (error) {
    if (error.message.includes("not found")) {
      return res.status(404).json({ message: "Vendor not found" })
    }
    res.status(500).json({
      message: "Failed to delete vendor",
      error: error.message
    })
  }
}
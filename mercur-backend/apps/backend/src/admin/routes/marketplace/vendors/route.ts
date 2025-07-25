import { 
  MedusaRequest, 
  MedusaResponse,
  AuthenticatedMedusaRequest,
} from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

// GET /admin/marketplace/vendors
export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
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
      ],
    })

    res.json({ vendors })
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to fetch vendors",
      error: error.message 
    })
  }
}

// POST /admin/marketplace/vendors
export const POST = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const { 
    name,
    handle,
    contact_email,
    is_active = true,
    metadata = {}
  } = req.body

  if (!name || !handle) {
    return res.status(400).json({
      message: "Name and handle are required"
    })
  }

  const marketplaceService = req.scope.resolve("marketplace")

  try {
    const vendor = await marketplaceService.createVendor({
      name,
      handle,
      contact_email,
      is_active,
      metadata,
    })

    res.status(201).json({ vendor })
  } catch (error) {
    res.status(500).json({
      message: "Failed to create vendor",
      error: error.message
    })
  }
}
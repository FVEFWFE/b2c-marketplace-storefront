import { 
  MedusaRequest, 
  MedusaResponse,
  AuthenticatedMedusaRequest,
} from "@medusajs/framework/http"

// Default marketplace settings
const DEFAULT_SETTINGS = {
  marketplace_enabled: true,
  vendor_auto_approval: false,
  commission_percentage: 10,
  minimum_payout_amount: 100,
  payout_frequency: "weekly",
  require_vendor_verification: true,
  allow_vendor_shipping_rates: false,
  vendor_product_moderation: true,
}

// GET /admin/marketplace/settings
export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  // In a real implementation, you would fetch these from a database
  // For now, we'll return default settings
  try {
    // You could store these in the store's metadata or a separate settings table
    const storeService = req.scope.resolve("store")
    const stores = await storeService.list({})
    
    const store = stores[0]
    const marketplaceSettings = store?.metadata?.marketplace_settings || DEFAULT_SETTINGS
    
    res.json({ settings: marketplaceSettings })
  } catch (error) {
    res.json({ settings: DEFAULT_SETTINGS })
  }
}

// PUT /admin/marketplace/settings
export const PUT = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const settings = req.body

  try {
    // In a real implementation, save to database
    // For now, we'll update store metadata
    const storeService = req.scope.resolve("store")
    const stores = await storeService.list({})
    
    if (stores.length > 0) {
      const store = stores[0]
      await storeService.update(store.id, {
        metadata: {
          ...store.metadata,
          marketplace_settings: settings
        }
      })
    }
    
    res.json({ 
      message: "Settings updated successfully",
      settings 
    })
  } catch (error) {
    res.status(500).json({
      message: "Failed to update settings",
      error: error.message
    })
  }
}
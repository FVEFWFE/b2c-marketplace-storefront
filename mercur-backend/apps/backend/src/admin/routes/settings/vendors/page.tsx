import { defineRouteConfig } from "@medusajs/admin-sdk"
import {
  Container,
  Heading,
  Text,
  Card,
  Switch,
  Label,
  Input,
  Button,
  toast,
} from "@medusajs/ui"
import { BuildingStorefront, CurrencyDollar, Shield, Truck } from "@medusajs/icons"
import { useState, useEffect } from "react"

const VendorSettingsPage = () => {
  const [settings, setSettings] = useState({
    marketplace_enabled: true,
    vendor_auto_approval: false,
    commission_percentage: 10,
    minimum_payout_amount: 100,
    payout_frequency: "weekly",
    require_vendor_verification: true,
    allow_vendor_shipping_rates: false,
    vendor_product_moderation: true,
  })
  const [saving, setSaving] = useState(false)

  // Load settings on mount
  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const response = await fetch("/admin/marketplace/settings", {
        credentials: "include",
      })
      
      if (response.ok) {
        const data = await response.json()
        setSettings(data.settings)
      }
    } catch (error) {
      console.error("Error loading settings:", error)
    }
  }

  const saveSettings = async () => {
    try {
      setSaving(true)
      const response = await fetch("/admin/marketplace/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        toast.success("Settings saved successfully")
      } else {
        toast.error("Failed to save settings")
      }
    } catch (error) {
      console.error("Error saving settings:", error)
      toast.error("Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Container>
      <div className="mb-8">
        <Heading>Vendor Settings</Heading>
        <Text className="text-ui-fg-subtle mt-1">
          Configure marketplace vendor settings and policies
        </Text>
      </div>

      <div className="space-y-6">
        {/* General Settings */}
        <Card>
          <Card.Header>
            <div className="flex items-center gap-x-2">
              <BuildingStorefront />
              <Heading level="h2">General Settings</Heading>
            </div>
          </Card.Header>
          <Card.Body className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="marketplace-enabled">Enable Marketplace</Label>
                <Text className="text-ui-fg-muted text-sm">
                  Allow vendors to list and sell products
                </Text>
              </div>
              <Switch
                id="marketplace-enabled"
                checked={settings.marketplace_enabled}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, marketplace_enabled: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-approval">Auto-approve Vendors</Label>
                <Text className="text-ui-fg-muted text-sm">
                  Automatically approve new vendor applications
                </Text>
              </div>
              <Switch
                id="auto-approval"
                checked={settings.vendor_auto_approval}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, vendor_auto_approval: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="verification">Require Verification</Label>
                <Text className="text-ui-fg-muted text-sm">
                  Vendors must verify their identity before selling
                </Text>
              </div>
              <Switch
                id="verification"
                checked={settings.require_vendor_verification}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, require_vendor_verification: checked })
                }
              />
            </div>
          </Card.Body>
        </Card>

        {/* Commission Settings */}
        <Card>
          <Card.Header>
            <div className="flex items-center gap-x-2">
              <CurrencyDollar />
              <Heading level="h2">Commission & Payouts</Heading>
            </div>
          </Card.Header>
          <Card.Body className="space-y-6">
            <div>
              <Label htmlFor="commission">Commission Percentage</Label>
              <Text className="text-ui-fg-muted text-sm mb-2">
                Percentage of each sale taken as platform fee
              </Text>
              <div className="flex items-center gap-x-2">
                <Input
                  id="commission"
                  type="number"
                  min="0"
                  max="100"
                  value={settings.commission_percentage}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      commission_percentage: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-24"
                />
                <Text>%</Text>
              </div>
            </div>

            <div>
              <Label htmlFor="min-payout">Minimum Payout Amount</Label>
              <Text className="text-ui-fg-muted text-sm mb-2">
                Minimum balance required for vendor payouts
              </Text>
              <div className="flex items-center gap-x-2">
                <Text>$</Text>
                <Input
                  id="min-payout"
                  type="number"
                  min="0"
                  value={settings.minimum_payout_amount}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      minimum_payout_amount: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-32"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="payout-frequency">Payout Frequency</Label>
              <Text className="text-ui-fg-muted text-sm mb-2">
                How often vendors receive their earnings
              </Text>
              <select
                id="payout-frequency"
                value={settings.payout_frequency}
                onChange={(e) =>
                  setSettings({ ...settings, payout_frequency: e.target.value })
                }
                className="w-full rounded-md border border-ui-border-base bg-ui-bg-base px-3 py-2"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </Card.Body>
        </Card>

        {/* Product & Shipping Settings */}
        <Card>
          <Card.Header>
            <div className="flex items-center gap-x-2">
              <Truck />
              <Heading level="h2">Products & Shipping</Heading>
            </div>
          </Card.Header>
          <Card.Body className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="vendor-shipping">Vendor Shipping Rates</Label>
                <Text className="text-ui-fg-muted text-sm">
                  Allow vendors to set their own shipping rates
                </Text>
              </div>
              <Switch
                id="vendor-shipping"
                checked={settings.allow_vendor_shipping_rates}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, allow_vendor_shipping_rates: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="product-moderation">Product Moderation</Label>
                <Text className="text-ui-fg-muted text-sm">
                  Review vendor products before they go live
                </Text>
              </div>
              <Switch
                id="product-moderation"
                checked={settings.vendor_product_moderation}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, vendor_product_moderation: checked })
                }
              />
            </div>
          </Card.Body>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            variant="primary"
            onClick={saveSettings}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Vendors",
  icon: BuildingStorefront,
})

export default VendorSettingsPage
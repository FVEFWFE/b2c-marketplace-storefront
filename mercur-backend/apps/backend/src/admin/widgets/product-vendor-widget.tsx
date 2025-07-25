import { defineWidgetConfig } from "@medusajs/admin-sdk"
import {
  Container,
  Heading,
  Text,
  Badge,
  Button,
  usePrompt,
  toast,
} from "@medusajs/ui"
import { PencilSquare, BuildingStorefront } from "@medusajs/icons"
import { useState, useEffect } from "react"

const ProductVendorWidget = ({ data }) => {
  const [vendor, setVendor] = useState(null)
  const [loading, setLoading] = useState(true)
  const prompt = usePrompt()

  // Fetch vendor information for the product
  useEffect(() => {
    const fetchVendor = async () => {
      if (!data?.id) return

      try {
        setLoading(true)
        const response = await fetch(`/admin/products/${data.id}/vendor`, {
          credentials: "include",
        })

        if (response.ok) {
          const vendorData = await response.json()
          setVendor(vendorData.vendor)
        }
      } catch (error) {
        console.error("Error fetching vendor:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchVendor()
  }, [data?.id])

  const handleChangeVendor = async () => {
    const result = await prompt({
      title: "Change Vendor",
      description: "Select a new vendor for this product",
      verificationText: "change vendor",
    })

    if (result) {
      // This will be implemented with the vendor selector widget
      toast.info("Vendor selector coming soon!")
    }
  }

  if (loading) {
    return (
      <Container className="divide-y p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <Heading level="h2">Vendor Information</Heading>
        </div>
        <div className="px-6 py-4">
          <Text className="text-ui-fg-muted">Loading vendor information...</Text>
        </div>
      </Container>
    )
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-x-2">
          <BuildingStorefront className="text-ui-fg-muted" />
          <Heading level="h2">Vendor Information</Heading>
        </div>
        <Button
          size="small"
          variant="secondary"
          onClick={handleChangeVendor}
          className="gap-x-2"
        >
          <PencilSquare />
          Change Vendor
        </Button>
      </div>

      <div className="px-6 py-4">
        {vendor ? (
          <div className="flex flex-col gap-y-4">
            <div>
              <Text className="text-ui-fg-muted text-sm">Vendor Name</Text>
              <Text className="font-medium">{vendor.name}</Text>
            </div>

            <div>
              <Text className="text-ui-fg-muted text-sm">Handle</Text>
              <Text className="font-mono text-sm">{vendor.handle}</Text>
            </div>

            {vendor.contact_email && (
              <div>
                <Text className="text-ui-fg-muted text-sm">Contact Email</Text>
                <Text>{vendor.contact_email}</Text>
              </div>
            )}

            <div className="flex items-center gap-x-2">
              <Text className="text-ui-fg-muted text-sm">Status</Text>
              <Badge color={vendor.is_active ? "green" : "red"} size="xsmall">
                {vendor.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>

            {vendor.metadata && Object.keys(vendor.metadata).length > 0 && (
              <div>
                <Text className="text-ui-fg-muted text-sm mb-2">Metadata</Text>
                <div className="bg-ui-bg-subtle rounded-md p-3">
                  <pre className="text-xs">
                    {JSON.stringify(vendor.metadata, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-y-4 py-8">
            <BuildingStorefront className="text-ui-fg-muted" size={32} />
            <div className="text-center">
              <Text className="text-ui-fg-subtle">No vendor assigned</Text>
              <Text className="text-ui-fg-muted text-sm mt-1">
                Assign a vendor to this product to track ownership
              </Text>
            </div>
            <Button
              size="small"
              variant="secondary"
              onClick={handleChangeVendor}
            >
              Assign Vendor
            </Button>
          </div>
        )}
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.after",
})

export default ProductVendorWidget
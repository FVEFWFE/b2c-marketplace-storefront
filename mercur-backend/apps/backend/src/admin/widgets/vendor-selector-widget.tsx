import { defineWidgetConfig } from "@medusajs/admin-sdk"
import {
  Container,
  Heading,
  Text,
  Select,
  Label,
  Badge,
  Button,
  Input,
  toast,
} from "@medusajs/ui"
import { BuildingStorefront, MagnifyingGlass } from "@medusajs/icons"
import { useState, useEffect, useMemo } from "react"

const VendorSelectorWidget = ({ data, notify }) => {
  const [vendors, setVendors] = useState([])
  const [selectedVendorId, setSelectedVendorId] = useState("")
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentVendor, setCurrentVendor] = useState(null)

  // Fetch all vendors
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading(true)
        const response = await fetch("/admin/marketplace/vendors", {
          credentials: "include",
        })

        if (response.ok) {
          const data = await response.json()
          setVendors(data.vendors || [])
        }
      } catch (error) {
        console.error("Error fetching vendors:", error)
        toast.error("Failed to load vendors")
      } finally {
        setLoading(false)
      }
    }

    fetchVendors()
  }, [])

  // Fetch current vendor if editing an existing product
  useEffect(() => {
    const fetchCurrentVendor = async () => {
      if (!data?.id) return

      try {
        const response = await fetch(`/admin/products/${data.id}/vendor`, {
          credentials: "include",
        })

        if (response.ok) {
          const vendorData = await response.json()
          if (vendorData.vendor) {
            setCurrentVendor(vendorData.vendor)
            setSelectedVendorId(vendorData.vendor.id)
          }
        }
      } catch (error) {
        console.error("Error fetching current vendor:", error)
      }
    }

    fetchCurrentVendor()
  }, [data?.id])

  // Filter vendors based on search query
  const filteredVendors = useMemo(() => {
    if (!searchQuery.trim()) return vendors

    const query = searchQuery.toLowerCase()
    return vendors.filter(vendor =>
      vendor.name.toLowerCase().includes(query) ||
      vendor.handle.toLowerCase().includes(query) ||
      vendor.contact_email?.toLowerCase().includes(query)
    )
  }, [vendors, searchQuery])

  // Handle vendor assignment
  const handleVendorChange = async (vendorId) => {
    setSelectedVendorId(vendorId)

    // If this is a product creation, store the vendor ID for later use
    if (!data?.id) {
      // Store in form data or context for product creation
      notify("vendor_selected", { vendorId })
      return
    }

    // If editing an existing product, update immediately
    try {
      const response = await fetch(`/admin/products/${data.id}/vendor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ vendor_id: vendorId }),
      })

      if (response.ok) {
        toast.success("Vendor updated successfully")
        const vendor = vendors.find(v => v.id === vendorId)
        setCurrentVendor(vendor)
      } else {
        toast.error("Failed to update vendor")
      }
    } catch (error) {
      console.error("Error updating vendor:", error)
      toast.error("Failed to update vendor")
    }
  }

  const handleCreateVendor = () => {
    // Navigate to vendor creation page
    window.location.href = "/admin/vendors/new"
  }

  if (loading) {
    return (
      <Container className="divide-y p-0">
        <div className="px-6 py-4">
          <Heading level="h2">Vendor Assignment</Heading>
          <Text className="text-ui-fg-muted mt-2">Loading vendors...</Text>
        </div>
      </Container>
    )
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading level="h2">Vendor Assignment</Heading>
          <Text className="text-ui-fg-muted text-sm mt-1">
            {data?.id ? "Assign or change the vendor for this product" : "Select a vendor for this product"}
          </Text>
        </div>
        <Button
          size="small"
          variant="secondary"
          onClick={handleCreateVendor}
        >
          Create Vendor
        </Button>
      </div>

      <div className="px-6 py-4 space-y-4">
        {/* Current vendor display (for existing products) */}
        {currentVendor && (
          <div className="bg-ui-bg-subtle rounded-lg p-4 mb-4">
            <Text className="text-ui-fg-muted text-sm mb-1">Current Vendor</Text>
            <div className="flex items-center gap-x-2">
              <BuildingStorefront className="text-ui-fg-muted" />
              <Text className="font-medium">{currentVendor.name}</Text>
              <Badge color="green" size="xsmall">Active</Badge>
            </div>
          </div>
        )}

        {/* Search input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlass className="text-ui-fg-muted" />
          </div>
          <Input
            type="text"
            placeholder="Search vendors by name, handle, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Vendor selector */}
        <div>
          <Label htmlFor="vendor-select">Select Vendor</Label>
          <Select
            id="vendor-select"
            value={selectedVendorId}
            onValueChange={handleVendorChange}
            disabled={vendors.length === 0}
          >
            <Select.Trigger>
              <Select.Value placeholder="Choose a vendor..." />
            </Select.Trigger>
            <Select.Content>
              {filteredVendors.length > 0 ? (
                filteredVendors.map((vendor) => (
                  <Select.Item key={vendor.id} value={vendor.id}>
                    <div className="flex items-center justify-between w-full">
                      <div>
                        <Text className="font-medium">{vendor.name}</Text>
                        <Text className="text-ui-fg-muted text-xs">
                          @{vendor.handle} • {vendor.contact_email}
                        </Text>
                      </div>
                      {vendor.is_active ? (
                        <Badge color="green" size="xsmall">Active</Badge>
                      ) : (
                        <Badge color="red" size="xsmall">Inactive</Badge>
                      )}
                    </div>
                  </Select.Item>
                ))
              ) : (
                <div className="p-4 text-center">
                  <Text className="text-ui-fg-muted">
                    {searchQuery ? "No vendors found matching your search" : "No vendors available"}
                  </Text>
                </div>
              )}
            </Select.Content>
          </Select>
        </div>

        {/* Help text */}
        <div className="bg-ui-bg-subtle rounded-md p-3">
          <Text className="text-ui-fg-muted text-sm">
            <strong>Note:</strong> Products must be assigned to a vendor to appear in the marketplace. 
            Vendors manage their own inventory and fulfill orders for their products.
          </Text>
        </div>
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: [
    "product.create.before",
    "product.details.before"
  ],
})

export default VendorSelectorWidget
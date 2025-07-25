import { defineRouteConfig } from "@medusajs/admin-sdk"
import {
  Container,
  Heading,
  Text,
  Button,
  Table,
  Badge,
  Input,
  Select,
  Drawer,
  Label,
  toast,
  FocusModal,
  IconButton,
} from "@medusajs/ui"
import {
  BuildingStorefront,
  Plus,
  MagnifyingGlass,
  PencilSquare,
  Trash,
  CheckCircleSolid,
  XCircleSolid,
} from "@medusajs/icons"
import { useState, useEffect, useMemo } from "react"
import { useSearchParams } from "react-router-dom"

const VendorsPage = () => {
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false)
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState(null)
  const [searchParams] = useSearchParams()

  // Check if we should open create drawer (from navigation)
  useEffect(() => {
    if (searchParams.get("action") === "new") {
      setIsCreateDrawerOpen(true)
    }
  }, [searchParams])

  // Fetch vendors
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

  useEffect(() => {
    fetchVendors()
  }, [])

  // Filter vendors
  const filteredVendors = useMemo(() => {
    let filtered = vendors

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(vendor =>
        vendor.name.toLowerCase().includes(query) ||
        vendor.handle.toLowerCase().includes(query) ||
        vendor.contact_email?.toLowerCase().includes(query)
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(vendor =>
        statusFilter === "active" ? vendor.is_active : !vendor.is_active
      )
    }

    return filtered
  }, [vendors, searchQuery, statusFilter])

  const handleEditVendor = (vendor) => {
    setSelectedVendor(vendor)
    setIsEditDrawerOpen(true)
  }

  const handleDeleteVendor = async (vendorId) => {
    if (!confirm("Are you sure you want to delete this vendor? This action cannot be undone.")) {
      return
    }

    try {
      const response = await fetch(`/admin/marketplace/vendors/${vendorId}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (response.ok) {
        toast.success("Vendor deleted successfully")
        fetchVendors()
      } else {
        toast.error("Failed to delete vendor")
      }
    } catch (error) {
      console.error("Error deleting vendor:", error)
      toast.error("Failed to delete vendor")
    }
  }

  return (
    <Container>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Heading>Vendors</Heading>
          <Text className="text-ui-fg-subtle mt-1">
            Manage marketplace vendors and their settings
          </Text>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsCreateDrawerOpen(true)}
          className="gap-x-2"
        >
          <Plus />
          Create Vendor
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlass className="text-ui-fg-muted" />
          </div>
          <Input
            type="text"
            placeholder="Search vendors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <Select.Trigger className="w-[180px]">
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="all">All Vendors</Select.Item>
            <Select.Item value="active">Active Only</Select.Item>
            <Select.Item value="inactive">Inactive Only</Select.Item>
          </Select.Content>
        </Select>
      </div>

      {/* Vendors Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Text className="text-ui-fg-muted">Loading vendors...</Text>
        </div>
      ) : filteredVendors.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <BuildingStorefront size={48} className="text-ui-fg-muted" />
          <div className="text-center">
            <Text className="text-ui-fg-subtle font-medium">No vendors found</Text>
            <Text className="text-ui-fg-muted text-sm mt-1">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your filters"
                : "Create your first vendor to get started"}
            </Text>
          </div>
          {!searchQuery && statusFilter === "all" && (
            <Button
              variant="secondary"
              onClick={() => setIsCreateDrawerOpen(true)}
              className="gap-x-2"
            >
              <Plus />
              Create Vendor
            </Button>
          )}
        </div>
      ) : (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Vendor</Table.HeaderCell>
              <Table.HeaderCell>Handle</Table.HeaderCell>
              <Table.HeaderCell>Contact Email</Table.HeaderCell>
              <Table.HeaderCell>Products</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell className="text-right">Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredVendors.map((vendor) => (
              <Table.Row key={vendor.id}>
                <Table.Cell>
                  <div className="flex items-center gap-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-ui-bg-subtle">
                      <BuildingStorefront className="text-ui-fg-muted" />
                    </div>
                    <div>
                      <Text className="font-medium">{vendor.name}</Text>
                      <Text className="text-ui-fg-muted text-sm">
                        ID: {vendor.id}
                      </Text>
                    </div>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <Text className="font-mono text-sm">@{vendor.handle}</Text>
                </Table.Cell>
                <Table.Cell>{vendor.contact_email || "-"}</Table.Cell>
                <Table.Cell>
                  <Badge variant="default" size="small">
                    {vendor.products?.length || 0} products
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  {vendor.is_active ? (
                    <div className="flex items-center gap-x-1">
                      <CheckCircleSolid className="text-ui-fg-positive" />
                      <Text className="text-ui-fg-positive">Active</Text>
                    </div>
                  ) : (
                    <div className="flex items-center gap-x-1">
                      <XCircleSolid className="text-ui-fg-error" />
                      <Text className="text-ui-fg-error">Inactive</Text>
                    </div>
                  )}
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center justify-end gap-x-2">
                    <IconButton
                      size="small"
                      variant="transparent"
                      onClick={() => handleEditVendor(vendor)}
                    >
                      <PencilSquare />
                    </IconButton>
                    <IconButton
                      size="small"
                      variant="transparent"
                      onClick={() => handleDeleteVendor(vendor.id)}
                      className="text-ui-fg-error hover:bg-ui-bg-error-hover"
                    >
                      <Trash />
                    </IconButton>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}

      {/* Create Vendor Drawer */}
      <VendorFormDrawer
        isOpen={isCreateDrawerOpen}
        onClose={() => setIsCreateDrawerOpen(false)}
        onSuccess={() => {
          setIsCreateDrawerOpen(false)
          fetchVendors()
        }}
      />

      {/* Edit Vendor Drawer */}
      {selectedVendor && (
        <VendorFormDrawer
          isOpen={isEditDrawerOpen}
          onClose={() => {
            setIsEditDrawerOpen(false)
            setSelectedVendor(null)
          }}
          onSuccess={() => {
            setIsEditDrawerOpen(false)
            setSelectedVendor(null)
            fetchVendors()
          }}
          vendor={selectedVendor}
        />
      )}
    </Container>
  )
}

// Vendor Form Drawer Component
const VendorFormDrawer = ({ isOpen, onClose, onSuccess, vendor = null }) => {
  const [formData, setFormData] = useState({
    name: vendor?.name || "",
    handle: vendor?.handle || "",
    contact_email: vendor?.contact_email || "",
    is_active: vendor?.is_active ?? true,
    metadata: vendor?.metadata || {},
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name || !formData.handle) {
      toast.error("Name and handle are required")
      return
    }

    try {
      setSaving(true)
      const url = vendor
        ? `/admin/marketplace/vendors/${vendor.id}`
        : "/admin/marketplace/vendors"
      const method = vendor ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success(vendor ? "Vendor updated successfully" : "Vendor created successfully")
        onSuccess()
      } else {
        const error = await response.json()
        toast.error(error.message || "Failed to save vendor")
      }
    } catch (error) {
      console.error("Error saving vendor:", error)
      toast.error("Failed to save vendor")
    } finally {
      setSaving(false)
    }
  }

  return (
    <FocusModal open={isOpen} onOpenChange={onClose}>
      <FocusModal.Content>
        <FocusModal.Header>
          <div className="flex items-center gap-x-2">
            <BuildingStorefront />
            <Heading>{vendor ? "Edit Vendor" : "Create Vendor"}</Heading>
          </div>
        </FocusModal.Header>
        <FocusModal.Body>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Vendor Name *</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Acme Corporation"
                required
              />
            </div>

            <div>
              <Label htmlFor="handle">Handle *</Label>
              <Input
                id="handle"
                type="text"
                value={formData.handle}
                onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                placeholder="acme-corp"
                pattern="[a-z0-9-]+"
                required
              />
              <Text className="text-ui-fg-muted text-xs mt-1">
                URL-friendly identifier (lowercase letters, numbers, and hyphens only)
              </Text>
            </div>

            <div>
              <Label htmlFor="email">Contact Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                placeholder="vendor@example.com"
              />
            </div>

            <div className="flex items-center gap-x-3">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="h-4 w-4"
              />
              <Label htmlFor="is_active" className="!mb-0">
                Active Vendor
              </Label>
            </div>

            <div className="flex justify-end gap-x-2 pt-4 border-t">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={saving}>
                {saving ? "Saving..." : vendor ? "Update Vendor" : "Create Vendor"}
              </Button>
            </div>
          </form>
        </FocusModal.Body>
      </FocusModal.Content>
    </FocusModal>
  )
}

export const config = defineRouteConfig({
  label: "Vendors",
  icon: BuildingStorefront,
})

export default VendorsPage
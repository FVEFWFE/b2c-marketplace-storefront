export interface CreateVendorDTO {
  name: string
  handle: string
  contact_email?: string
  is_active?: boolean
  metadata?: Record<string, any>
}

export interface UpdateVendorDTO {
  name?: string
  handle?: string
  contact_email?: string
  is_active?: boolean
  metadata?: Record<string, any>
}

export interface CreateVendorAdminDTO {
  vendor_id: string
  admin_id: string
}

export interface VendorListParams {
  id?: string | string[]
  name?: string
  handle?: string
  is_active?: boolean
}

export interface VendorAdminListParams {
  vendor_id?: string
  admin_id?: string
}
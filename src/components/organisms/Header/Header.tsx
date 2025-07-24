import Image from "next/image"
import { HttpTypes } from "@medusajs/types"

import { CartDropdown, MobileNavbar, Navbar } from "@/components/cells"
import { HeartIcon, MessageIcon } from "@/icons"
import { listCategories } from "@/lib/data/categories"
import { PARENT_CATEGORIES } from "@/const"
import { retrieveCart } from "@/lib/data/cart"
import { UserDropdown } from "@/components/cells/UserDropdown/UserDropdown"
import { retrieveCustomer } from "@/lib/data/customer"
import { getUserWishlists } from "@/lib/data/wishlist"
import { Wishlist } from "@/types/wishlist"
import { Badge } from "@/components/atoms"
import TrustBadge from "@/components/atoms/TrustBadge/TrustBadge"
import CountrySelector from "@/components/molecules/CountrySelector/CountrySelector"
import { listRegions } from "@/lib/data/regions"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { MessageButton } from "@/components/molecules/MessageButton/MessageButton"
import { SellNowButton } from "@/components/cells/SellNowButton/SellNowButton"

export const Header = async () => {
  const cart = await retrieveCart().catch(() => null)
  const user = await retrieveCustomer()
  let wishlist: Wishlist[] = []
  if (user) {
    const response = await getUserWishlists()
    wishlist = response.wishlists
  }

  const regions = await listRegions()

  const wishlistCount = wishlist?.[0]?.products.length || 0

  const { categories, parentCategories } = (await listCategories({
    headingCategories: PARENT_CATEGORIES,
  })) as {
    categories: HttpTypes.StoreProductCategory[]
    parentCategories: HttpTypes.StoreProductCategory[]
  }

  return (
    <header className="border-b border-primary bg-component-primary shadow-sm">
      {/* Trust Bar */}
      <div className="bg-action text-action-on-primary py-2 px-4 lg:px-8">
        <div className="flex items-center justify-center gap-6 text-sm font-medium">
          <div className="flex items-center gap-2">
            <span>🛡️</span>
            <span>SecureHold Escrow Protection</span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <span>✅</span>
            <span>All Sellers KYC Verified</span>
          </div>
          <div className="hidden lg:flex items-center gap-2">
            <span>🔒</span>
            <span>UPS Capital Insured Shipping</span>
          </div>
          <div className="hidden xl:flex items-center gap-2">
            <span>₿</span>
            <span>Bitcoin Payments • Save 5%</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="flex py-4 lg:px-8 px-4">
        <div className="flex items-center lg:w-1/3">
          <MobileNavbar
            parentCategories={parentCategories}
            childrenCategories={categories}
          />
          <div className="hidden lg:block">
            <SellNowButton />
          </div>
        </div>
        
        <div className="flex lg:justify-center lg:w-1/3 items-center pl-4 lg:pl-0">
          <LocalizedClientLink href="/" className="flex items-center">
            <Image
              src="/ArbVault-Logo.svg"
              width={180}
              height={50}
              alt="ArbVault - Premium Curated Marketplace"
              priority
              className="h-12 w-auto"
            />
          </LocalizedClientLink>
        </div>
        
        <div className="flex items-center justify-end gap-3 lg:gap-4 w-full lg:w-1/3 py-2">
          <CountrySelector regions={regions} />
          {user && <MessageButton />}
          <UserDropdown user={user} />
          {user && (
            <LocalizedClientLink href="/user/wishlist" className="relative group">
              <HeartIcon size={20} className="text-primary group-hover:text-premium transition-colors" />
              {Boolean(wishlistCount) && (
                <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 bg-premium text-premium-on-primary text-xs font-bold">
                  {wishlistCount}
                </Badge>
              )}
            </LocalizedClientLink>
          )}
          <CartDropdown cart={cart} />
        </div>
      </div>
      
      {/* Navigation */}
      <Navbar categories={categories} />
      
      {/* Additional Trust Indicators */}
      <div className="hidden lg:flex items-center justify-center gap-6 py-3 px-4 bg-component-secondary border-t border-primary text-xs text-secondary">
        <div className="flex items-center gap-2">
          <span>🏆</span>
          <span>Trusted by 50,000+ verified professionals</span>
        </div>
        <span>•</span>
        <div className="flex items-center gap-2">
          <span>📅</span>
          <span>Est. 2019 (formerly GadgetSphere)</span>
        </div>
        <span>•</span>
        <div className="flex items-center gap-2">
          <span>💰</span>
          <span>$50M+ in secure transactions</span>
        </div>
        <span>•</span>
        <div className="flex items-center gap-2">
          <span>⚡</span>
          <span>Same-day shipping • Real-time tracking</span>
        </div>
      </div>
    </header>
  )
}

export default Header

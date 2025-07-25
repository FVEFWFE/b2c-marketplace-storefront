import {
  ProductDetailsFooter,
  ProductDetailsHeader,
  ProductDetailsSeller,
  ProductDetailsShipping,
  ProductPageDetails,
  ProductAdditionalAttributes,
} from "@/components/cells"

import { retrieveCustomer } from "@/lib/data/customer"
import { getUserWishlists } from "@/lib/data/wishlist"
import { AdditionalAttributeProps } from "@/types/product"
import { SellerProps } from "@/types/seller"
import { Wishlist } from "@/types/wishlist"
import { HttpTypes } from "@medusajs/types"
import { 
  EscrowBadge, 
  ShippingIndicators, 
  LiveChatButton, 
  PriceHistoryTracker,
  SellerVerificationBadge 
} from "@/components/molecules"

export const ProductDetails = async ({
  product,
  locale,
}: {
  product: HttpTypes.StoreProduct & {
    seller?: SellerProps
    attribute_values?: AdditionalAttributeProps[]
  }
  locale: string
}) => {
  const user = await retrieveCustomer()

  let wishlist: Wishlist[] = []
  if (user) {
    const response = await getUserWishlists()
    wishlist = response.wishlists
  }

  // Get the product price for trust components
  const productPrice = product?.variants?.[0]?.calculated_price?.calculated_amount || 0

  return (
    <div>
      <ProductDetailsHeader
        product={product}
        locale={locale}
        user={user}
        wishlist={wishlist}
      />
      
      {/* Trust Indicators */}
      <div className="space-y-4 my-6">
        <div className="flex flex-wrap gap-4">
          <EscrowBadge />
          <ShippingIndicators />
        </div>
        
        {product?.seller && (
          <SellerVerificationBadge
            verificationLevel={product.seller.store_status === "ACTIVE" ? "verified" : "basic"}
            sellerName={product.seller.store_name}
            totalSales={product.seller.products?.length || 0}
            rating={4.8}
          />
        )}
        
        <PriceHistoryTracker
          currentPrice={productPrice / 100}
          productId={product.id}
          productName={product.title}
        />
        
        <LiveChatButton
          productPrice={productPrice / 100}
          productName={product.title}
          sellerId={product.seller?.id}
          sellerName={product.seller?.store_name}
        />
      </div>
      
      <ProductPageDetails details={product?.description || ""} />
      <ProductAdditionalAttributes
        attributes={product?.attribute_values || []}
      />
      <ProductDetailsShipping />
      <ProductDetailsSeller seller={product?.seller} />
      <ProductDetailsFooter
        tags={product?.tags || []}
        posted={product?.created_at}
      />
    </div>
  )
}

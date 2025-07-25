"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { 
  Shield, 
  Truck, 
  Clock, 
  Star, 
  ShieldCheck, 
  TrendingDown,
  MessageCircle,
  Bitcoin,
  CreditCard,
  Package,
  AlertCircle
} from "lucide-react"

interface ProductDetailsProps {
  product: {
    id: string
    title: string
    price: number
    originalPrice?: number
    description: string
    images: string[]
    category: string
    condition: string
    seller: {
      name: string
      avatar?: string
      verified: boolean
      rating: number
      totalSales: number
      joinedDate: string
    }
    specifications: Record<string, string>
    shipping: {
      method: string
      cost: number
      estimatedDays: number
    }
  }
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg border bg-muted">
            <Image
              src={product.images[selectedImage]}
              alt={product.title}
              width={600}
              height={600}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square overflow-hidden rounded-lg border-2 ${
                  selectedImage === index ? "border-primary" : "border-transparent"
                }`}
              >
                <Image
                  src={image}
                  alt={`${product.title} ${index + 1}`}
                  width={150}
                  height={150}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="secondary">{product.category}</Badge>
              <Badge variant="outline">{product.condition}</Badge>
            </div>
            <h1 className="text-3xl font-bold">{product.title}</h1>
          </div>

          {/* Price Section */}
          <div className="space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold">${product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    ${product.originalPrice.toLocaleString()}
                  </span>
                  <Badge variant="destructive">-{discount}%</Badge>
                </>
              )}
            </div>
            
            {/* Price History */}
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="flex items-center gap-2 p-3">
                <TrendingDown className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">
                  This price is {discount}% below retail average
                </span>
              </CardContent>
            </Card>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 gap-3">
            <Badge variant="outline" className="justify-center gap-2 py-2">
              <Shield className="h-4 w-4" />
              SecureHold Escrow
            </Badge>
            <Badge variant="outline" className="justify-center gap-2 py-2">
              <Truck className="h-4 w-4" />
              Insured Shipping
            </Badge>
            <Badge variant="outline" className="justify-center gap-2 py-2">
              <Clock className="h-4 w-4" />
              24hr Processing
            </Badge>
            <Badge variant="outline" className="justify-center gap-2 py-2">
              <Package className="h-4 w-4" />
              In Stock
            </Badge>
          </div>

          {/* Seller Info */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={product.seller.avatar} />
                    <AvatarFallback>{product.seller.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base">{product.seller.name}</CardTitle>
                      {product.seller.verified && (
                        <ShieldCheck className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <CardDescription className="flex items-center gap-2">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{product.seller.rating}</span>
                      <span>•</span>
                      <span>{product.seller.totalSales} sales</span>
                    </CardDescription>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Contact
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button className="w-full" size="lg">
              <CreditCard className="mr-2 h-5 w-5" />
              Buy Now
            </Button>
            <Button variant="outline" className="w-full" size="lg">
              <Bitcoin className="mr-2 h-5 w-5" />
              Pay with Bitcoin (5% OFF)
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              <AlertCircle className="mr-1 inline h-3 w-3" />
              Protected by SecureHold Escrow - Funds released after delivery confirmation
            </p>
          </div>

          {/* Shipping Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{product.shipping.method}</p>
                    <p className="text-sm text-muted-foreground">
                      Arrives in {product.shipping.estimatedDays} business days
                    </p>
                  </div>
                </div>
                <span className="font-medium">
                  {product.shipping.cost === 0 ? "FREE" : `$${product.shipping.cost}`}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Product Details Tabs */}
      <Tabs defaultValue="description" className="mt-12">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
        </TabsList>
        
        <TabsContent value="description" className="mt-6">
          <Card>
            <CardContent className="prose max-w-none p-6">
              <p>{product.description}</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="specifications" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key}>
                    <dt className="font-medium text-muted-foreground">{key}</dt>
                    <dd className="mt-1">{value}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="shipping" className="mt-6">
          <Card>
            <CardContent className="space-y-4 p-6">
              <div>
                <h3 className="mb-2 font-semibold">Shipping Policy</h3>
                <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  <li>All items ship within 24 hours of payment confirmation</li>
                  <li>Signature required on all deliveries over $500</li>
                  <li>Full insurance included on all shipments</li>
                  <li>Tracking information provided immediately after dispatch</li>
                </ul>
              </div>
              <Separator />
              <div>
                <h3 className="mb-2 font-semibold">Return Policy</h3>
                <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  <li>14-day return window from delivery date</li>
                  <li>Items must be returned in original condition</li>
                  <li>Return shipping paid by buyer unless item is defective</li>
                  <li>Refund processed within 48 hours of return receipt</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Live Chat for Expensive Items */}
      {product.price > 1000 && (
        <Card className="mt-8 border-primary bg-primary/5">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center gap-3">
              <MessageCircle className="h-6 w-6 text-primary" />
              <div>
                <p className="font-semibold">Need Expert Advice?</p>
                <p className="text-sm text-muted-foreground">
                  Live chat available for high-value purchases
                </p>
              </div>
            </div>
            <Button>Start Live Chat</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
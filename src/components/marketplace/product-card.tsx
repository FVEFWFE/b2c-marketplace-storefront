import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Shield, Truck, TrendingDown, Star, ShieldCheck } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface ProductCardProps {
  id: string
  title: string
  price: number
  originalPrice?: number
  image: string
  seller: {
    name: string
    avatar?: string
    verified: boolean
    rating: number
  }
  inStock: boolean
  category: string
}

export function ProductCard({
  id,
  title,
  price,
  originalPrice,
  image,
  seller,
  inStock,
  category,
}: ProductCardProps) {
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          {discount > 0 && (
            <Badge className="absolute left-2 top-2" variant="destructive">
              -{discount}%
            </Badge>
          )}
          {!inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <Badge variant="secondary" className="text-lg">
                Sold Out
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="mb-2 flex items-start justify-between">
          <div>
            <h3 className="line-clamp-2 font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{category}</p>
          </div>
        </div>

        <div className="mb-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold">${price.toLocaleString()}</span>
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Trust Indicators */}
        <div className="mb-3 flex flex-wrap gap-1">
          <Badge variant="outline" className="text-xs">
            <Shield className="mr-1 h-3 w-3" />
            Escrow
          </Badge>
          <Badge variant="outline" className="text-xs">
            <Truck className="mr-1 h-3 w-3" />
            Insured
          </Badge>
          {discount > 20 && (
            <Badge variant="outline" className="text-xs">
              <TrendingDown className="mr-1 h-3 w-3" />
              Best Deal
            </Badge>
          )}
        </div>

        {/* Seller Info */}
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={seller.avatar} />
            <AvatarFallback>{seller.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium">{seller.name}</span>
              {seller.verified && (
                <ShieldCheck className="h-3 w-3 text-primary" />
              )}
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-muted-foreground">{seller.rating}</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button className="w-full" asChild disabled={!inStock}>
          <Link href={`/products/${id}`}>
            {inStock ? "View Details" : "Out of Stock"}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
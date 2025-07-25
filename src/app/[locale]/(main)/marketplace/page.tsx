import { Metadata } from "next"
import { HeroSection } from "@/components/marketplace/hero-section"
import { TrustFeatures } from "@/components/marketplace/trust-features"
import { ProductCard } from "@/components/marketplace/product-card"
import { Navbar } from "@/components/marketplace/navbar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "ArbVault - Premier High-Trust Marketplace",
  description: "The premier marketplace for authenticated luxury tech, pro equipment, and collector items. Secure escrow, verified sellers, and authenticated high-value goods.",
}

// Mock data for demo
const featuredProducts = [
  {
    id: "1",
    title: "Apple Vision Pro 512GB - Sealed",
    price: 3299,
    originalPrice: 3899,
    image: "/api/placeholder/400/400",
    seller: {
      name: "Dex Volkov",
      avatar: "/api/placeholder/40/40",
      verified: true,
      rating: 4.9,
    },
    inStock: true,
    category: "VR/AR",
  },
  {
    id: "2",
    title: "Canon EOS R5 Body Only",
    price: 3499,
    originalPrice: 3899,
    image: "/api/placeholder/400/400",
    seller: {
      name: "ProPhoto NYC",
      avatar: "/api/placeholder/40/40",
      verified: true,
      rating: 4.8,
    },
    inStock: true,
    category: "Cameras",
  },
  {
    id: "3",
    title: "KEF LS50 Meta Speakers - Pair",
    price: 1299,
    originalPrice: 1499,
    image: "/api/placeholder/400/400",
    seller: {
      name: "AudioPerfect",
      avatar: "/api/placeholder/40/40",
      verified: true,
      rating: 5.0,
    },
    inStock: true,
    category: "Audio",
  },
  {
    id: "4",
    title: "DJI Mavic 3 Pro Fly More Combo",
    price: 2899,
    originalPrice: 3199,
    image: "/api/placeholder/400/400",
    seller: {
      name: "SkyTech Store",
      avatar: "/api/placeholder/40/40",
      verified: true,
      rating: 4.7,
    },
    inStock: false,
    category: "Drones",
  },
]

const categories = [
  "All",
  "Pro Audio",
  "Photography",
  "VR/AR",
  "Drones",
  "Gaming",
  "Collectibles",
  "Fitness Tech",
]

export default function MarketplacePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <HeroSection />
        
        {/* Featured Products Section */}
        <section className="py-16">
          <div className="container px-4 md:px-6">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Featured High-Value Items</h2>
                <p className="mt-2 text-muted-foreground">
                  Authenticated products from verified sellers
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/products">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <Tabs defaultValue="All" className="w-full">
              <TabsList className="mb-8 w-full justify-start overflow-x-auto">
                {categories.map((category) => (
                  <TabsTrigger key={category} value={category}>
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {categories.map((category) => (
                <TabsContent key={category} value={category}>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {featuredProducts.map((product) => (
                      <ProductCard key={product.id} {...product} />
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        <TrustFeatures />

        {/* CTA Section */}
        <section className="bg-muted py-16">
          <div className="container px-4 text-center md:px-6">
            <h2 className="text-3xl font-bold tracking-tight">
              Ready to Experience Secure Marketplace Trading?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join thousands of verified sellers and buyers on ArbVault
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" asChild>
                <Link href="/register">Create Account</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/seller/apply">Become a Seller</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Shield, TrendingUp, Clock, Bitcoin } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="container relative z-10 mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <Badge className="mb-4" variant="secondary">
            <Shield className="mr-1 h-3 w-3" />
            SecureHold Escrow Protected
          </Badge>
          
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            High-Value Goods.
            <span className="text-primary"> Verified Sellers.</span>
            <br />
            Secure Transactions.
          </h1>
          
          <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
            ArbVault: The premier marketplace for authenticated luxury tech, pro equipment, 
            and collector items. Every transaction protected by SecureHold Escrow 🛡️
          </p>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" asChild>
              <Link href="/categories">Browse Premium Inventory</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/seller/apply">Become a Verified Seller</Link>
            </Button>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-8">
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-primary">$5M+</div>
            <p className="mt-2 text-sm text-muted-foreground">Protected by Escrow</p>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-primary">100%</div>
            <p className="mt-2 text-sm text-muted-foreground">ID Verified Sellers</p>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-primary">24hr</div>
            <p className="mt-2 text-sm text-muted-foreground">Shipping Guarantee</p>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-primary">0%</div>
            <p className="mt-2 text-sm text-muted-foreground">Fraud Rate</p>
          </Card>
        </div>

        {/* Feature Badges */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <Badge variant="outline" className="px-3 py-1">
            <Bitcoin className="mr-1 h-3 w-3" />
            5% Bitcoin Discount
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            <TrendingUp className="mr-1 h-3 w-3" />
            90-Day Price Tracking
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            <Clock className="mr-1 h-3 w-3" />
            Same-Day Shipping
          </Badge>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[40rem] left-[50%] h-[80rem] w-[80rem] -translate-x-[50%] rounded-full bg-gradient-to-tr from-primary/10 to-primary/5 blur-3xl" />
      </div>
    </section>
  )
}
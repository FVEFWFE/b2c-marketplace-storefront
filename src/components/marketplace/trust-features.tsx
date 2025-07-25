import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, ShieldCheck, Truck, DollarSign, Clock, Users } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "SecureHold Escrow 🛡️",
    description: "Every transaction protected. Funds released only after buyer confirmation.",
    badge: "Required"
  },
  {
    icon: ShieldCheck,
    title: "ID.me Verified Sellers",
    description: "Government ID verification required for all sellers. No anonymous transactions.",
    badge: "Mandatory"
  },
  {
    icon: Truck,
    title: "Insured Shipping",
    description: "All high-value items shipped with full insurance and signature confirmation.",
    badge: "Included"
  },
  {
    icon: DollarSign,
    title: "Price Match Guarantee",
    description: "AI-powered price tracking ensures you get the best deal vs retail.",
    badge: "Automated"
  },
  {
    icon: Clock,
    title: "24-Hour Processing",
    description: "Same-day shipping on all orders placed before 2 PM EST.",
    badge: "Guaranteed"
  },
  {
    icon: Users,
    title: "Dispute Resolution",
    description: "Professional mediation team resolves issues within 48 hours.",
    badge: "Free"
  }
]

export function TrustFeatures() {
  return (
    <section className="py-16">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Why Trust ArbVault?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            We've built the most secure marketplace for high-value transactions. 
            Every feature is designed to protect buyers and empower legitimate sellers.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="relative overflow-hidden">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <Badge variant="secondary">{feature.badge}</Badge>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Card className="mt-8 bg-primary/5 border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">See Our Trust Features in Action</CardTitle>
            <CardDescription>
              Every seller on ArbVault goes through our rigorous verification process
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap justify-center gap-4">
            <Badge className="px-4 py-2" variant="default">
              <Shield className="mr-2 h-4 w-4" />
              SecureHold Escrow Active
            </Badge>
            <Badge className="px-4 py-2" variant="default">
              <ShieldCheck className="mr-2 h-4 w-4" />
              100% ID Verified
            </Badge>
            <Badge className="px-4 py-2" variant="default">
              <Truck className="mr-2 h-4 w-4" />
              Insured Shipping Only
            </Badge>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
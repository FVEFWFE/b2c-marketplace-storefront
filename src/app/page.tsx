"use client"

import { useState, useEffect } from "react"
import {
  Search,
  MessageCircle,
  Shield,
  CheckCircle,
  Truck,
  Star,
  Eye,
  ShoppingCart,
  Users,
  Headphones,
  Bike,
  DrillIcon as Drone,
  Battery,
  Monitor,
  Camera,
  X,
  ChevronLeft,
  ChevronRight,
  Menu,
  Clock,
  Package,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

export default function MarketplaceLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showNewsletter, setShowNewsletter] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastLocation, setToastLocation] = useState("")
  const [toastProduct, setToastProduct] = useState("")
  const [currentSlide, setCurrentSlide] = useState(0)

  // Newsletter slide-in effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNewsletter(true)
    }, 7000)

    return () => clearTimeout(timer)
  }, [])

  // Social proof toast notifications
  useEffect(() => {
    const locations = ["Austin, TX", "Seattle, WA", "New York, NY", "Denver, CO", "Miami, FL", "Chicago, IL"]
    const products = ["Canon R5", "Sony A7IV", "KEF LS50", "DJI Inspire 3", "MacBook Pro M3", "Specialized Turbo"]

    const showRandomToast = () => {
      const randomLocation = locations[Math.floor(Math.random() * locations.length)]
      const randomProduct = products[Math.floor(Math.random() * products.length)]

      setToastLocation(randomLocation)
      setToastProduct(randomProduct)
      setShowToast(true)

      setTimeout(() => {
        setShowToast(false)
      }, 5000)
    }

    // Initial toast
    const initialTimer = setTimeout(showRandomToast, 15000)

    // Recurring toasts
    const intervalTimer = setInterval(showRandomToast, 60000)

    return () => {
      clearTimeout(initialTimer)
      clearInterval(intervalTimer)
    }
  }, [])

  const heroProducts = [
    {
      name: "Apple Vision Pro",
      price: "$3,499.00",
      image: "/placeholder.svg?height=400&width=600",
      seller: "TechVault Pro",
      badge: "VERIFIED PRO",
    },
    {
      name: "KEF Blade Two Meta",
      price: "$28,000.00",
      image: "/placeholder.svg?height=400&width=600",
      seller: "AudioPhile Elite",
      badge: "FOUNDING SELLER",
    },
    {
      name: "Bluetti AC500 + B300S",
      price: "$4,999.00",
      image: "/placeholder.svg?height=400&width=600",
      seller: "PowerTech Solutions",
      badge: "VERIFIED PRO",
    },
  ]

  const categories = [
    { name: "Professional Camera Equipment", icon: Camera, count: "847 items", brands: "Canon, Sony, RED" },
    { name: "Pro Audio & Studio Gear", icon: Headphones, count: "423 items", brands: "Focal, KEF, Neumann" },
    { name: "High-Performance E-Bikes", icon: Bike, count: "156 items", brands: "Specialized, Riese & Müller" },
    { name: "Commercial Drones", icon: Drone, count: "89 items", brands: "DJI Inspire 3, Autel" },
    { name: "Backup Power Systems", icon: Battery, count: "178 items", brands: "Bluetti, Goal Zero" },
    { name: "Creator Workstations", icon: Monitor, count: "234 items", brands: "Apple, Puget Systems" },
  ]

  const featuredProducts = [
    {
      name: "Sony FX9 Full-Frame Camera",
      price: "$11,998.00",
      originalPrice: "$13,500.00",
      image: "/placeholder.svg?height=300&width=300",
      seller: "CineTech Pro",
      sellerType: "Verified Pro Seller",
      rating: 4.9,
      stock: 2,
      condition: "Factory Sealed",
      badges: ["UPS Insured", "Expert Available"],
      viewers: 17,
      priceDrop: "$1,502.00",
      soldOut: false,
    },
    {
      name: "PS5 Dev Kit",
      price: "$8,999.00",
      image: "/placeholder.svg?height=300&width=300",
      seller: "DevKit Vault",
      sellerType: "Founding Seller",
      rating: 5.0,
      stock: 0,
      condition: "Mint Condition",
      badges: ["Signature Required"],
      viewers: 8,
      priceDrop: "$500.00",
      soldOut: true,
      weeklyDeal: true,
    },
    {
      name: "Specialized Turbo Creo SL",
      price: "$12,500.00",
      image: "/placeholder.svg?height=300&width=300",
      seller: "Elite Cycles",
      sellerType: "Verified Pro Seller",
      rating: 4.8,
      stock: 1,
      condition: "Open Box",
      badges: ["UPS Insured", "Expert Available"],
      viewers: 12,
      priceDrop: "$2,000.00",
      soldOut: false,
      lastUnit: true,
    },
    {
      name: "DJI Inspire 3",
      price: "$16,499.00",
      image: "/placeholder.svg?height=300&width=300",
      seller: "AerialPro Solutions",
      sellerType: "Founding Seller",
      rating: 4.9,
      stock: 3,
      condition: "Factory Sealed",
      badges: ["Signature Required", "Expert Available"],
      viewers: 23,
      priceDrop: "$1,000.00",
      soldOut: false,
    },
  ]

  const trustLogos = [
    { name: "Escrow.com" },
    { name: "ID.me" },
    { name: "Coinbase Commerce" },
    { name: "BitPay" },
    { name: "Affirm" },
    { name: "Klarna" },
    { name: "Route" },
  ]

  const verifiedSellers = [
    {
      name: "Dex Volkov",
      image: "/placeholder.svg?height=80&width=80",
      specialty: "Pro Audio & Camera Equipment",
      rating: 4.9,
      sales: 247,
      badge: "Founding Seller #001",
      response: "Under 1 hour",
    },
    {
      name: "Eliza Chen",
      image: "/placeholder.svg?height=80&width=80",
      specialty: "Creator Workstations & Displays",
      rating: 5.0,
      sales: 189,
      badge: "Founding Seller #002",
      response: "Under 30 minutes",
    },
    {
      name: "Marcus Reid",
      image: "/placeholder.svg?height=80&width=80",
      specialty: "Commercial Drones & E-Bikes",
      rating: 4.8,
      sales: 156,
      badge: "Founding Seller #003",
      response: "Under 2 hours",
    },
  ]

  const testimonials = [
    {
      name: "Sarah K.",
      profession: "Professional Photographer",
      text: "The equipment authentication process gave me confidence to purchase a $8,000 camera sight unseen. Arrived exactly as described.",
      rating: 5,
    },
    {
      name: "Michael T.",
      profession: "Audio Engineer",
      text: "After being scammed on other marketplaces, ArbVault's escrow protection was a game-changer. Seller was responsive and knowledgeable.",
      rating: 5,
    },
    {
      name: "Jennifer R.",
      profession: "Content Creator",
      text: "The seller personally called me to ensure I understood all the features of my new workstation. Above and beyond service.",
      rating: 5,
    },
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroProducts.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroProducts.length) % heroProducts.length)
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/95 backdrop-blur supports-[backdrop-filter]:bg-gray-950/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-blue-500" />
                <span className="text-xl font-bold text-white ml-2">ArbVault</span>
                <Badge
                  variant="secondary"
                  className="bg-blue-500/20 text-blue-400 text-xs border border-blue-500/30 ml-4"
                >
                  BETA
                </Badge>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                Categories
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                Sellers
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                How It Works
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                Support
              </a>
            </nav>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search verified products..."
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 pl-10"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                className="border-gray-600 text-white hover:bg-gray-800 bg-transparent hidden md:inline-flex"
              >
                Sign In
              </Button>
              <Button className="hidden md:inline-flex bg-blue-600 hover:bg-blue-700">Join Now</Button>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-gray-300"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-800 py-4">
              <div className="flex flex-col space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search verified products..."
                    className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-400"
                  />
                </div>
                <nav className="flex flex-col space-y-2">
                  <a href="#" className="text-gray-300 hover:text-white transition-colors py-2">
                    Categories
                  </a>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors py-2">
                    Sellers
                  </a>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors py-2">
                    How It Works
                  </a>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors py-2">
                    Support
                  </a>
                </nav>
                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-800">
                  <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800 bg-transparent">
                    Sign In
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700">Join Now</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
                  The Trusted Marketplace for{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    Pro-Grade Equipment
                  </span>
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed">
                  Buy and sell professional equipment from carefully vetted sellers with complete escrow protection.
                </p>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-4">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2">
                  <Shield className="w-4 h-4 mr-2" />
                  SecureHold Escrow 🛡️
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-4 py-2">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  ID.me Verified Sellers ✅
                </Badge>
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 px-4 py-2">
                  <Truck className="w-4 h-4 mr-2" />
                  Same-Day Shipping
                </Badge>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2 text-blue-400" />
                  <span className="text-gray-300">10 Hand-Selected Sellers</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                  <span className="text-gray-300">100% ID Verified</span>
                </div>
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-2 text-purple-400" />
                  <span className="text-gray-300">Zero Fraud Rate</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                  Browse Pro Equipment
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gray-600 text-white hover:bg-gray-800 px-8 py-4 text-lg bg-transparent"
                >
                  Apply for Seller Access
                </Button>
              </div>
              <a href="#" className="text-sm text-blue-500 hover:text-blue-400 underline">
                New to Bitcoin? Learn How to Save 3%
              </a>
            </div>

            {/* Product Carousel */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 p-8">
                <div className="relative h-96">
                  {heroProducts.map((product, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-all duration-500 ${
                        index === currentSlide
                          ? "opacity-100 transform translate-x-0"
                          : "opacity-0 transform translate-x-full"
                      }`}
                    >
                      <div className="text-center space-y-4">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-64 object-cover rounded-lg transition-transform duration-500 hover:scale-105"
                        />
                        <div className="space-y-2">
                          <h3 className="text-2xl font-bold text-white">{product.name}</h3>
                          <p className="text-3xl font-bold text-blue-400">{product.price}</p>
                          <div className="flex items-center justify-center space-x-2">
                            <Badge
                              className={`${product.badge === "FOUNDING SELLER" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : "bg-green-500/20 text-green-400"}`}
                            >
                              {product.badge}
                            </Badge>
                            <span className="text-gray-300">by {product.seller}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Carousel Controls */}
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800/80 hover:bg-gray-700 text-white p-2 rounded-full transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800/80 hover:bg-gray-700 text-white p-2 rounded-full transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Carousel Indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {heroProducts.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentSlide ? "bg-blue-500" : "bg-gray-600"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-gray-900/80 backdrop-blur-sm border-y border-gray-800 overflow-hidden">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center mb-4">
            <p className="text-gray-300 text-sm font-medium">Trusted Payment & Protection Partners</p>
          </div>
          <div className="relative overflow-hidden">
            <div className="flex items-center space-x-12 py-2 animate-scroll">
              {[...trustLogos, ...trustLogos, ...trustLogos].map((logo, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100"
                >
                  <span className="text-gray-300 font-medium whitespace-nowrap text-sm">{logo.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Equipment Categories</h2>
            <p className="text-gray-300 text-lg">Professional-grade equipment from verified specialists</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {categories.map((category, index) => {
              const IconComponent = category.icon
              return (
                <Card
                  key={index}
                  className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 hover:border-blue-500/50 transition-all duration-300 cursor-pointer group"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="p-3 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                        <IconComponent className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-sm text-gray-300">{category.count}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400">{category.brands}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Seller Network Section */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Our Curated Seller Network</h2>
            <p className="text-gray-300 text-lg mb-2">
              We maintain strict standards - only 10 sellers have passed our verification
            </p>
            <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-4 py-1">
              Currently accepting applications for 5 additional sellers in Q1 2025
            </Badge>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {verifiedSellers.map((seller, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700 overflow-hidden group">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-6">
                    <img
                      src={seller.image || "/placeholder.svg"}
                      alt={seller.name}
                      className="w-16 h-16 rounded-full border-2 border-amber-500 transition-transform duration-500 group-hover:scale-105"
                    />
                    <div>
                      <h3 className="font-bold text-white">{seller.name}</h3>
                      <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        {seller.badge}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-gray-300 font-medium">{seller.specialty}</p>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                        <span className="text-gray-300">{seller.rating}/5.0</span>
                      </div>
                      <div className="flex items-center">
                        <Package className="w-4 h-4 text-blue-400 mr-1" />
                        <span className="text-gray-300">{seller.sales} Sales</span>
                      </div>
                    </div>

                    <div className="flex items-center text-sm">
                      <Clock className="w-4 h-4 text-green-400 mr-1" />
                      <span className="text-gray-300">Response time: {seller.response}</span>
                    </div>
                  </div>

                  <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">View Equipment</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Power User Section */}
      <section className="py-16 bg-gradient-to-r from-purple-950 to-blue-950">
        <div className="container mx-auto px-4">
          <Card className="bg-gray-900/80 border-purple-500/30 backdrop-blur">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl lg:text-3xl font-bold text-white">Meet Our Founding Seller</h2>
              </div>

              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <img
                      src="/placeholder.svg?height=80&width=80"
                      alt="Dex Volkov"
                      className="w-20 h-20 rounded-full border-2 border-amber-500"
                    />
                    <div>
                      <h3 className="text-2xl font-bold text-white">Dex Volkov</h3>
                      <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        FOUNDING SELLER #001
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-gray-300 italic">
                      "After being deplatformed from major marketplaces, I helped establish ArbVault's seller standards.
                      Every piece of equipment I sell is authenticated and ships same day."
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center">
                        <Package className="w-4 h-4 mr-1 text-blue-400" />
                        <span className="text-gray-300">247 Sales</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                        <span className="text-gray-300">99.9% Rating</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1 text-green-400" />
                        <span className="text-gray-300">Ships Within 4 Hours</span>
                      </div>
                    </div>

                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                      <p className="text-white font-medium">🎁 Get My Book FREE - Complete Your First Transaction</p>
                      <p className="text-sm text-gray-300 mt-1">(1+ reputation required)</p>
                    </div>

                    <Button className="bg-purple-600 hover:bg-purple-700">Browse Dex's Pro Audio Collection</Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white mb-4">Featured Products</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                      <span className="text-white">MacBook Pro M3 Max</span>
                      <Badge className="bg-green-500/20 text-green-400">SOLD</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                      <span className="text-white">PS5 Dev Kit</span>
                      <Badge className="bg-red-500/20 text-red-400">SOLD OUT</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                      <span className="text-white">DJI Inspire 3</span>
                      <Badge className="bg-blue-500/20 text-blue-400">AVAILABLE</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Why ArbVault Section */}
      <section className="py-16 bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Why ArbVault?</h2>
            <p className="text-gray-300 text-lg">The safest way to buy and sell professional equipment</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-12">
            <Card className="bg-gray-900 border-red-500/30">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-red-500 mb-4">The Problem</h3>
                <p className="text-gray-300 mb-4">
                  Pro equipment marketplaces are full of unverified sellers and risky transactions.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <X className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">No seller verification</span>
                  </li>
                  <li className="flex items-start">
                    <X className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">No equipment authentication</span>
                  </li>
                  <li className="flex items-start">
                    <X className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">No payment protection</span>
                  </li>
                  <li className="flex items-start">
                    <X className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">No expert support</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-green-500/30">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-green-500 mb-4">Our Solution</h3>
                <p className="text-gray-300 mb-4">A curated network of 10 verified professional sellers.</p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">Government ID verification required</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">Equipment authentication guarantee</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">SecureHold Escrow Protection</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">Direct access to equipment experts</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gray-900">
            <CardContent className="p-6 overflow-x-auto">
              <h3 className="text-xl font-bold text-white mb-6 text-center">How We Compare</h3>
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-300">Feature</th>
                    <th className="text-center py-3 px-4 text-blue-600">ArbVault</th>
                    <th className="text-center py-3 px-4 text-gray-300">eBay</th>
                    <th className="text-center py-3 px-4 text-gray-300">Facebook Marketplace</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-700">
                    <td className="py-3 px-4 text-gray-300">Seller Verification</td>
                    <td className="text-center py-3 px-4 text-green-500">Government ID Required</td>
                    <td className="text-center py-3 px-4 text-gray-300">Basic</td>
                    <td className="text-center py-3 px-4 text-gray-300">None</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="py-3 px-4 text-gray-300">Equipment Authentication</td>
                    <td className="text-center py-3 px-4 text-green-500">Guaranteed</td>
                    <td className="text-center py-3 px-4 text-gray-300">Limited</td>
                    <td className="text-center py-3 px-4 text-gray-300">None</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="py-3 px-4 text-gray-300">Payment Protection</td>
                    <td className="text-center py-3 px-4 text-green-500">SecureHold Escrow</td>
                    <td className="text-center py-3 px-4 text-gray-300">Basic</td>
                    <td className="text-center py-3 px-4 text-gray-300">None</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="py-3 px-4 text-gray-300">Expert Support</td>
                    <td className="text-center py-3 px-4 text-green-500">Direct Access</td>
                    <td className="text-center py-3 px-4 text-gray-300">Limited</td>
                    <td className="text-center py-3 px-4 text-gray-300">None</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-gray-300">Fraud Rate</td>
                    <td className="text-center py-3 px-4 text-green-500">0%</td>
                    <td className="text-center py-3 px-4 text-gray-300">Varies</td>
                    <td className="text-center py-3 px-4 text-gray-300">High</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Metrics Bar */}
      <section className="bg-blue-600 py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-2">
              <p className="text-3xl font-bold text-white">500+</p>
              <p className="text-blue-100">Products Listed</p>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-white">$2.3M</p>
              <p className="text-blue-100">Inventory Value</p>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-white">48-Hour</p>
              <p className="text-blue-100">Dispute Resolution</p>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-white">0%</p>
              <p className="text-blue-100">Fraud Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section className="py-16 bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Premium Equipment</h2>
            <p className="text-gray-300 text-lg">Professional-grade equipment from verified specialists</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <Card
                key={index}
                className="bg-gray-900 border-gray-700 hover:border-blue-500/50 transition-all duration-300 group relative overflow-hidden"
              >
                {product.soldOut && (
                  <div className="absolute inset-0 bg-black/60 z-10 flex items-center justify-center">
                    <Badge className="bg-red-500/20 text-red-400 text-lg px-4 py-2">SOLD OUT</Badge>
                  </div>
                )}

                {product.weeklyDeal && (
                  <div className="absolute top-2 left-2 z-10">
                    <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1">
                      <Clock className="w-3 h-3 mr-1" />
                      Seller's Weekly Deal: 14h 23m
                    </Badge>
                  </div>
                )}

                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-2 right-2 flex flex-col space-y-1">
                      {product.badges.map((badge, badgeIndex) => (
                        <Badge key={badgeIndex} className="bg-blue-500/20 text-blue-400 text-xs">
                          {badge}
                        </Badge>
                      ))}
                    </div>

                    {product.viewers > 0 && (
                      <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center">
                        <Eye className="w-3 h-3 mr-1 text-red-400" />
                        {product.viewers} viewing now
                      </div>
                    )}
                  </div>

                  <div className="p-4 space-y-3">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                          {product.name}
                        </h3>
                        <Badge
                          className={`${product.sellerType === "Founding Seller" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : "bg-green-500/20 text-green-400"} text-xs`}
                        >
                          {product.sellerType}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-300">by {product.seller}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xl font-bold text-white">{product.price}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-400 line-through ml-2">{product.originalPrice}</span>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-300">{product.rating}</span>
                      </div>
                    </div>

                    <div className="flex items-center text-sm text-blue-500">
                      <span>📊 {product.priceDrop} below retail</span>
                      <a href="#" className="ml-1 underline text-xs">
                        View History
                      </a>
                    </div>

                    <div className="flex items-center text-sm">
                      <Badge className="bg-gray-800 text-gray-300 font-normal">{product.condition}</Badge>

                      {product.lastUnit && <span className="ml-2 text-amber-500 text-xs">Last unit available</span>}
                      {!product.lastUnit && product.stock > 0 && (
                        <span className="ml-2 text-amber-500 text-xs">Only {product.stock} left in stock</span>
                      )}
                    </div>

                    <div className="text-xs text-gray-400 flex items-center">
                      <Package className="w-3 h-3 mr-1" />
                      <span>📦 Insured • Signature Required • Ships Today</span>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700" disabled={product.soldOut}>
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-600 text-white hover:bg-gray-800 bg-transparent"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">What Professionals Say</h2>
            <p className="text-gray-300 text-lg">Trusted by professionals across industries</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 italic mb-6">"{testimonial.text}"</p>
                  <div>
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    <p className="text-sm text-gray-400">{testimonial.profession}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Security Section */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Trust & Security</h2>
            <p className="text-gray-300 text-lg">Your protection is our priority</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-green-950 to-gray-900 border-green-500/30">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">SecureHold Escrow Protection</h3>
                <p className="text-gray-300">
                  Funds secured until delivery confirmed. Your money stays safe throughout the entire transaction.
                </p>
                <p className="text-gray-300 mt-2 font-medium">Every seller personally vetted.</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-950 to-gray-900 border-blue-500/30">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Verified Seller Network</h3>
                <p className="text-gray-300">
                  Government ID verification required. Every seller undergoes thorough background checks.
                </p>
                <p className="text-gray-300 mt-2 font-medium">Limited to 25 total sellers in 2025.</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-950 to-gray-900 border-purple-500/30">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Eye className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Buyer Protection Guarantee</h3>
                <p className="text-gray-300">
                  Full refund dispute resolution. Our team ensures fair outcomes for all transactions.
                </p>
                <p className="text-gray-300 mt-2 font-medium">We know every seller by name.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Newsletter Capture */}
      <section className="py-16 bg-gradient-to-r from-blue-950 to-purple-950">
        <div className="container mx-auto px-4">
          <Card className="bg-gray-900/80 border-blue-500/30 backdrop-blur max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">Join ArbVault</h3>
              <p className="text-gray-300 mb-6">Get 2% off your first order</p>

              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <Input
                  placeholder="Enter your email address"
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 flex-1"
                />
                <Button className="bg-blue-600 hover:bg-blue-700 px-8">Subscribe</Button>
              </div>

              <p className="text-sm text-gray-400 mb-2">Extra 3% off when paying with Bitcoin</p>
              <a href="#" className="text-sm text-blue-400 hover:text-blue-300 underline">
                How to Safely Acquire Bitcoin →
              </a>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 border-t border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Shield className="h-8 w-8 text-blue-500" />
                <span className="text-xl font-bold text-white">ArbVault</span>
              </div>
              <p className="text-gray-300 mb-4">The trusted marketplace for professional equipment.</p>
              <div className="flex space-x-4">
                <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30">Public launch 2025</Badge>
              </div>
              <p className="text-sm text-gray-400 mt-2">Join 147 professionals on our waitlist</p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Seller Standards
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Why Only 10 Sellers?
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Fee Structure
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Trust & Security</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    ID Verification Process
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Equipment Authentication
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Dispute Resolution
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Direct Seller Support
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Bitcoin Buying Guide
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pro Equipment Guides
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Private Discord (buyers only)
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Seller Applications
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-300">
            <p>&copy; 2025 ArbVault. All rights reserved. Built for professionals, by professionals.</p>
          </div>
        </div>
      </footer>

      {/* Live Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button size="lg" className="bg-blue-600 hover:bg-blue-700 rounded-full w-14 h-14 shadow-lg">
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>

      {/* Newsletter Slide-In */}
      {showNewsletter && (
        <div className="fixed bottom-6 right-6 z-40 w-80 animate-bounce-in">
          <Card className="bg-gray-900 border-purple-500 border-2 shadow-lg">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-bold text-white">Insider Access: Save 2% on Your First Order</h4>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setShowNewsletter(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-300 mb-3">Join verified buyers of pro-grade equipment</p>
              <div className="mb-3">
                <Input placeholder="Your email address" className="mb-2 bg-gray-800 border-gray-600" />
                <Button className="w-full bg-purple-600 hover:bg-purple-700">Subscribe</Button>
              </div>
              <div className="bg-amber-500/10 p-2 rounded-md text-xs">
                <p className="text-gray-300">💡 Pro tip: Pay with Bitcoin for an extra 3% off</p>
              </div>
              <div className="text-center mt-3">
                <button className="text-xs text-gray-500 hover:text-gray-300" onClick={() => setShowNewsletter(false)}>
                  Don't show again
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Social Proof Toast */}
      {showToast && (
        <div className="fixed bottom-24 left-6 z-40 animate-slide-in">
          <Card className="bg-gray-900 border-green-500 border shadow-lg">
            <CardContent className="p-3 flex items-center space-x-3">
              <Shield className="h-5 w-5 text-green-500" />
              <p className="text-sm text-gray-300">
                🛡️ {toastProduct} shipped to {toastLocation}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

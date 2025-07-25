"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  Shield, 
  Bitcoin,
  Sun,
  Moon,
  Heart,
  Package
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useTheme } from "@/components/theme-provider"

export function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="flex flex-col gap-4">
              <Link href="/categories" className="text-lg font-medium">
                Categories
              </Link>
              <Link href="/sellers" className="text-lg font-medium">
                Verified Sellers
              </Link>
              <Link href="/about" className="text-lg font-medium">
                About
              </Link>
              <Link href="/bitcoin-guide" className="text-lg font-medium">
                Bitcoin Guide
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Shield className="h-6 w-6" />
          <span className="hidden font-bold sm:inline-block">ArbVault</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:flex-1 md:items-center md:gap-6">
          <Link href="/categories" className="text-sm font-medium">
            Categories
          </Link>
          <Link href="/sellers" className="text-sm font-medium">
            Verified Sellers
          </Link>
          <Badge variant="outline" className="gap-1">
            <Bitcoin className="h-3 w-3" />
            5% BTC Discount
          </Badge>
        </nav>

        {/* Search */}
        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="hidden w-full max-w-sm items-center space-x-2 md:flex">
            <Input
              type="search"
              placeholder="Search premium items..."
              className="w-full"
            />
            <Button type="submit" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {/* Mobile Search */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {/* Wishlist */}
          <Button variant="ghost" size="icon" asChild className="relative">
            <Link href="/wishlist">
              <Heart className="h-5 w-5" />
              <Badge className="absolute -right-1 -top-1 h-4 w-4 p-0 text-xs">
                3
              </Badge>
            </Link>
          </Button>

          {/* Cart */}
          <Button variant="ghost" size="icon" asChild className="relative">
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              <Badge className="absolute -right-1 -top-1 h-4 w-4 p-0 text-xs">
                2
              </Badge>
            </Link>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatar.jpg" />
                  <AvatarFallback>DV</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/orders">
                  <Package className="mr-2 h-4 w-4" />
                  My Orders
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/wishlist">
                  <Heart className="mr-2 h-4 w-4" />
                  Wishlist
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/seller/apply" className="text-primary">
                  <Shield className="mr-2 h-4 w-4" />
                  Become a Seller
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isSearchOpen && (
        <div className="border-t p-4 md:hidden">
          <div className="flex items-center space-x-2">
            <Input
              type="search"
              placeholder="Search premium items..."
              className="flex-1"
            />
            <Button type="submit" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
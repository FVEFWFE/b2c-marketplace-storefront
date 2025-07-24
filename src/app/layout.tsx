import type { Metadata } from "next"
import { Funnel_Display } from "next/font/google"
import "./globals.css"
import { Toaster } from "@medusajs/ui"

const funnelDisplay = Funnel_Display({
  variable: "--font-funnel-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
})

export const metadata: Metadata = {
  title: {
    template: `%s | ${
      process.env.NEXT_PUBLIC_SITE_NAME ||
      "ArbVault - Premium Curated Marketplace"
    }`,
    default:
      process.env.NEXT_PUBLIC_SITE_NAME ||
      "ArbVault - Premium Curated Marketplace",
  },
  description:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
    "The premier, high-trust, curated marketplace for discerning collectors and professionals. Specializing in high-value, authenticated goods.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  ),
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params

  return (
    <html lang={locale} className="dark">
      <body
        className={`${funnelDisplay.className} antialiased bg-primary text-primary relative min-h-screen`}
      >
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  )
}

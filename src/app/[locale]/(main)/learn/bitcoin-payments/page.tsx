import type { Metadata } from "next"
import BitcoinGuide from "@/components/sections/BitcoinGuide/BitcoinGuide"

export const metadata: Metadata = {
  title: "How to Buy and Use Bitcoin",
  description:
    "Learn how to safely acquire and use Bitcoin for secure, private purchases on ArbVault. Complete guide with recommended wallets, exchanges, and step-by-step instructions. Save 5% with Bitcoin payments.",
  openGraph: {
    title: "Bitcoin Payment Guide - ArbVault",
    description:
      "Complete guide to using Bitcoin for secure, private purchases on ArbVault. Learn about wallets, exchanges, and our 5% Bitcoin discount.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/learn/bitcoin-payments`,
    siteName: "ArbVault - Premium Curated Marketplace",
    type: "article",
  },
}

export default function BitcoinPaymentsPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <BitcoinGuide />
      
      {/* Additional Resources */}
      <div className="max-w-4xl mx-auto mt-12">
        <div className="bg-component-secondary border border-primary rounded-lg p-6">
          <h3 className="text-xl font-bold text-primary mb-4">Additional Resources</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-component-primary border border-primary rounded-lg p-4">
              <h4 className="font-semibold text-primary mb-2">🔐 Security Best Practices</h4>
              <ul className="text-sm text-secondary space-y-1">
                <li>• Never share your private keys or seed phrase</li>
                <li>• Use hardware wallets for large amounts</li>
                <li>• Double-check addresses before sending</li>
                <li>• Enable two-factor authentication</li>
              </ul>
            </div>
            <div className="bg-component-primary border border-primary rounded-lg p-4">
              <h4 className="font-semibold text-primary mb-2">⚡ Lightning Network Benefits</h4>
              <ul className="text-sm text-secondary space-y-1">
                <li>• Instant payments (under 1 second)</li>
                <li>• Very low fees (typically under $0.01)</li>
                <li>• Perfect for online purchases</li>
                <li>• Supported by most modern wallets</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="mt-8 bg-component-secondary border border-primary rounded-lg p-6">
          <h3 className="text-xl font-bold text-primary mb-4">Frequently Asked Questions</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-primary mb-1">Why does ArbVault offer a Bitcoin discount?</h4>
              <p className="text-sm text-secondary">
                Bitcoin transactions have lower processing fees than traditional payment methods. We pass these savings directly to you as a 5% discount.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-primary mb-1">Is Bitcoin payment secure?</h4>
              <p className="text-sm text-secondary">
                Yes! Your Bitcoin payment is held in secure multi-signature escrow until you confirm receipt of your item. This provides the same protection as traditional payment methods.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-primary mb-1">What if the Bitcoin price changes during checkout?</h4>
              <p className="text-sm text-secondary">
                The Bitcoin amount is locked at the time of invoice creation. You have 30 minutes to complete the payment at the fixed rate.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-primary mb-1">Can I get a refund if paid with Bitcoin?</h4>
              <p className="text-sm text-secondary">
                Yes! If you need a refund, we can issue it in Bitcoin to your original address or convert to USD and issue via traditional methods.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
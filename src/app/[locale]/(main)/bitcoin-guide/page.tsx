import { Metadata } from "next"
import { DollarIcon, TickHeavyIcon, InfoIcon } from "@/icons"

export const metadata: Metadata = {
  title: "How to Buy Bitcoin - ArbVault",
  description: "Learn how to safely acquire and use Bitcoin for purchases on ArbVault. Get 5% off every purchase with crypto payments.",
}

export default function BitcoinGuidePage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="heading-xl mb-4">How to Buy and Use Bitcoin on ArbVault</h1>
        <p className="text-lg text-tertiary">
          Get 5% off every purchase when you pay with Bitcoin. Here's everything you need to know.
        </p>
      </div>

      {/* Benefits Section */}
      <div className="bg-component-secondary rounded-lg p-6 mb-8">
        <h2 className="heading-md mb-4">Why Pay with Bitcoin?</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex gap-3">
            <DollarIcon size={24} className="text-positive flex-shrink-0" />
            <div>
              <h3 className="font-semibold mb-1">5% Instant Discount</h3>
              <p className="text-sm text-tertiary">Save on every purchase automatically</p>
            </div>
          </div>
          <div className="flex gap-3">
            <TickHeavyIcon size={24} className="text-positive flex-shrink-0" />
            <div>
              <h3 className="font-semibold mb-1">Enhanced Privacy</h3>
              <p className="text-sm text-tertiary">No credit card or bank info required</p>
            </div>
          </div>
        </div>
      </div>

      {/* Step by Step Guide */}
      <div className="space-y-8">
        <section>
          <h2 className="heading-md mb-4">Step 1: Choose a Bitcoin Exchange</h2>
          <p className="text-md mb-4">
            The easiest way to buy Bitcoin is through a reputable exchange. We recommend:
          </p>
          <div className="space-y-4">
            <div className="border border-secondary rounded-lg p-4">
              <h3 className="font-semibold mb-2">Coinbase (Beginner Friendly)</h3>
              <ul className="text-sm text-tertiary space-y-1">
                <li>• Available in 100+ countries</li>
                <li>• Simple interface, perfect for first-time buyers</li>
                <li>• Buy with credit card, debit card, or bank transfer</li>
                <li>• Visit: coinbase.com</li>
              </ul>
            </div>
            <div className="border border-secondary rounded-lg p-4">
              <h3 className="font-semibold mb-2">Kraken (Lower Fees)</h3>
              <ul className="text-sm text-tertiary space-y-1">
                <li>• Professional exchange with competitive rates</li>
                <li>• More payment options including wire transfers</li>
                <li>• Advanced security features</li>
                <li>• Visit: kraken.com</li>
              </ul>
            </div>
            <div className="border border-secondary rounded-lg p-4">
              <h3 className="font-semibold mb-2">Cash App (US Only)</h3>
              <ul className="text-sm text-tertiary space-y-1">
                <li>• Instant purchases with debit card</li>
                <li>• No fees for buying Bitcoin</li>
                <li>• Integrated with existing Cash App balance</li>
                <li>• Download from App Store or Google Play</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="heading-md mb-4">Step 2: Buy Bitcoin</h2>
          <ol className="space-y-3">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-action text-action-on-primary rounded-full flex items-center justify-center font-semibold">1</span>
              <div>
                <p className="font-medium">Create an account on your chosen exchange</p>
                <p className="text-sm text-tertiary">You'll need to verify your identity (KYC process)</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-action text-action-on-primary rounded-full flex items-center justify-center font-semibold">2</span>
              <div>
                <p className="font-medium">Add a payment method</p>
                <p className="text-sm text-tertiary">Link your bank account or card</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-action text-action-on-primary rounded-full flex items-center justify-center font-semibold">3</span>
              <div>
                <p className="font-medium">Buy Bitcoin</p>
                <p className="text-sm text-tertiary">Start with a small amount to test the process</p>
              </div>
            </li>
          </ol>
        </section>

        <section>
          <h2 className="heading-md mb-4">Step 3: Pay on ArbVault</h2>
          <div className="bg-positive/10 border border-positive rounded-lg p-4 mb-4">
            <div className="flex gap-2 items-start">
              <InfoIcon size={20} className="text-positive flex-shrink-0 mt-1" />
              <div>
                <p className="font-medium text-positive mb-1">No Wallet Needed!</p>
                <p className="text-sm">
                  You can pay directly from your exchange account. When you click "Pay with Bitcoin" 
                  on ArbVault, you'll see a Bitcoin address and amount. Simply send from your exchange.
                </p>
              </div>
            </div>
          </div>
          <ol className="space-y-3">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-action text-action-on-primary rounded-full flex items-center justify-center font-semibold">1</span>
              <p>Click "Pay with Bitcoin" at checkout</p>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-action text-action-on-primary rounded-full flex items-center justify-center font-semibold">2</span>
              <p>Copy the Bitcoin address shown</p>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-action text-action-on-primary rounded-full flex items-center justify-center font-semibold">3</span>
              <p>Send the exact amount from your exchange</p>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-action text-action-on-primary rounded-full flex items-center justify-center font-semibold">4</span>
              <p>Payment confirmed in ~10 minutes</p>
            </li>
          </ol>
        </section>

        <section>
          <h2 className="heading-md mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">How much Bitcoin should I buy?</h3>
              <p className="text-sm text-tertiary">
                You only need to buy enough for your purchase plus a small network fee (usually $1-5). 
                For example, for a $500 item, buying $510 worth of Bitcoin is sufficient.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Is it safe?</h3>
              <p className="text-sm text-tertiary">
                Yes! Bitcoin transactions are irreversible and secure. Combined with our SecureHold Escrow, 
                your purchase is doubly protected.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">What if the price changes?</h3>
              <p className="text-sm text-tertiary">
                Our Bitcoin invoices lock in the USD price for 15 minutes, giving you plenty of time to 
                complete the payment without worrying about price fluctuations.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-component rounded-lg p-6">
          <h2 className="heading-md mb-4">Need Help?</h2>
          <p className="mb-4">
            Our support team is experienced with Bitcoin payments and happy to help you through your first purchase.
          </p>
          <div className="flex gap-4">
            <a href="/support" className="text-action hover:text-action-hover font-medium">
              Contact Support →
            </a>
            <a href="https://bitcoin.org/en/getting-started" target="_blank" rel="noopener noreferrer" className="text-action hover:text-action-hover font-medium">
              Learn More About Bitcoin →
            </a>
          </div>
        </section>
      </div>
    </main>
  )
}
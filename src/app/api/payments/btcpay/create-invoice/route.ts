import { NextRequest, NextResponse } from "next/server"

interface InvoiceRequest {
  amount: number
  orderId?: string
  metadata?: {
    originalAmount: number
    discount: number
    savings: number
  }
}

export async function POST(req: NextRequest) {
  try {
    const { amount, orderId, metadata }: InvoiceRequest = await req.json()

    // Validate required fields
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount specified" },
        { status: 400 }
      )
    }

    // BTCPay Server configuration from environment
    const btcpayUrl = process.env.BTCPAY_URL
    const apiKey = process.env.BTCPAY_API_KEY
    const storeId = process.env.BTCPAY_STORE_ID

    if (!btcpayUrl || !apiKey || !storeId) {
      console.error("Missing BTCPay configuration")
      return NextResponse.json(
        { error: "Payment service not configured" },
        { status: 500 }
      )
    }

    // Create BTCPay invoice
    const invoiceData = {
      amount: amount,
      currency: "USD",
      orderId: orderId || `arbvault-${Date.now()}`,
      notificationEmail: null,
      redirectURL: `${process.env.NEXT_PUBLIC_BASE_URL}/order-confirmation?payment=success&order=${orderId}`,
      defaultPaymentMethod: "BTC",
      checkout: {
        speedPolicy: "HighSpeed",
        paymentMethods: ["BTC", "BTC-LightningNetwork"],
        defaultLanguage: "en",
        htmlTitle: "ArbVault - Secure Bitcoin Payment",
        displayExpirationTimer: true,
        requiresRefundEmail: false,
        showRecommendedFee: true,
        redirectAutomatically: true
      },
      metadata: {
        buyerEmail: null,
        platform: "ArbVault",
        ...metadata,
        discount: metadata?.discount ? `${metadata.discount}% Bitcoin discount applied` : null
      },
      receipt: {
        enabled: true,
        showQR: true,
        showPayments: true
      }
    }

    // Call BTCPay Server API
    const response = await fetch(`${btcpayUrl}/api/v1/stores/${storeId}/invoices`, {
      method: "POST",
      headers: {
        "Authorization": `token ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(invoiceData)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("BTCPay API error:", response.status, errorText)
      return NextResponse.json(
        { error: "Failed to create payment invoice" },
        { status: 500 }
      )
    }

    const invoice = await response.json()

    // Return invoice details for frontend
    return NextResponse.json({
      id: invoice.id,
      checkoutLink: invoice.checkoutLink,
      amount: invoice.amount,
      currency: invoice.currency,
      status: invoice.status,
      createdTime: invoice.createdTime,
      expirationTime: invoice.expirationTime,
      orderId: invoice.orderId,
      btcAddress: invoice.addresses?.BTC,
      lightningInvoice: invoice.addresses?.["BTC-LightningNetwork"]
    })

  } catch (error) {
    console.error("Error creating BTCPay invoice:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
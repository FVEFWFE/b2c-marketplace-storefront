import { NextRequest, NextResponse } from "next/server"
import { BTCPayClient } from "@/lib/btcpay/client"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, orderId, currency = "USD" } = body

    if (!amount || !orderId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Initialize BTCPay client
    const btcpayClient = new BTCPayClient({
      url: process.env.BTCPAY_URL || "",
      apiKey: process.env.BTCPAY_API_KEY || "",
      storeId: process.env.BTCPAY_STORE_ID || "",
      webhookSecret: process.env.BTCPAY_WEBHOOK_SECRET || "",
    })

    // Create invoice
    const invoice = await btcpayClient.createInvoice({
      amount,
      currency,
      orderId,
      redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/order/confirmed?orderId=${orderId}`,
      notificationUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/btcpay/webhook`,
    })

    return NextResponse.json({
      invoiceId: invoice.id,
      checkoutLink: invoice.checkoutLink,
      btcAddress: invoice.btcAddress,
      btcAmount: invoice.btcAmount,
      expirationTime: invoice.expirationTime,
    })
  } catch (error) {
    console.error("Error creating BTCPay invoice:", error)
    return NextResponse.json(
      { error: "Failed to create invoice" },
      { status: 500 }
    )
  }
}
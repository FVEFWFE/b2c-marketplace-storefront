import { NextRequest, NextResponse } from "next/server"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ invoiceId: string }> }
) {
  try {
    const { invoiceId } = await params

    if (!invoiceId) {
      return NextResponse.json(
        { error: "Invoice ID is required" },
        { status: 400 }
      )
    }

    // BTCPay Server configuration
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

    // Get invoice status from BTCPay Server
    const response = await fetch(
      `${btcpayUrl}/api/v1/stores/${storeId}/invoices/${invoiceId}`,
      {
        method: "GET",
        headers: {
          "Authorization": `token ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error("BTCPay API error:", response.status, errorText)
      return NextResponse.json(
        { error: "Failed to get payment status" },
        { status: 500 }
      )
    }

    const invoice = await response.json()

    // Map BTCPay status to our simplified status
    const getSimplifiedStatus = (btcpayStatus: string, btcpayAdditionalStatus?: string) => {
      switch (btcpayStatus) {
        case "New":
          return "Pending"
        case "Processing":
          return "Processing"
        case "Settled":
          return "Complete"
        case "Invalid":
          return "Invalid"
        case "Expired":
          return "Expired"
        default:
          return "Unknown"
      }
    }

    const status = getSimplifiedStatus(invoice.status, invoice.additionalStatus)

    // Return simplified status information
    return NextResponse.json({
      id: invoice.id,
      status: status,
      btcpayStatus: invoice.status,
      additionalStatus: invoice.additionalStatus,
      amount: invoice.amount,
      currency: invoice.currency,
      orderId: invoice.orderId,
      createdTime: invoice.createdTime,
      expirationTime: invoice.expirationTime,
      paidAmount: invoice.payments?.reduce((sum: number, payment: any) => 
        sum + (payment.value || 0), 0) || 0,
      confirmations: invoice.payments?.[0]?.confirmations || 0,
      transactionId: invoice.payments?.[0]?.id || null,
      isFullyPaid: status === "Complete" || status === "Settled"
    })

  } catch (error) {
    console.error("Error checking BTCPay invoice status:", error)
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
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
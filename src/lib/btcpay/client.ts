import axios from "axios"

interface BTCPayConfig {
  url: string
  apiKey: string
  storeId: string
  webhookSecret: string
}

interface CreateInvoiceRequest {
  amount: number
  currency: string
  orderId: string
  buyerEmail?: string
  redirectUrl?: string
  notificationUrl?: string
  metadata?: Record<string, any>
}

interface BTCPayInvoice {
  id: string
  checkoutLink: string
  status: string
  amount: number
  currency: string
  createdTime: number
  expirationTime: number
  orderId: string
  btcAddress?: string
  btcAmount?: string
}

export class BTCPayClient {
  private config: BTCPayConfig
  private client: any

  constructor(config: BTCPayConfig) {
    this.config = config
    this.client = axios.create({
      baseURL: `${config.url}/api/v1`,
      headers: {
        "Authorization": `token ${config.apiKey}`,
        "Content-Type": "application/json",
      },
    })
  }

  async createInvoice(request: CreateInvoiceRequest): Promise<BTCPayInvoice> {
    try {
      const response = await this.client.post(
        `/stores/${this.config.storeId}/invoices`,
        {
          amount: request.amount.toString(),
          currency: request.currency,
          orderId: request.orderId,
          buyer: {
            email: request.buyerEmail,
          },
          checkout: {
            redirectURL: request.redirectUrl,
            redirectAutomatically: true,
          },
          notificationUrl: request.notificationUrl,
          metadata: request.metadata,
        }
      )

      return {
        id: response.data.id,
        checkoutLink: response.data.checkoutLink,
        status: response.data.status,
        amount: parseFloat(response.data.amount),
        currency: response.data.currency,
        createdTime: response.data.createdTime,
        expirationTime: response.data.expirationTime,
        orderId: response.data.orderId,
        btcAddress: response.data.addresses?.BTC,
        btcAmount: response.data.cryptoInfo?.find((c: any) => c.cryptoCode === "BTC")?.totalDue,
      }
    } catch (error) {
      console.error("Error creating BTCPay invoice:", error)
      throw error
    }
  }

  async getInvoice(invoiceId: string): Promise<BTCPayInvoice> {
    try {
      const response = await this.client.get(
        `/stores/${this.config.storeId}/invoices/${invoiceId}`
      )

      return {
        id: response.data.id,
        checkoutLink: response.data.checkoutLink,
        status: response.data.status,
        amount: parseFloat(response.data.amount),
        currency: response.data.currency,
        createdTime: response.data.createdTime,
        expirationTime: response.data.expirationTime,
        orderId: response.data.orderId,
        btcAddress: response.data.addresses?.BTC,
        btcAmount: response.data.cryptoInfo?.find((c: any) => c.cryptoCode === "BTC")?.totalDue,
      }
    } catch (error) {
      console.error("Error fetching BTCPay invoice:", error)
      throw error
    }
  }

  verifyWebhookSignature(payload: string, signature: string): boolean {
    // Implement webhook signature verification
    // This is a placeholder - actual implementation depends on BTCPay's webhook signature method
    const crypto = require("crypto")
    const expectedSignature = crypto
      .createHmac("sha256", this.config.webhookSecret)
      .update(payload)
      .digest("hex")
    
    return signature === expectedSignature
  }
}
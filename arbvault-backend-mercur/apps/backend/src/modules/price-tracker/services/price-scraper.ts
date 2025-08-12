import { setTimeout as delay } from 'timers/promises'
import Bottleneck from 'bottleneck'
import UserAgent from 'user-agents'
import { fetch } from 'undici'
import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'

puppeteer.use(StealthPlugin())

const RATE_LIMIT = process.env.PRICE_TRACKER_RATE_LIMIT || '1/s'
const PROXY = process.env.PRICE_TRACKER_PROXY_URL
const COMPLIANT = process.env.COMPLIANT_MODE === '1' || process.env.COMPLIANT_MODE === 'true'

function parseRateLimitToMs(rate: string): number {
  const [numStr, unit] = rate.split('/')
  const num = Number(numStr)
  if (!num || !unit) return 1000
  const perMs = unit.startsWith('s') ? 1000 : unit.startsWith('m') ? 60000 : 3600000
  return perMs / num
}

const limiter = new Bottleneck({ minTime: parseRateLimitToMs(RATE_LIMIT) })

export class PriceScraper {
  private browserPromise: Promise<puppeteer.Browser> | null = null

  private async getBrowser() {
    if (!this.browserPromise) {
      const args = ['--no-sandbox', '--disable-setuid-sandbox']
      if (PROXY) args.push(`--proxy-server=${PROXY}`)
      this.browserPromise = puppeteer.launch({ headless: 'new', args })
    }
    return this.browserPromise
  }

  private randomUA() {
    return new UserAgent().toString()
  }

  private async scrapeWithSelectors(url: string, selectors: string[]): Promise<string | null> {
    const browser = await this.getBrowser()
    const page = await browser.newPage()
    await page.setUserAgent(this.randomUA())
    await page.setRequestInterception(true)
    page.on('request', (req) => {
      const resourceType = req.resourceType()
      if (['image', 'stylesheet', 'font', 'media'].includes(resourceType)) req.abort()
      else req.continue()
    })
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 })
      const content = await page.content()
      if (/captcha|are you a robot/i.test(content)) {
        throw new Error('captcha_detected')
      }
      for (const sel of selectors) {
        try {
          await page.waitForSelector(sel, { timeout: 15000 })
          const text = await page.$eval(sel, (el) => el.textContent || '')
          if (text) return text
        } catch {}
      }
      return null
    } finally {
      await page.close().catch(() => {})
      await delay(2000 + Math.random() * 3000)
    }
  }

  private parsePrice(text: string | null): { price?: number; currency?: string } {
    if (!text) return {}
    const m = text.match(/([$£€])\s?([0-9,.]+)/)
    if (!m) return {}
    const currencyMap: Record<string, string> = { '$': 'USD', '£': 'GBP', '€': 'EUR' }
    const currency = currencyMap[m[1]] || 'USD'
    const num = Number(m[2].replace(/,/g, ''))
    if (Number.isFinite(num)) return { price: Math.round(num * 100), currency }
    return {}
  }

  async scrapeAmazon(url: string) {
    if (COMPLIANT) return {}
    return limiter.schedule(async () => {
      const text = await this.scrapeWithSelectors(url, [
        '#corePriceDisplay_desktop_feature_div .a-offscreen',
        '#priceblock_ourprice',
        '#priceblock_dealprice',
      ])
      return this.parsePrice(text)
    })
  }

  async scrapeWalmart(url: string) {
    if (COMPLIANT) return {}
    return limiter.schedule(async () => {
      const text = await this.scrapeWithSelectors(url, [
        'span[aria-label^="Current price"]',
        'span[itemprop="price"]',
      ])
      return this.parsePrice(text)
    })
  }

  async searchEbay(query: string) {
    const appId = process.env.EBAY_APP_ID
    if (!appId) return null
    const endpoint = 'https://svcs.ebay.com/services/search/FindingService/v1'
    const url = `${endpoint}?OPERATION-NAME=findItemsByKeywords&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=${appId}&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&keywords=${encodeURIComponent(query)}&paginationInput.entriesPerPage=5`
    try {
      const res = await fetch(url, { headers: { 'Accept': 'application/json' } })
      const data = await res.json()
      const items = data?.findItemsByKeywordsResponse?.[0]?.searchResult?.[0]?.item || []
      return items.map((i: any) => ({
        title: i.title?.[0],
        url: i.viewItemURL?.[0],
        price: Math.round(parseFloat(i.sellingStatus?.[0]?.currentPrice?.[0]?.__value__) * 100),
        currency: i.sellingStatus?.[0]?.currentPrice?.[0]?.['@currencyId'] || 'USD',
        seller_trust: 60,
      }))
    } catch (e) {
      return null
    }
  }

  async scrapeEbay(url: string) {
    if (COMPLIANT) return {}
    return limiter.schedule(async () => {
      const text = await this.scrapeWithSelectors(url, [
        '#prcIsum',
        '#mm-saleDscPrc',
        '#convbinPrice',
        'span[itemprop="price"]',
      ])
      return this.parsePrice(text)
    })
  }

  async searchAmazonHTML(query: string) {
    if (COMPLIANT) return []
    return limiter.schedule(async () => {
      const browser = await this.getBrowser()
      const page = await browser.newPage()
      await page.setUserAgent(this.randomUA())
      try {
        await page.goto(`https://www.amazon.com/s?k=${encodeURIComponent(query)}`, { waitUntil: 'domcontentloaded', timeout: 30000 })
        const content = await page.content()
        if (/captcha|are you a robot/i.test(content)) throw new Error('captcha_detected')
        const items = await page.$$eval('div.s-result-item h2 a', (links) =>
          links.slice(0, 5).map((a: any) => ({
            title: a.textContent?.trim() || '',
            url: a.href,
          }))
        )
        // try to fetch prices for the top items (best effort)
        const results: Array<{ title: string; url: string; price?: number; currency?: string; seller_trust?: number }> = []
        for (const item of items) {
          const parent = await page.$(`a[href='${item.url.replace(/'/g, "\\'")}']`) // best effort
          let priceText: string | null = null
          try {
            priceText = await page.$eval('#search .a-price .a-offscreen', (el) => el.textContent || '')
          } catch {}
          const parsed = this.parsePrice(priceText)
          results.push({ title: item.title, url: item.url, price: parsed.price, currency: parsed.currency, seller_trust: 80 })
        }
        return results
      } finally {
        await page.close().catch(() => {})
        await delay(1000 + Math.random() * 2000)
      }
    })
  }

  async searchWalmartHTML(query: string) {
    if (COMPLIANT) return []
    return limiter.schedule(async () => {
      const browser = await this.getBrowser()
      const page = await browser.newPage()
      await page.setUserAgent(this.randomUA())
      try {
        await page.goto(`https://www.walmart.com/search?q=${encodeURIComponent(query)}`, { waitUntil: 'domcontentloaded', timeout: 30000 })
        const content = await page.content()
        if (/captcha|are you a robot/i.test(content)) throw new Error('captcha_detected')
        const items = await page.$$eval('a[href*="/ip/"]', (links) =>
          links.slice(0, 5).map((a: any) => ({ title: a.getAttribute('aria-label') || a.textContent?.trim() || '', url: a.href }))
        )
        const results: Array<{ title: string; url: string; price?: number; currency?: string; seller_trust?: number }> = []
        for (const item of items) {
          let priceText: string | null = null
          try { priceText = await page.$eval('span[aria-label^="Current price"]', (el) => el.textContent || '') } catch {}
          const parsed = this.parsePrice(priceText)
          results.push({ title: item.title, url: item.url, price: parsed.price, currency: parsed.currency, seller_trust: 70 })
        }
        return results
      } finally {
        await page.close().catch(() => {})
        await delay(1000 + Math.random() * 2000)
      }
    })
  }

  async searchEbayHTML(query: string) {
    if (COMPLIANT) return []
    return limiter.schedule(async () => {
      const browser = await this.getBrowser()
      const page = await browser.newPage()
      await page.setUserAgent(this.randomUA())
      try {
        await page.goto(`https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(query)}`, { waitUntil: 'domcontentloaded', timeout: 30000 })
        const content = await page.content()
        if (/captcha|are you a robot/i.test(content)) throw new Error('captcha_detected')
        const items = await page.$$eval('.s-item', (nodes) =>
          nodes.slice(0, 5).map((n: any) => {
            const link = n.querySelector('.s-item__link') as HTMLAnchorElement
            const price = n.querySelector('.s-item__price') as HTMLElement
            return { title: link?.textContent?.trim() || '', url: link?.href || '', priceText: price?.textContent || '' }
          })
        )
        return items.map((i) => ({ title: i.title, url: i.url, ...({ ...this }.parsePrice(i.priceText)), seller_trust: 50 }))
      } finally {
        await page.close().catch(() => {})
        await delay(1000 + Math.random() * 2000)
      }
    })
  }
}
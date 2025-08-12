import pLimit from 'p-limit'
import Bottleneck from 'bottleneck'
import { ProductMatcher, Candidate } from './product-matcher'
import { PriceScraper } from './price-scraper'
import { CompetitorMatchRepo } from '../repositories/competitor-match-repo'
import { PriceHistoryRepo } from '../repositories/price-history-repo'

const limiter = new Bottleneck({ minTime: 1000 })
const COMPLIANT = process.env.COMPLIANT_MODE === '1' || process.env.COMPLIANT_MODE === 'true'

export class PriceTrackerService {
  private matcher = new ProductMatcher()
  private scraper = new PriceScraper()
  private matchRepo = new CompetitorMatchRepo()
  private priceRepo = new PriceHistoryRepo()

  constructor(private opts: Record<string, unknown>) {}

  async searchCompetitor(competitor: 'amazon' | 'ebay' | 'walmart', title: string): Promise<Candidate[]> {
    const variants = this.matcher.buildSearchVariants(title)
    const candidates: Candidate[] = []

    for (const v of variants) {
      if (competitor === 'ebay') {
        const api = await this.scraper.searchEbay(v)
        if (api && api.length) {
          candidates.push(...api.map((i) => ({ title: i.title, url: i.url, price: i.price, currency: i.currency, seller_trust: i.seller_trust })))
          break
        }
      }
      if (!COMPLIANT) {
        if (competitor === 'amazon') {
          const html = await this.scraper.searchAmazonHTML(v)
          if (html && html.length) { candidates.push(...html); break }
        } else if (competitor === 'walmart') {
          const html = await this.scraper.searchWalmartHTML(v)
          if (html && html.length) { candidates.push(...html); break }
        } else if (competitor === 'ebay') {
          const html = await this.scraper.searchEbayHTML(v)
          if (html && html.length && candidates.length === 0) { candidates.push(...html); break }
        }
      }
    }

    // fallback to search URL when no candidates
    if (candidates.length === 0) {
      const base = competitor === 'amazon' ? 'https://www.amazon.com/s?k=' : competitor === 'walmart' ? 'https://www.walmart.com/search?q=' : 'https://www.ebay.com/sch/i.html?_nkw='
      candidates.push({ title: `${competitor} search for ${variants[0]}`, url: base + encodeURIComponent(variants[0]), seller_trust: 40 })
    }

    return candidates.slice(0, 5)
  }

  async researchProduct(productId: string, productTitle: string, ourPriceCents?: number) {
    const competitors: Array<'amazon' | 'ebay' | 'walmart'> = ['amazon', 'ebay', 'walmart']
    const allMatches: any[] = []

    const limit = pLimit(2)
    await Promise.all(
      competitors.map((comp) =>
        limit(async () => {
          const candidates = await this.searchCompetitor(comp, productTitle)
          let best: { candidate: Candidate; score: number; reason?: string } | undefined
          const scored = candidates.map((c) => {
            const s = this.matcher.scoreCandidate(productTitle, ourPriceCents ? ourPriceCents / 100 : undefined, c)
            if (!best || s.score > best.score) best = { candidate: c, score: s.score, reason: s.reason }
            return { candidate: c, score: s.score, reason: s.reason }
          })

          const chosen = best && best.score >= 70 ? best : undefined
          const saved = await this.matchRepo.upsert({
            product_id: productId,
            product_title: productTitle,
            competitor_name: comp,
            competitor_url: chosen ? chosen.candidate.url : null,
            competitor_title: chosen ? chosen.candidate.title : null,
            match_confidence: chosen ? Math.round(chosen.score) : Math.round(best?.score || 0),
            is_manual_override: false,
            last_searched: new Date().toISOString(),
          })

          if (saved.competitor_url) {
            await this.scrapeAndPersist(saved.id, comp, saved.competitor_url)
          }

          allMatches.push({
            competitor: comp,
            best: chosen ? { confidence: Math.round(chosen.score), url: chosen.candidate.url } : null,
            candidates: scored.map((s) => ({ url: s.candidate.url, score: Math.round(s.score) })),
          })
        })
      )
    )

    return { matches: allMatches }
  }

  async scrapeAndPersist(matchId: string, competitor: 'amazon' | 'ebay' | 'walmart', url: string) {
    if (COMPLIANT) return
    return limiter.schedule(async () => {
      try {
        let res: { price?: number; currency?: string } = {}
        if (competitor === 'amazon') res = await this.scraper.scrapeAmazon(url)
        if (competitor === 'walmart') res = await this.scraper.scrapeWalmart(url)
        if (competitor === 'ebay') res = await this.scraper.scrapeEbay(url)
        if (res.price && res.currency) {
          await this.priceRepo.insert({ competitor_match_id: matchId, competitor_price: res.price, currency_code: res.currency, source: 'scrape', notes: null })
        }
      } catch (e: any) {
        if (e?.message === 'captcha_detected') {
          // backoff; rely on scheduler to retry later
        }
      }
    })
  }
}
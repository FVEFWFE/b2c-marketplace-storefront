import stringSimilarity from 'string-similarity'
import { distance as levenshteinDistance } from 'fast-levenshtein'
import { z } from 'zod'

export interface ExtractedAttributes {
  brand?: string
  model?: string
  color?: string
  size?: string
  capacity?: string
  edition?: string
}

export interface Candidate {
  title: string
  url: string
  price?: number
  currency?: string
  seller_trust?: number
  reviews?: { count?: number; rating?: number }
  condition?: 'new' | 'used' | 'refurbished' | 'unknown'
  attributes?: ExtractedAttributes
}

export interface MatchResult {
  competitor: 'amazon' | 'ebay' | 'walmart'
  best?: { candidate: Candidate; confidence: number; reason?: string }
  candidates: Array<{ candidate: Candidate; confidence: number; reason?: string }>
}

const stopWords = new Set(['for', 'with', 'new', 'original', 'the', 'and'])

export class ProductMatcher {
  normalizeTitle(title: string): string {
    const lower = title.toLowerCase()
    const stripped = lower.replace(/[^a-z0-9\s-]/g, ' ')
    const tokens = stripped.split(/\s+/).filter(Boolean).filter((t) => !stopWords.has(t))
    return tokens.join(' ')
  }

  extractAttributes(title: string): ExtractedAttributes {
    const t = title
    const attrs: ExtractedAttributes = {}
    const brandMatch = t.match(/^(\w+)/)
    if (brandMatch) attrs.brand = brandMatch[1]
    const modelMatch = t.match(/([A-Z]{2,}[0-9]{2,}[A-Z0-9-]*)/i)
    if (modelMatch) attrs.model = modelMatch[1]
    const colorMatch = t.match(/\b(black|white|silver|space gray|blue|red|green|pink)\b/i)
    if (colorMatch) attrs.color = colorMatch[1]
    const capacityMatch = t.match(/(\d+\s?(gb|tb|oz|ml|l))\b/i)
    if (capacityMatch) attrs.capacity = capacityMatch[1]
    const sizeMatch = t.match(/(\d{2,}\s?(inch|in|"|cm))\b/i)
    if (sizeMatch) attrs.size = sizeMatch[1]
    const editionMatch = t.match(/\b(pro|max|mini|plus|gen|generation|11th|2nd)\b/i)
    if (editionMatch) attrs.edition = editionMatch[1]
    return attrs
  }

  buildSearchVariants(title: string): string[] {
    const norm = this.normalizeTitle(title)
    const attrs = this.extractAttributes(title)
    const variants = new Set<string>()
    variants.add(norm)
    if (attrs.brand && attrs.model) variants.add(`${attrs.brand} ${attrs.model}`)
    if (attrs.model) variants.add(`${attrs.model} ${attrs.edition || ''} ${attrs.color || ''}`.trim())
    if (attrs.brand && attrs.model && (attrs.color || attrs.capacity)) {
      variants.add(`${attrs.brand} ${attrs.model} ${attrs.color || ''} ${attrs.capacity || ''}`.trim())
    }
    return Array.from(variants)
  }

  private titleSimilarity(a: string, b: string): number {
    const nA = this.normalizeTitle(a)
    const nB = this.normalizeTitle(b)
    const sim = stringSimilarity.compareTwoStrings(nA, nB) // 0..1
    const lev = levenshteinDistance(nA, nB)
    const levNorm = 1 - Math.min(1, lev / Math.max(nA.length, 1))
    return (sim * 0.7 + levNorm * 0.3) * 100
  }

  scoreCandidate(ourTitle: string, ourPrice?: number, candidate?: Candidate): { score: number; reason?: string } {
    if (!candidate) return { score: 0, reason: 'no_candidate' }
    const titleScore = this.titleSimilarity(ourTitle, candidate.title)

    let priceScore = 0
    if (ourPrice && candidate.price) {
      const ratio = candidate.price / ourPrice
      if (ratio > 10 || ratio < 0.1) {
        return { score: 0, reason: 'price_outlier' }
      }
      const diff = Math.abs(ratio - 1)
      priceScore = Math.max(0, 100 - diff * 200) // within 50% -> >=0
    }

    const trust = candidate.seller_trust ?? 0
    const social = Math.min(100, (candidate.reviews?.count || 0) / 1000 * 100)

    let conditionPenalty = 0
    if (candidate.condition && candidate.condition !== 'new') {
      conditionPenalty = 20
    }

    // Weighted total
    let total = titleScore * 0.4 + priceScore * 0.3 + trust * 0.2 + social * 0.1 - conditionPenalty
    total = Math.max(0, Math.min(100, total))

    return { score: total, reason: total >= 70 ? undefined : 'title_similarity_low' }
  }
}
import { Pool } from 'pg'
import { randomUUID } from 'crypto'
import { PriceHistory } from '../models/price-history'

function getPool(): Pool {
  const connectionString = process.env.DATABASE_URL || process.env.MEDUSA_DATABASE_URL
  if (!connectionString) {
    throw new Error('DATABASE_URL not set')
  }
  return new Pool({ connectionString, max: 5 })
}

export class PriceHistoryRepo {
  private pool: Pool
  constructor() {
    this.pool = getPool()
  }

  async insert(entry: Omit<PriceHistory, 'id' | 'last_scraped'> & { last_scraped?: string }): Promise<PriceHistory> {
    const id = randomUUID()
    const lastScraped = entry.last_scraped || new Date().toISOString()
    const { rows } = await this.pool.query(
      `INSERT INTO price_history (id, competitor_match_id, competitor_price, currency_code, last_scraped, source, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING *`,
      [id, entry.competitor_match_id, entry.competitor_price, entry.currency_code, lastScraped, entry.source, entry.notes]
    )
    return rows[0]
  }

  async latestByMatch(matchId: string): Promise<PriceHistory | null> {
    const { rows } = await this.pool.query(
      `SELECT * FROM price_history WHERE competitor_match_id = $1 ORDER BY last_scraped DESC LIMIT 1`,
      [matchId]
    )
    return rows[0] || null
  }

  async latestByProduct(productId: string): Promise<Array<{ competitor_name: string; match_confidence: number; price: number | null; currency_code: string | null; competitor_url: string | null }>> {
    const { rows } = await this.pool.query(
      `SELECT cm.competitor_name, cm.match_confidence, cm.competitor_url,
        (SELECT ph.competitor_price FROM price_history ph WHERE ph.competitor_match_id = cm.id ORDER BY last_scraped DESC LIMIT 1) AS price,
        (SELECT ph.currency_code FROM price_history ph WHERE ph.competitor_match_id = cm.id ORDER BY last_scraped DESC LIMIT 1) AS currency_code
       FROM competitor_match cm WHERE cm.product_id = $1 ORDER BY cm.competitor_name`,
      [productId]
    )
    return rows
  }
}
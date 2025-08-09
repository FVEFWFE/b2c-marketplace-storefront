import { Client, Pool } from 'pg'
import { randomUUID } from 'crypto'
import { CompetitorMatch, CompetitorName } from '../models/competitor-match'

function getPool(): Pool {
  const connectionString = process.env.DATABASE_URL || process.env.MEDUSA_DATABASE_URL
  if (!connectionString) {
    throw new Error('DATABASE_URL not set')
  }
  return new Pool({ connectionString, max: 5 })
}

export class CompetitorMatchRepo {
  private pool: Pool
  constructor() {
    this.pool = getPool()
  }

  async upsert(match: Omit<CompetitorMatch, 'id' | 'created_at' | 'updated_at'> & { id?: string }): Promise<CompetitorMatch> {
    const id = match.id || randomUUID()
    const now = new Date().toISOString()
    const { rows } = await this.pool.query(
      `INSERT INTO competitor_match (id, product_id, product_title, competitor_name, competitor_url, competitor_title, match_confidence, is_manual_override, created_at, updated_at, last_searched)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       ON CONFLICT (product_id, competitor_name) DO UPDATE SET
         competitor_url = EXCLUDED.competitor_url,
         competitor_title = EXCLUDED.competitor_title,
         match_confidence = EXCLUDED.match_confidence,
         is_manual_override = EXCLUDED.is_manual_override,
         updated_at = EXCLUDED.updated_at,
         last_searched = EXCLUDED.last_searched
       RETURNING *`,
      [
        id,
        match.product_id,
        match.product_title,
        match.competitor_name,
        match.competitor_url,
        match.competitor_title,
        match.match_confidence,
        match.is_manual_override,
        now,
        now,
        match.last_searched,
      ]
    )
    return rows[0]
  }

  async getByProduct(productId: string): Promise<CompetitorMatch[]> {
    const { rows } = await this.pool.query('SELECT * FROM competitor_match WHERE product_id = $1 ORDER BY competitor_name', [productId])
    return rows
  }

  async getAll(): Promise<CompetitorMatch[]> {
    const { rows } = await this.pool.query('SELECT * FROM competitor_match ORDER BY updated_at DESC LIMIT 1000')
    return rows
  }

  async override(productId: string, productTitle: string, competitorName: CompetitorName, url: string): Promise<CompetitorMatch> {
    return this.upsert({
      product_id: productId,
      product_title: productTitle,
      competitor_name: competitorName,
      competitor_url: url,
      competitor_title: null,
      match_confidence: 100,
      is_manual_override: true,
      last_searched: new Date().toISOString(),
    })
  }
}
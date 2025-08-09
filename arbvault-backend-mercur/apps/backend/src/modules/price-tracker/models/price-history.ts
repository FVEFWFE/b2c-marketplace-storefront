export interface PriceHistory {
  id: string
  competitor_match_id: string
  competitor_price: number
  currency_code: string
  last_scraped: string
  source: 'scrape' | 'api'
  notes: string | null
}
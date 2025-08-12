export type CompetitorName = 'amazon' | 'ebay' | 'walmart'

export interface CompetitorMatch {
  id: string
  product_id: string
  product_title: string
  competitor_name: CompetitorName
  competitor_url: string | null
  competitor_title: string | null
  match_confidence: number
  is_manual_override: boolean
  created_at: string
  updated_at: string
  last_searched: string | null
}
-- competitor_match table
CREATE TABLE IF NOT EXISTS competitor_match (
  id UUID PRIMARY KEY,
  product_id TEXT NOT NULL,
  product_title TEXT NOT NULL,
  competitor_name TEXT NOT NULL,
  competitor_url TEXT,
  competitor_title TEXT,
  match_confidence INTEGER NOT NULL DEFAULT 0,
  is_manual_override BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  last_searched TIMESTAMPTZ,
  UNIQUE (product_id, competitor_name)
);

CREATE INDEX IF NOT EXISTS idx_competitor_match_product_id ON competitor_match (product_id);
CREATE INDEX IF NOT EXISTS idx_competitor_match_competitor_name ON competitor_match (competitor_name);

-- price_history table
CREATE TABLE IF NOT EXISTS price_history (
  id UUID PRIMARY KEY,
  competitor_match_id UUID NOT NULL REFERENCES competitor_match(id) ON DELETE CASCADE,
  competitor_price INTEGER NOT NULL,
  currency_code TEXT NOT NULL,
  last_scraped TIMESTAMPTZ NOT NULL,
  source TEXT NOT NULL,
  notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_price_history_match_id ON price_history (competitor_match_id);
CREATE INDEX IF NOT EXISTS idx_price_history_last_scraped ON price_history (last_scraped);
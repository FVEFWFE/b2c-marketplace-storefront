import type { Router, Express } from 'express'
import express from 'express'
import { CompetitorMatchRepo } from '../../repositories/competitor-match-repo'
import { PriceHistoryRepo } from '../../repositories/price-history-repo'

export function registerStoreRouter(app: Router | Express) {
  const router = express.Router()
  const priceRepo = new PriceHistoryRepo()

  router.get('/:product_id', async (req, res) => {
    const productId = req.params.product_id
    const latest = await priceRepo.latestByProduct(productId)
    const response = latest.map((l) => ({
      competitor: l.competitor_name,
      confidence: l.match_confidence,
      url: l.competitor_url,
      latest_price: l.price,
      currency: l.currency_code,
    }))
    res.json({ product_id: productId, results: response })
  })

  app.use('/store/price-tracker', router)
}
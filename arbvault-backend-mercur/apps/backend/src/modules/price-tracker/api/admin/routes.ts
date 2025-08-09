import type { Router, Express } from 'express'
import express from 'express'
import { CompetitorMatchRepo } from '../../repositories/competitor-match-repo'
import { PriceHistoryRepo } from '../../repositories/price-history-repo'
import { PriceTrackerService } from '../../services/price-tracker-service'

const service = new PriceTrackerService({})
const matchRepo = new CompetitorMatchRepo()
const priceRepo = new PriceHistoryRepo()

export function registerAdminRouter(app: Router | Express) {
  const router = express.Router()

  router.post('/research', express.json(), async (req, res) => {
    const { product_id, product_title } = req.body || {}
    if (!product_id || !product_title) return res.status(400).json({ error: 'product_id and product_title required' })
    const result = await service.researchProduct(product_id, product_title)
    res.json(result)
  })

  router.post('/manual-override', express.json(), async (req, res) => {
    const { product_id, product_title, competitor_name, competitor_url } = req.body || {}
    if (!product_id || !product_title || !competitor_name || !competitor_url) return res.status(400).json({ error: 'missing fields' })
    const saved = await matchRepo.override(product_id, product_title, competitor_name, competitor_url)
    await service.scrapeAndPersist(saved.id, competitor_name, competitor_url)
    res.json({ ok: true, saved })
  })

  router.get('/status', async (req, res) => {
    const all = await matchRepo.getAll()
    res.json(all)
  })

  router.post('/queue/retry-failed', async (req, res) => {
    const all = await matchRepo.getAll()
    let retried = 0
    for (const m of all) {
      if (m.competitor_url) {
        retried++
        await service.scrapeAndPersist(m.id, m.competitor_name as any, m.competitor_url)
      }
    }
    res.json({ retried })
  })

  app.use('/admin/price-tracker', router)
}
import schedule from 'node-schedule'
import { PriceTrackerService } from '../services/price-tracker-service'
import { CompetitorMatchRepo } from '../repositories/competitor-match-repo'

const RESEARCH_INTERVAL_DAYS = Number(process.env.PRICE_TRACKER_RESEARCH_INTERVAL_DAYS || 7)
const SCRAPE_INTERVAL_HOURS = Number(process.env.PRICE_TRACKER_SCRAPE_INTERVAL_HOURS || 24)

export async function registerSchedulers(container: any) {
  const service = new PriceTrackerService({})
  const matchRepo = new CompetitorMatchRepo()

  // Daily scrape of known URLs
  schedule.scheduleJob(`*/${SCRAPE_INTERVAL_HOURS} * * * *`, async () => {
    const all = await matchRepo.getAll()
    for (const m of all) {
      if (m.competitor_url) {
        await service.scrapeAndPersist(m.id, m.competitor_name as any, m.competitor_url)
      }
    }
  })

  // Weekly re-search: simplistic approach re-run research for last 200 products found in competitor_match
  schedule.scheduleJob(`0 3 */${RESEARCH_INTERVAL_DAYS} * *`, async () => {
    const seen = await matchRepo.getAll()
    const byProduct = Array.from(new Set(seen.map((s) => `${s.product_id}|${s.product_title}`)))
    for (const key of byProduct.slice(0, 200)) {
      const [id, title] = key.split('|')
      await service.researchProduct(id, title)
    }
  })
}
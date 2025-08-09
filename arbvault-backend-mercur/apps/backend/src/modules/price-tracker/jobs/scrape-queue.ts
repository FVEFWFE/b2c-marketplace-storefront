import Bottleneck from 'bottleneck'
import { PriceTrackerService } from '../services/price-tracker-service'

const limiter = new Bottleneck({ minTime: 1000, maxConcurrent: 2 })
const service = new PriceTrackerService({})

export function enqueueScrape(matchId: string, competitor: 'amazon' | 'ebay' | 'walmart', url: string) {
  return limiter.schedule(() => service.scrapeAndPersist(matchId, competitor, url))
}
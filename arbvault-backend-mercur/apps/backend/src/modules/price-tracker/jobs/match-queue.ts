import Bottleneck from 'bottleneck'
import { PriceTrackerService } from '../services/price-tracker-service'

const limiter = new Bottleneck({ minTime: 1000, maxConcurrent: 1 })
const service = new PriceTrackerService({})

export function enqueueResearch(productId: string, title: string) {
  return limiter.schedule(() => service.researchProduct(productId, title))
}
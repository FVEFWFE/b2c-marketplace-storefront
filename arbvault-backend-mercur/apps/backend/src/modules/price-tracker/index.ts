import type { Express } from 'express'
import { registerStoreRouter } from './api/store/routes'
import { registerAdminRouter } from './api/admin/routes'
import { registerSchedulers } from './jobs/scheduler'
import { registerProductSubscribers } from './subscribers/product-events'

export async function registerPriceTracker(app: Express | any, container: any) {
  registerStoreRouter(app)
  registerAdminRouter(app)

  await registerSchedulers(container)
  await registerProductSubscribers(container)
}

export default registerPriceTracker
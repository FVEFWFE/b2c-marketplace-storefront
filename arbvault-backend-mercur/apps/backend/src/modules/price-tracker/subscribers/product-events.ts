export async function registerProductSubscribers(container: any) {
  try {
    const eventBus = container?.resolve?.('eventBusService') || container?.resolve?.('eventBus')
    if (!eventBus) return
    const { PriceTrackerService } = await import('../services/price-tracker-service')
    const service = new PriceTrackerService({})

    const onProduct = async (data: any) => {
      const id = data?.id || data?.product?.id
      const title = data?.title || data?.product?.title
      if (id && title) {
        await service.researchProduct(id, title)
      }
    }

    eventBus.subscribe('product.created', onProduct)
    eventBus.subscribe('product.updated', onProduct)
  } catch {}
}
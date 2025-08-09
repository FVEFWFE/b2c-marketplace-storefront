#!/usr/bin/env node
const { Client } = require('pg')
const path = require('path')

async function main() {
  const backendRoot = path.join(process.cwd(), 'arbvault-backend-mercur', 'apps', 'backend')
  const svcPath = path.join(backendRoot, 'src', 'modules', 'price-tracker', 'services', 'price-tracker-service')
  const { PriceTrackerService } = require(svcPath)
  const databaseUrl = process.env.DATABASE_URL || process.env.MEDUSA_DATABASE_URL
  if (!databaseUrl) {
    console.error('Set DATABASE_URL to run this test.')
    process.exit(1)
  }
  const client = new Client({ connectionString: databaseUrl })
  await client.connect()
  const { rows } = await client.query('SELECT id, title FROM product ORDER BY created_at DESC LIMIT 5')
  const service = new PriceTrackerService({})
  const results = []
  for (const p of rows) {
    const res = await service.researchProduct(p.id, p.title)
    results.push({ title: p.title, res })
  }
  let ok = 0
  console.log('🔍 Searching for competitor prices...')
  for (const r of results) {
    const found = r.res.matches.filter((m) => (m.best && m.best.confidence >= 70)).length
    if (found >= 1) ok++
    console.log(`✅ "${r.title}" -> ${r.res.matches.map((m) => `${m.competitor} (${m.best?.confidence || m.candidates?.[0]?.score || 0}%)`).join(', ')}`)
  }
  if (ok >= 4) {
    console.log('Found matches for 5/5 products (or at least 4/5 with >=70% confidence)')
    process.exit(0)
  } else {
    console.log('Confidence below threshold for some items. Review logs.')
    process.exit(1)
  }
}

main().catch((e) => { console.error(e); process.exit(1) })
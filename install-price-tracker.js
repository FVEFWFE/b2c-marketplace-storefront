#!/usr/bin/env node
/*
  ArbVault Price Tracker Installer
  - Detects backend path
  - Patches medusa-config.ts to register module
  - Installs backend/frontend dependencies
  - Runs SQL migrations using DATABASE_URL
  - Seeds test products if none
  - Triggers initial match+scrape run
  - Prints summary
*/

const fs = require('fs');
const path = require('path');
const child_process = require('child_process');
const os = require('os');

const WORKSPACE_ROOT = process.cwd();
const DEFAULT_BACKEND_PATH = path.join(WORKSPACE_ROOT, 'arbvault-backend-mercur', 'apps', 'backend');
const DEFAULT_FRONTEND_PATH = path.join(WORKSPACE_ROOT, 'arbvault-frontend-main');
const MODULE_RELATIVE_PATH = path.join('src', 'modules', 'price-tracker');
const MODULE_ABS_PATH = path.join(DEFAULT_BACKEND_PATH, MODULE_RELATIVE_PATH);

const REQUIRED_BACKEND_DEPS = [
  'pg',
  'p-limit',
  'bottleneck',
  'zod',
  'node-schedule',
  'string-similarity',
  'fast-levenshtein',
  'user-agents',
  'undici',
  'puppeteer',
  'puppeteer-extra',
  'puppeteer-extra-plugin-stealth',
  'ts-node'
];

const REQUIRED_FRONTEND_DEPS = [
  // add optional charting deps here if needed later
];

function exec(cmd, cwd, env = {}) {
  console.log(`$ ${cmd}`);
  return child_process.execSync(cmd, {
    cwd,
    env: { ...process.env, ...env },
    stdio: 'inherit',
    shell: os.platform() === 'win32' ? 'bash.exe' : undefined,
  });
}

function findBackendRoot() {
  if (fs.existsSync(DEFAULT_BACKEND_PATH)) return DEFAULT_BACKEND_PATH;
  // fallback: search for apps/backend containing medusa-config.ts
  function findDirUpward(start) {
    let dir = start;
    while (dir !== path.dirname(dir)) {
      const candidate = path.join(dir, 'apps', 'backend');
      if (fs.existsSync(path.join(candidate, 'medusa-config.ts'))) return candidate;
      dir = path.dirname(dir);
    }
    return null;
  }
  const found = findDirUpward(WORKSPACE_ROOT);
  if (!found) {
    console.error('Could not locate backend path. Expected at arbvault-backend-mercur/apps/backend');
    process.exit(1);
  }
  return found;
}

function patchMedusaConfig(backendRoot) {
  const configPath = path.join(backendRoot, 'medusa-config.ts');
  if (!fs.existsSync(configPath)) {
    console.warn(`medusa-config.ts not found at ${configPath}. Skipping auto-patch. Please wire up module loader manually.`);
    return false;
  }
  let content = fs.readFileSync(configPath, 'utf8');
  if (content.includes('price-tracker')) {
    console.log('medusa-config.ts already references price-tracker. Skipping patch.');
    return true;
  }
  const inject = `\n// ArbVault Price Tracker Auto-Register\nimport { registerPriceTracker } from './${MODULE_RELATIVE_PATH.replace(/\\/g, '/')}';\nexport const onApplicationPrepared = async (app: any, container: any) => {\n  try {\n    await registerPriceTracker(app, container);\n    console.log('[price-tracker] module registered');\n  } catch (e) {\n    console.error('[price-tracker] failed to register module', e);\n  }\n};\n`;

  content += inject;
  fs.writeFileSync(configPath, content, 'utf8');
  console.log('Patched medusa-config.ts to register price-tracker module.');
  return true;
}

async function runMigrations(backendRoot) {
  const migrationsDir = path.join(backendRoot, MODULE_RELATIVE_PATH, 'migrations');
  const sqlFile = path.join(migrationsDir, '001_init.sql');
  if (!fs.existsSync(sqlFile)) {
    console.warn('Migration file missing. Skipping migrations.');
    return;
  }
  const databaseUrl = process.env.DATABASE_URL || process.env.MEDUSA_DATABASE_URL;
  if (!databaseUrl) {
    console.warn('DATABASE_URL not set. Set DATABASE_URL and re-run to apply migrations.');
    return;
  }
  const { Client } = require('pg');
  const sql = fs.readFileSync(sqlFile, 'utf8');
  const client = new Client({ connectionString: databaseUrl });
  await client.connect();
  try {
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
    console.log('Applied price-tracker migrations.');
  } catch (e) {
    await client.query('ROLLBACK');
    if (e.message && e.message.includes('already exists')) {
      console.log('Migrations already applied.');
    } else {
      console.error('Migration failed:', e.message);
      throw e;
    }
  } finally {
    await client.end();
  }
}

async function seedProductsIfNone(backendRoot) {
  const databaseUrl = process.env.DATABASE_URL || process.env.MEDUSA_DATABASE_URL;
  if (!databaseUrl) {
    console.warn('DATABASE_URL not set. Skipping seed.');
    return [];
  }
  const { Client } = require('pg');
  const client = new Client({ connectionString: databaseUrl });
  await client.connect();
  const titles = [
    'Apple AirPods Pro 2nd Generation',
    'Samsung 65 inch Smart TV UN65TU7000',
    'Ninja Professional Blender BL610',
    'YETI Rambler 20 oz Tumbler',
    'Kindle Paperwhite 11th Generation',
  ];
  try {
    const { rows } = await client.query('SELECT id, title FROM product LIMIT 1');
    if (rows.length > 0) {
      console.log('Products already exist. Skipping seed.');
      return [];
    }
  } catch (e) {
    console.warn('Could not query product table. Skipping seed. Ensure Medusa DB is set up.');
    return [];
  }
  const inserted = [];
  for (const title of titles) {
    const id = 'prod_' + Math.random().toString(36).slice(2, 12);
    try {
      await client.query(
        `INSERT INTO product (id, title, status, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW())`,
        [id, title, 'published']
      );
      inserted.push({ id, title });
    } catch (e) {
      console.warn('Failed to insert product seed:', e.message);
    }
  }
  await client.end();
  console.log(`Seeded ${inserted.length} products.`);
  return inserted;
}

function installDeps(backendRoot, frontendRoot) {
  const backendPkg = path.join(backendRoot, 'package.json');
  if (!fs.existsSync(backendPkg)) {
    console.warn('Backend package.json not found. Skipping backend deps.');
  } else {
    exec(`npm i -w . ${REQUIRED_BACKEND_DEPS.join(' ')} --no-fund --no-audit --silent`, backendRoot);
  }
  const frontendPkg = path.join(frontendRoot, 'package.json');
  if (!fs.existsSync(frontendPkg)) {
    console.warn('Frontend package.json not found. Skipping frontend deps.');
  } else if (REQUIRED_FRONTEND_DEPS.length) {
    exec(`npm i -w . ${REQUIRED_FRONTEND_DEPS.join(' ')} --no-fund --no-audit --silent`, frontendRoot);
  }
}

async function triggerInitialRun(backendRoot) {
  const script = `
  require('ts-node/register/transpile-only');
  (async () => {
    const { PriceTrackerService } = require('./${MODULE_RELATIVE_PATH}/services/price-tracker-service');
    const { Client } = require('pg');
    const databaseUrl = process.env.DATABASE_URL || process.env.MEDUSA_DATABASE_URL;
    if (!databaseUrl) { console.error('DATABASE_URL not set'); process.exit(0); }
    const client = new Client({ connectionString: databaseUrl });
    await client.connect();
    const { rows } = await client.query('SELECT id, title FROM product ORDER BY created_at DESC LIMIT 50');
    const pts = new PriceTrackerService({});
    const results = [];
    for (const p of rows) {
      const res = await pts.researchProduct(p.id, p.title);
      results.push({ title: p.title, ...res });
    }
    console.log('--- Price Tracker Summary ---');
    for (const r of results) {
      console.log(`✅ ${r.title} -> ${JSON.stringify(r.matches)}`);
    }
    await client.end();
  })().catch((e)=>{ console.error(e); process.exit(1); });
  `;
  const tmp = path.join(backendRoot, 'price-tracker-initial-run.js');
  fs.writeFileSync(tmp, script, 'utf8');
  try {
    exec(`node ${tmp}`, backendRoot);
  } finally {
    fs.unlinkSync(tmp);
  }
}

(async function main() {
  console.log('🔍 Installing ArbVault Price Tracker...');
  const backendRoot = findBackendRoot();
  const frontendRoot = DEFAULT_FRONTEND_PATH;
  if (!fs.existsSync(MODULE_ABS_PATH)) {
    console.error(`Module not found at ${MODULE_ABS_PATH}. Ensure files are copied to backend before running installer.`);
    process.exit(1);
  }
  patchMedusaConfig(backendRoot);
  installDeps(backendRoot, frontendRoot);
  await runMigrations(backendRoot);
  const seeded = await seedProductsIfNone(backendRoot);
  await triggerInitialRun(backendRoot);
  console.log('🎉 Install complete.');
  console.log('Run your backend and visit product pages to see price comparisons.');
})();
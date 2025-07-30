# Medusa Price History Plugin - File Export

Copy the following files to your MercurJS project:

## Directory Structure
```
medusa-price-history-plugin/
├── src/
│   ├── models/
│   │   ├── price-history.ts
│   │   └── product-extensions.ts
│   ├── services/
│   │   └── price-history-service.ts
│   ├── workflows/
│   │   ├── update-product-prices/
│   │   │   └── index.ts
│   │   └── seed-price-history/
│   │       └── index.ts
│   ├── api/
│   │   ├── middlewares.ts
│   │   ├── store/products/[id]/price-history/
│   │   │   └── route.ts
│   │   └── vendor/price-history/
│   │       └── route.ts
│   ├── admin/widgets/
│   │   └── product-price-history.tsx
│   ├── subscribers/
│   │   ├── price-update-scheduler.ts
│   │   └── product-created.ts
│   ├── links/
│   │   └── vendor-price-history.ts
│   ├── types/
│   │   └── index.ts
│   └── index.ts
├── examples/
│   └── PriceHistoryComponent.tsx
├── package.json
├── tsconfig.json
└── README.md
```

## Installation Steps:

1. **In your MercurJS project root:**
   ```bash
   mkdir -p src/plugins/medusa-price-history-plugin
   cd src/plugins/medusa-price-history-plugin
   ```

2. **Create all the directories:**
   ```bash
   mkdir -p src/{models,services,workflows/{update-product-prices,seed-price-history},api/{store/products/\[id\]/price-history,vendor/price-history},admin/widgets,subscribers,links,types} examples
   ```

3. **Copy all the file contents from this document**

4. **Install dependencies:**
   ```bash
   npm install
   npm run build
   ```

5. **Add to your medusa-config.ts:**
   ```typescript
   plugins: [
     {
       resolve: "./src/plugins/medusa-price-history-plugin",
       options: {
         enableAutoUpdate: true,
         updateInterval: 24,
         // ... other options
       }
     }
   ]
   ```

---

For the complete file contents, you can:
1. View each file individually in the cloud agent
2. Use the tarball I created: `/workspace/medusa-price-history-plugin.tar.gz`
3. Or manually copy each file from the workspace
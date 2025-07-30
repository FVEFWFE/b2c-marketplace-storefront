# Medusa Price History Plugin

A comprehensive price history plugin for MercurJS/MedusaJS multivendor marketplaces. This plugin provides dynamic price tracking, automated price updates, and detailed price analytics with full vendor isolation and FTC compliance.

## Features

### Core Functionality
- **90-Day Price History**: Track and display product price changes over the last 90 days
- **Automated Price Updates**: Configurable scheduled price adjustments every 24-48 hours
- **Smart Price Patterns**: Stable, volatile, or declining price behaviors
- **Retail Price Comparison**: Always show savings vs MSRP (10-70% discounts)
- **Price Consistency**: Server-side storage ensures consistent prices across all channels

### Vendor Features
- **Isolated Price Management**: Vendors can only view/modify their own products
- **Manual Price Updates**: Update prices with audit trail and validation
- **Bulk Price Operations**: Update multiple products at once
- **Price Analytics**: View statistics and trends for your products

### Admin Features
- **Price History Chart**: Interactive Chart.js visualization in admin dashboard
- **Update Controls**: Manual price adjustment with reason tracking
- **Pattern Configuration**: Set price behavior patterns per product
- **Super Admin Access**: View and manage all vendor price histories

### Technical Features
- **Module Isolation**: Proper separation using MedusaJS 2.0 module system
- **Workflow-Based Updates**: Compensation functions for safe rollbacks
- **API Rate Limiting**: Protect against abuse
- **Response Caching**: 1-hour TTL for performance
- **Event-Driven**: Subscribers for product creation and scheduled updates

## Installation

```bash
npm install medusa-price-history-plugin
```

## Configuration

Add the plugin to your `medusa-config.ts`:

```typescript
import { PriceHistoryPluginOptions } from "medusa-price-history-plugin";

export default {
  projectConfig: {
    // ... other config
  },
  plugins: [
    // ... other plugins
    {
      resolve: "medusa-price-history-plugin",
      options: {
        enableAutoUpdate: true,
        updateInterval: 24, // hours
        priceConstraints: {
          minDiscountPercent: 10,
          maxDiscountPercent: 70,
          maxDailyChangePercent: 15
        },
        priceIncrements: {
          under100: 5,
          under500: 25,
          under1000: 50,
          over1000: 100
        },
        cacheConfig: {
          ttl: 3600, // 1 hour
          enabled: true
        }
      } as PriceHistoryPluginOptions,
    },
  ],
};
```

## API Reference

### Store Endpoints

#### Get Product Price History
```http
GET /store/products/:id/price-history?days=90&limit=100
```

**Response:**
```json
{
  "product_id": "prod_123",
  "currency_code": "USD",
  "days": 90,
  "history": [
    {
      "price": 299.99,
      "retail_price": 499.99,
      "recorded_at": "2024-01-15T10:00:00Z",
      "discount_percentage": 40.0,
      "change_reason": "scheduled"
    }
  ],
  "statistics": {
    "current_price": 299.99,
    "min_price": 249.99,
    "max_price": 349.99,
    "avg_price": 289.99,
    "current_discount": 40.0,
    "current_savings": 200.00,
    "is_lowest_price": false,
    "days_since_lowest": 15,
    "price_volatility": 0.12
  },
  "metadata": {
    "retail_price": 499.99,
    "price_pattern": "volatile",
    "last_update": "2024-01-15T10:00:00Z",
    "total_records": 90
  }
}
```

### Vendor Endpoints

#### Manual Price Update
```http
POST /vendor/price-history/update
Authorization: Bearer <vendor-token>

{
  "product_id": "prod_123",
  "price": 279.99,
  "retail_price": 499.99,
  "reason": "competitor",
  "metadata": {
    "competitor_price": 285.00
  }
}
```

#### Seed Price History
```http
POST /vendor/price-history/seed
Authorization: Bearer <vendor-token>

{
  "product_id": "prod_123",
  "current_price": 299.99,
  "retail_price": 499.99,
  "currency_code": "USD",
  "pattern": "stable",
  "days": 90
}
```

#### Bulk Price Update
```http
POST /vendor/price-history/bulk-update
Authorization: Bearer <vendor-token>

{
  "product_ids": ["prod_123", "prod_456"],
  "batch_size": 50
}
```

#### Get Vendor Products with Price Stats
```http
GET /vendor/price-history/products?page=1&limit=20
Authorization: Bearer <vendor-token>
```

## Usage Examples

### Frontend Integration

```typescript
// React component example
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

function ProductPriceHistory({ productId }) {
  const [priceData, setPriceData] = useState(null);

  useEffect(() => {
    fetch(`/store/products/${productId}/price-history`)
      .then(res => res.json())
      .then(data => setPriceData(data));
  }, [productId]);

  if (!priceData) return <div>Loading...</div>;

  const chartData = {
    labels: priceData.history.map(h => 
      new Date(h.recorded_at).toLocaleDateString()
    ),
    datasets: [{
      label: 'Price',
      data: priceData.history.map(h => h.price),
      borderColor: 'rgb(59, 130, 246)',
      tension: 0.1
    }]
  };

  return (
    <div>
      <h3>Price History</h3>
      {priceData.statistics.is_lowest_price && (
        <div className="badge">Lowest Price!</div>
      )}
      <div className="savings">
        Save ${priceData.statistics.current_savings.toFixed(2)} 
        ({priceData.statistics.current_discount.toFixed(0)}% off)
      </div>
      <Line data={chartData} />
    </div>
  );
}
```

### Programmatic Price Updates

```typescript
// Update prices for seasonal sale
import { initialize } from "medusa-price-history-plugin";

const priceHistoryModule = await initialize();

// Update a single product
await priceHistoryModule.recordPriceChange(
  "prod_123",
  "vendor_456",
  199.99,
  299.99,
  "USD",
  "seasonal",
  { season: "summer_sale" }
);

// Run bulk update workflow
const { result } = await updateProductPricesWorkflow(container).run({
  input: {
    vendorId: "vendor_456",
    batchSize: 50
  }
});
```

## Price Patterns

### Stable Pattern
- Small variations (±5%)
- Suitable for premium/flagship products
- Maintains customer trust

### Volatile Pattern
- Larger variations (up to max daily change)
- Good for competitive categories
- Creates urgency

### Declining Pattern
- Gradual price decrease (2-5% daily)
- Perfect for clearance items
- Drives quick sales

## Best Practices

### 1. Price Consistency
- Always use server-side price history service
- Never calculate prices client-side
- Cache responses appropriately

### 2. Vendor Isolation
- Use vendor context from authentication
- Apply vendor filters in all queries
- Respect super admin privileges

### 3. Performance
- Enable caching for GET endpoints
- Use batch operations for bulk updates
- Implement pagination for large datasets

### 4. Compliance
- Maintain accurate retail prices
- Document all price changes
- Follow FTC guidelines for price comparisons

## Events

The plugin emits the following events:

- `price-history.scheduled-update.completed` - After successful scheduled update
- `price-history.scheduled-update.failed` - When scheduled update fails
- `price.updated` - When a price is manually updated

Subscribe to events:

```typescript
export default async function handlePriceUpdate({ 
  event, 
  container 
}: SubscriberArgs) {
  console.log("Price updated:", event.data);
}

export const config: SubscriberConfig = {
  event: "price.updated",
};
```

## Troubleshooting

### Common Issues

1. **No price history showing**
   - Ensure products have retail_price set
   - Check if historical data was seeded
   - Verify API endpoint is accessible

2. **Price updates not running**
   - Check if enableAutoUpdate is true
   - Verify job scheduler is running
   - Check logs for workflow errors

3. **Vendor can't update prices**
   - Ensure vendor authentication is working
   - Check vendor_id matches product
   - Verify permissions in vendor module

### Debug Mode

Enable debug logging:

```typescript
{
  options: {
    debug: true,
    // ... other options
  }
}
```

## Contributing

Pull requests are welcome! Please ensure:
- All tests pass
- Code follows MedusaJS conventions
- Documentation is updated
- Changes are backwards compatible

## License

MIT License - see LICENSE file for details

## Support

For issues and feature requests, please use GitHub Issues.

For MercurJS-specific questions, refer to the MercurJS documentation.
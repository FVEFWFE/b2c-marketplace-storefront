import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface PriceHistoryComponentProps {
  productId: string;
  className?: string;
  showChart?: boolean;
  days?: number;
}

interface PriceHistoryData {
  product_id: string;
  currency_code: string;
  history: Array<{
    price: number;
    retail_price: number;
    recorded_at: string;
    discount_percentage: number;
  }>;
  statistics: {
    current_price: number;
    min_price: number;
    max_price: number;
    current_discount: number;
    current_savings: number;
    is_lowest_price: boolean;
    days_since_lowest: number;
  };
}

export const PriceHistoryComponent: React.FC<PriceHistoryComponentProps> = ({
  productId,
  className = '',
  showChart = true,
  days = 30,
}) => {
  const [priceData, setPriceData] = useState<PriceHistoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPriceHistory();
  }, [productId, days]);

  const fetchPriceHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/store/products/${productId}/price-history?days=${days}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch price history');
      }
      
      const data = await response.json();
      setPriceData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`price-history-loading ${className}`}>
        <div className="spinner"></div>
        Loading price history...
      </div>
    );
  }

  if (error || !priceData) {
    return (
      <div className={`price-history-error ${className}`}>
        Unable to load price history
      </div>
    );
  }

  const { statistics, history, currency_code } = priceData;

  // Prepare chart data
  const chartData = {
    labels: history.map(h => {
      const date = new Date(h.recorded_at);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }).reverse(),
    datasets: [
      {
        label: 'Product Price',
        data: history.map(h => h.price).reverse(),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.1,
        fill: true,
      },
      {
        label: 'Retail Price',
        data: history.map(h => h.retail_price).reverse(),
        borderColor: 'rgb(156, 163, 175)',
        borderDash: [5, 5],
        tension: 0.1,
        fill: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${formatPrice(value, currency_code)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: (value: any) => formatPrice(value, currency_code),
        },
      },
    },
  };

  const formatPrice = (price: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  return (
    <div className={`price-history-component ${className}`}>
      {/* Price Summary */}
      <div className="price-summary">
        <div className="current-price">
          <span className="price-label">Current Price:</span>
          <span className="price-value">
            {formatPrice(statistics.current_price, currency_code)}
          </span>
          {statistics.current_savings > 0 && (
            <span className="savings">
              Save {formatPrice(statistics.current_savings, currency_code)} 
              ({statistics.current_discount.toFixed(0)}% off)
            </span>
          )}
        </div>

        {statistics.is_lowest_price && (
          <div className="lowest-price-badge">
            🏷️ Lowest price in {days} days!
          </div>
        )}

        {!statistics.is_lowest_price && statistics.days_since_lowest > 0 && (
          <div className="price-info">
            Lowest was {formatPrice(statistics.min_price, currency_code)} 
            ({statistics.days_since_lowest} days ago)
          </div>
        )}
      </div>

      {/* Price Chart */}
      {showChart && history.length > 1 && (
        <div className="price-chart">
          <h4>Price History</h4>
          <div className="chart-container">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      )}

      {/* Price Range Info */}
      <div className="price-range">
        <div className="range-item">
          <span className="label">Lowest:</span>
          <span className="value">
            {formatPrice(statistics.min_price, currency_code)}
          </span>
        </div>
        <div className="range-item">
          <span className="label">Highest:</span>
          <span className="value">
            {formatPrice(statistics.max_price, currency_code)}
          </span>
        </div>
      </div>
    </div>
  );
};

// CSS styles (add to your stylesheet)
const styles = `
.price-history-component {
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background: #ffffff;
}

.price-summary {
  margin-bottom: 1rem;
}

.current-price {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.price-label {
  font-size: 0.875rem;
  color: #6b7280;
}

.price-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #111827;
}

.savings {
  font-size: 0.875rem;
  color: #059669;
  font-weight: 500;
}

.lowest-price-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  margin-top: 0.5rem;
  background: #10b981;
  color: white;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.price-info {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.price-chart {
  margin: 1.5rem 0;
}

.price-chart h4 {
  margin-bottom: 1rem;
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
}

.chart-container {
  height: 300px;
}

.price-range {
  display: flex;
  gap: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.range-item {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.range-item .label {
  font-size: 0.875rem;
  color: #6b7280;
}

.range-item .value {
  font-weight: 600;
  color: #111827;
}

.price-history-loading,
.price-history-error {
  padding: 2rem;
  text-align: center;
  color: #6b7280;
}

.spinner {
  display: inline-block;
  width: 1.5rem;
  height: 1.5rem;
  margin-bottom: 0.5rem;
  border: 2px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
`;

export default PriceHistoryComponent;
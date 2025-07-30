import React, { useEffect, useState } from "react";
import { 
  Container, 
  Heading, 
  Text, 
  Button,
  Badge,
  Select,
  Alert,
  Spinner,
  Input,
  Label,
  RadioGroup,
  Card,
} from "@medusajs/ui";
import { Line } from "react-chartjs-2";
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
} from "chart.js";
import { format, parseISO } from "date-fns";
import { useAdminProduct, useAdminCustomPost } from "medusa-react";
import { PricePattern, ChangeReason } from "../../types";

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

interface PriceHistoryWidgetProps {
  productId: string;
}

export const ProductPriceHistoryWidget: React.FC<PriceHistoryWidgetProps> = ({ 
  productId 
}) => {
  const [priceHistory, setPriceHistory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDays, setSelectedDays] = useState(90);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Price update form state
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [newPrice, setNewPrice] = useState("");
  const [newRetailPrice, setNewRetailPrice] = useState("");
  const [updateReason, setUpdateReason] = useState<ChangeReason>(ChangeReason.MANUAL);

  const { product } = useAdminProduct(productId);
  const updatePriceMutation = useAdminCustomPost(
    `/vendor/price-history/update`,
    ["price-history", productId]
  );

  // Fetch price history
  const fetchPriceHistory = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `/api/store/products/${productId}/price-history?days=${selectedDays}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch price history");
      }

      const data = await response.json();
      setPriceHistory(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPriceHistory();
  }, [productId, selectedDays]);

  const handlePriceUpdate = async () => {
    if (!newPrice) return;

    setIsUpdating(true);
    try {
      await updatePriceMutation.mutate({
        product_id: productId,
        price: parseFloat(newPrice),
        retail_price: newRetailPrice ? parseFloat(newRetailPrice) : undefined,
        reason: updateReason,
      });

      // Refresh data
      await fetchPriceHistory();
      
      // Reset form
      setShowUpdateForm(false);
      setNewPrice("");
      setNewRetailPrice("");
    } catch (err: any) {
      setError("Failed to update price: " + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <Container className="flex items-center justify-center p-8">
        <Spinner />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="p-4">
        <Alert variant="error">
          <Text>{error}</Text>
        </Alert>
      </Container>
    );
  }

  if (!priceHistory) {
    return (
      <Container className="p-4">
        <Text>No price history available</Text>
      </Container>
    );
  }

  // Prepare chart data
  const chartData = {
    labels: priceHistory.history.map((h: any) => 
      format(parseISO(h.recorded_at), "MMM dd")
    ),
    datasets: [
      {
        label: "Product Price",
        data: priceHistory.history.map((h: any) => h.price),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.1,
        fill: true,
      },
      {
        label: "Retail Price (MSRP)",
        data: priceHistory.history.map((h: any) => h.retail_price),
        borderColor: "rgb(156, 163, 175)",
        borderDash: [5, 5],
        tension: 0.1,
        fill: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || "";
            const value = context.parsed.y;
            const discount = context.dataIndex < priceHistory.history.length
              ? priceHistory.history[context.dataIndex].discount_percentage
              : 0;
            
            if (label === "Product Price") {
              return [`${label}: $${value.toFixed(2)}`, `Discount: ${discount.toFixed(1)}%`];
            }
            return `${label}: $${value.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: (value: any) => `$${value}`,
        },
      },
    },
  };

  const { statistics } = priceHistory;

  return (
    <Container className="divide-y">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Price History</Heading>
        <div className="flex items-center gap-2">
          <Select
            value={selectedDays.toString()}
            onValueChange={(value) => setSelectedDays(parseInt(value))}
          >
            <Select.Trigger>
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="7">Last 7 days</Select.Item>
              <Select.Item value="30">Last 30 days</Select.Item>
              <Select.Item value="90">Last 90 days</Select.Item>
              <Select.Item value="365">Last year</Select.Item>
            </Select.Content>
          </Select>
          <Button
            variant="secondary"
            size="small"
            onClick={() => setShowUpdateForm(!showUpdateForm)}
          >
            Update Price
          </Button>
        </div>
      </div>

      <div className="px-6 py-4">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4">
            <Text className="text-ui-fg-subtle text-sm">Current Price</Text>
            <div className="flex items-baseline gap-2 mt-1">
              <Text className="text-2xl font-bold">
                ${statistics?.current_price?.toFixed(2) || "0.00"}
              </Text>
              {statistics?.current_savings > 0 && (
                <Badge color="green" size="small">
                  Save ${statistics.current_savings.toFixed(2)}
                </Badge>
              )}
            </div>
            <Text className="text-ui-fg-subtle text-sm mt-1">
              {statistics?.current_discount?.toFixed(1)}% off MSRP
            </Text>
          </Card>

          <Card className="p-4">
            <Text className="text-ui-fg-subtle text-sm">Price Range</Text>
            <div className="mt-1">
              <Text className="text-lg">
                ${statistics?.min_price?.toFixed(2)} - ${statistics?.max_price?.toFixed(2)}
              </Text>
              <Text className="text-ui-fg-subtle text-sm mt-1">
                Avg: ${statistics?.avg_price?.toFixed(2)}
              </Text>
            </div>
          </Card>

          <Card className="p-4">
            <Text className="text-ui-fg-subtle text-sm">Price Status</Text>
            <div className="mt-1">
              {statistics?.is_lowest_price ? (
                <Badge color="green">Lowest Price</Badge>
              ) : (
                <Text className="text-sm">
                  Lowest {statistics?.days_since_lowest} days ago
                </Text>
              )}
              <Text className="text-ui-fg-subtle text-sm mt-1">
                Pattern: {priceHistory.metadata.price_pattern}
              </Text>
            </div>
          </Card>
        </div>

        {/* Price Update Form */}
        {showUpdateForm && (
          <Card className="p-4 mb-6">
            <Heading level="h3" className="mb-4">Update Product Price</Heading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="new-price">New Price</Label>
                <Input
                  id="new-price"
                  type="number"
                  step="0.01"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder="Enter new price"
                />
              </div>
              <div>
                <Label htmlFor="retail-price">Retail Price (MSRP)</Label>
                <Input
                  id="retail-price"
                  type="number"
                  step="0.01"
                  value={newRetailPrice}
                  onChange={(e) => setNewRetailPrice(e.target.value)}
                  placeholder="Optional"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <Label>Update Reason</Label>
              <RadioGroup
                value={updateReason}
                onValueChange={(value) => setUpdateReason(value as ChangeReason)}
              >
                <RadioGroup.Item value={ChangeReason.MANUAL} label="Manual Adjustment" />
                <RadioGroup.Item value={ChangeReason.COMPETITOR} label="Competitor Pricing" />
                <RadioGroup.Item value={ChangeReason.INVENTORY} label="Inventory Based" />
                <RadioGroup.Item value={ChangeReason.SEASONAL} label="Seasonal Change" />
              </RadioGroup>
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                variant="primary"
                size="small"
                onClick={handlePriceUpdate}
                isLoading={isUpdating}
                disabled={!newPrice}
              >
                Update Price
              </Button>
              <Button
                variant="secondary"
                size="small"
                onClick={() => {
                  setShowUpdateForm(false);
                  setNewPrice("");
                  setNewRetailPrice("");
                }}
              >
                Cancel
              </Button>
            </div>
          </Card>
        )}

        {/* Price History Chart */}
        <div className="h-96">
          <Line data={chartData} options={chartOptions} />
        </div>

        {/* Metadata */}
        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center justify-between text-sm text-ui-fg-subtle">
            <Text>
              Last updated: {priceHistory.metadata.last_update 
                ? format(parseISO(priceHistory.metadata.last_update), "MMM dd, yyyy HH:mm")
                : "Never"}
            </Text>
            <Text>{priceHistory.metadata.total_records} records</Text>
          </div>
        </div>
      </div>
    </Container>
  );
};

// Widget configuration for Medusa Admin
export const config = {
  zone: "product.details.after",
};
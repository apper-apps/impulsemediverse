import { useState } from "react";
import { motion } from "framer-motion";
import Chart from "react-apexcharts";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";

const HealthChart = ({ data, title, type = "line", color = "#3B82F6", showControls = true, showForecast = true }) => {
  const [timeRange, setTimeRange] = useState("6m");
  const [chartType, setChartType] = useState(type);
  const [forecastEnabled, setForecastEnabled] = useState(showForecast);

  const getChartOptions = () => {
    const baseOptions = {
      chart: {
        type: chartType,
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800
        }
      },
      colors: [color, "#10B981"],
      stroke: {
        curve: "smooth",
        width: chartType === "line" ? 3 : 2
      },
      fill: {
        type: chartType === "area" ? "gradient" : "solid",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.2,
          stops: [0, 90, 100]
        }
      },
      grid: {
        borderColor: "#f1f5f9",
        strokeDashArray: 4
      },
      xaxis: {
        categories: data.map(item => item.date),
        labels: {
          style: {
            colors: "#64748b",
            fontSize: "12px"
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: "#64748b",
            fontSize: "12px"
          }
        }
      },
      tooltip: {
        theme: "light",
        style: {
          fontSize: "12px"
        },
        custom: function({series, seriesIndex, dataPointIndex, w}) {
          const value = series[seriesIndex][dataPointIndex];
          const date = w.globals.categoryLabels[dataPointIndex];
          const isForecast = seriesIndex === 1;
          
          return `<div class="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
            <div class="font-medium text-gray-900">${title}</div>
            <div class="text-sm text-gray-600">${date}</div>
            <div class="text-lg font-semibold text-${isForecast ? 'green' : 'blue'}-600">
              ${value}${isForecast ? ' (forecast)' : ''}
            </div>
          </div>`;
        }
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        show: forecastEnabled,
        position: 'top',
        horizontalAlign: 'right'
      }
    };

    if (chartType === "bar") {
      baseOptions.plotOptions = {
        bar: {
          borderRadius: 4,
          dataLabels: {
            position: 'top'
          }
        }
      };
    }

    return baseOptions;
  };

  const getAdvancedForecast = () => {
    if (data.length < 4) return null;
    
    const values = data.map(d => d.value);
    const n = values.length;
    
    // Linear regression for trend
    const xValues = Array.from({length: n}, (_, i) => i);
    const xMean = xValues.reduce((a, b) => a + b) / n;
    const yMean = values.reduce((a, b) => a + b) / n;
    
    const slope = xValues.reduce((sum, x, i) => sum + (x - xMean) * (values[i] - yMean), 0) /
                  xValues.reduce((sum, x) => sum + Math.pow(x - xMean, 2), 0);
    
    const intercept = yMean - slope * xMean;
    
    // Generate forecast points
    const forecastPoints = [];
    const forecastLength = Math.min(3, Math.floor(n / 2));
    
    for (let i = 1; i <= forecastLength; i++) {
      const forecastValue = intercept + slope * (n - 1 + i);
      const futureDate = new Date(data[data.length - 1].date);
      futureDate.setMonth(futureDate.getMonth() + i);
      
      forecastPoints.push({
        date: futureDate.toISOString().split('T')[0],
        value: Math.max(0, forecastValue)
      });
    }
    
    // Calculate confidence
    const residuals = values.map((val, i) => val - (intercept + slope * i));
    const mse = residuals.reduce((sum, r) => sum + r * r, 0) / n;
    const confidence = Math.max(60, Math.min(95, 100 - Math.sqrt(mse)));
    
    return {
      points: forecastPoints,
      confidence: confidence.toFixed(0),
      trend: slope > 0 ? "increasing" : "decreasing",
      strength: Math.abs(slope) > 1 ? "strong" : "moderate"
    };
  };

  const getSeries = () => {
    const mainSeries = {
      name: title,
      data: data.map(item => item.value)
    };
    
    if (!forecastEnabled) return [mainSeries];
    
    const forecast = getAdvancedForecast();
    if (!forecast) return [mainSeries];
    
    const forecastSeries = {
      name: "Forecast",
      data: [...Array(data.length - 1).fill(null), data[data.length - 1].value, ...forecast.points.map(p => p.value)]
    };
    
    return [mainSeries, forecastSeries];
  };

const getInsight = () => {
    if (!data || data.length < 2) return "Not enough data for insights";
    
    const latestItem = data[data.length - 1];
    const previousItem = data[data.length - 2];
    
    if (!latestItem || !previousItem || latestItem.value === undefined || previousItem.value === undefined) {
      return "Insufficient data for trend analysis";
    }
    
    const latest = latestItem.value;
    const previous = previousItem.value;
    
    if (previous === 0) return "Unable to calculate percentage change";
    
    const trend = latest > previous ? "increasing" : "decreasing";
    const percentage = Math.abs(((latest - previous) / previous) * 100).toFixed(1);
    
    return `${trend} by ${percentage}% from last reading`;
  };

  const getTrendPrediction = () => {
    const forecast = getAdvancedForecast();
    if (!forecast) return "Need more data for predictions";
    const nextValue = forecast.points[0]?.value;
    const direction = forecast.trend === "increasing" ? "continue rising" : "continue declining";
    
    return {
      prediction: nextValue?.toFixed(1),
      direction,
      confidence: forecast.confidence,
      trend: forecast.trend === "increasing" ? "positive" : "negative",
      strength: forecast.strength
    };
  };

  const getHealthStatus = () => {
    if (data.length === 0) return "no-data";
    
    const latest = data[data.length - 1].value;
    const prediction = getTrendPrediction();
    
    if (prediction.trend === "positive" && latest > 0) return "improving";
    if (prediction.trend === "negative" && latest > 0) return "concerning";
    return "stable";
  };

  const timeRanges = [
    { key: "1m", label: "1M" },
    { key: "3m", label: "3M" },
    { key: "6m", label: "6M" },
    { key: "1y", label: "1Y" }
  ];

  const chartTypes = [
    { key: "line", label: "Line", icon: "TrendingUp" },
    { key: "bar", label: "Bar", icon: "BarChart3" },
    { key: "area", label: "Area", icon: "Activity" }
  ];

  const exportData = () => {
    const csvContent = [
      ["Date", "Value", "Type"],
      ...data.map(item => [item.date, item.value, "Actual"]),
      ...(forecastEnabled && getAdvancedForecast() ? 
        getAdvancedForecast().points.map(item => [item.date, item.value, "Forecast"]) : [])
    ].map(row => row.join(",")).join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[^a-zA-Z0-9]/g, '_')}_data.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">{getInsight()}</p>
        </div>
        
        {showControls && (
          <div className="flex items-center space-x-4">
            {/* Chart Type Selection */}
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              {chartTypes.map((type) => (
                <button
                  key={type.key}
                  onClick={() => setChartType(type.key)}
                  className={`flex items-center space-x-1 px-2 py-1 text-xs rounded-md transition-colors ${
                    chartType === type.key
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <ApperIcon name={type.icon} size={12} />
                  <span>{type.label}</span>
                </button>
              ))}
            </div>
            
            {/* Time Range Selection */}
            <div className="flex items-center space-x-2">
              {timeRanges.map((range) => (
                <button
                  key={range.key}
                  onClick={() => setTimeRange(range.key)}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                    timeRange === range.key
                      ? "bg-primary-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="h-64">
        <Chart
          options={getChartOptions()}
          series={getSeries()}
          type={chartType}
          height="100%"
        />
      </div>

      {forecastEnabled && (
        <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <ApperIcon name="Zap" size={16} className="text-blue-600" />
            <h4 className="font-medium text-gray-900">AI Forecast</h4>
            <button
              onClick={() => setForecastEnabled(!forecastEnabled)}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Toggle
            </button>
          </div>
          {(() => {
            const prediction = getTrendPrediction();
            return (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Next Value:</span>
                  <span className="ml-2 font-semibold text-blue-600">{prediction.prediction}</span>
                </div>
                <div>
                  <span className="text-gray-600">Confidence:</span>
                  <span className="ml-2 font-semibold text-green-600">{prediction.confidence}%</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-600">Trend:</span>
                  <span className="ml-2 font-semibold text-gray-900">
                    {prediction.strength} {prediction.trend} trend
                  </span>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Normal Range</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Caution</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Critical</span>
          </div>
          {forecastEnabled && (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Forecast</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" icon="Download" onClick={exportData}>
            Export Data
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default HealthChart;
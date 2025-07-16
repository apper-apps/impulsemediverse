import { useState } from "react";
import { motion } from "framer-motion";
import Chart from "react-apexcharts";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";

const HealthChart = ({ data, title, type = "line", color = "#3B82F6" }) => {
  const [timeRange, setTimeRange] = useState("6m");

  const chartOptions = {
    chart: {
      type: type,
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    colors: [color],
    stroke: {
      curve: "smooth",
      width: 3
    },
    fill: {
      type: "gradient",
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
      }
    },
    dataLabels: {
      enabled: false
    }
  };

  const series = [{
    name: title,
    data: data.map(item => item.value)
  }];

  const timeRanges = [
    { key: "1m", label: "1M" },
    { key: "3m", label: "3M" },
    { key: "6m", label: "6M" },
    { key: "1y", label: "1Y" }
  ];

  const getInsight = () => {
    if (data.length < 2) return "Not enough data for insights";
    
    const latest = data[data.length - 1].value;
    const previous = data[data.length - 2].value;
    const trend = latest > previous ? "increasing" : "decreasing";
    const percentage = Math.abs(((latest - previous) / previous) * 100).toFixed(1);
    
    return `${trend} by ${percentage}% from last reading`;
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">{getInsight()}</p>
        </div>
        
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

      <div className="h-64">
        <Chart
          options={chartOptions}
          series={series}
          type={type}
          height="100%"
        />
      </div>

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
        </div>
        
        <Button variant="outline" size="sm" icon="Download">
          Export Data
        </Button>
      </div>
    </Card>
  );
};

export default HealthChart;
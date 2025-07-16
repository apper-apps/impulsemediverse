import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import HealthChart from "@/components/organisms/HealthChart";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { healthTrendsService } from "@/services/api/healthTrendsService";

const HealthTrends = () => {
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    loadTrends();
  }, []);

  const loadTrends = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await healthTrendsService.getByPatientId("patient1");
      setTrends(data);
    } catch (err) {
      setError(err.message || "Failed to load health trends");
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    loadTrends();
  };

  const getFilteredTrends = () => {
    if (selectedCategory === "all") return trends;
    return trends.filter(trend => trend.category === selectedCategory);
  };

  const categories = ["all", "Cardiovascular", "Metabolic", "General"];

  const getChartColor = (metric) => {
    const colors = {
      "Blood Pressure": "#EF4444",
      "Cholesterol": "#3B82F6",
      "Blood Sugar": "#10B981",
      "Weight": "#8B5CF6"
    };
    return colors[metric] || "#6B7280";
  };

  const getInsights = () => {
    const insights = [
      {
        icon: "TrendingUp",
        title: "Improving Trends",
        description: "Your blood pressure has been consistently decreasing over the past 3 months.",
        color: "text-green-600"
      },
      {
        icon: "Heart",
        title: "Cardiovascular Health",
        description: "Your cholesterol levels are within the healthy range and showing improvement.",
        color: "text-blue-600"
      },
      {
        icon: "Activity",
        title: "Weight Management",
        description: "You've successfully maintained a healthy weight loss trend.",
        color: "text-purple-600"
      },
      {
        icon: "AlertTriangle",
        title: "Recommendation",
        description: "Continue monitoring blood sugar levels and maintain current diet.",
        color: "text-yellow-600"
      }
    ];

    return insights;
  };

  if (loading) {
    return <Loading type="dashboard" />;
  }

  if (error) {
    return <Error message={error} onRetry={handleRetry} type="medical" />;
  }

  if (trends.length === 0) {
    return (
      <Empty
        title="No health trends available"
        description="Upload medical records and lab results to see your health trends over time."
        icon="TrendingUp"
        actionText="Upload Records"
        action={() => window.location.href = "/records"}
      />
    );
  }

  const filteredTrends = getFilteredTrends();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Health Trends</h1>
          <p className="text-gray-600 mt-1">
            Track your health metrics over time and get AI-powered insights.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" icon="Download">
            Export Data
          </Button>
          <Button icon="Upload" onClick={() => window.location.href = "/records"}>
            Upload Records
          </Button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-700">Category:</span>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                selectedCategory === category
                  ? "bg-primary-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category === "all" ? "All Categories" : category}
            </button>
          ))}
        </div>
      </div>

      {/* AI Insights */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">AI Health Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {getInsights().map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg"
            >
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <ApperIcon name={insight.icon} size={16} className={insight.color} />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{insight.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Health Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredTrends.map((trend, index) => (
          <motion.div
            key={trend.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <HealthChart
              data={trend.data}
              title={`${trend.metric} (${trend.unit})`}
              type="line"
              color={getChartColor(trend.metric)}
            />
          </motion.div>
        ))}
      </div>

      {/* Health Summary */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Health Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trends.map((trend) => {
            const latestValue = trend.data[trend.data.length - 1];
            const previousValue = trend.data[trend.data.length - 2];
            const change = latestValue && previousValue ? 
              ((latestValue.value - previousValue.value) / previousValue.value * 100).toFixed(1) : 0;
            
            return (
              <div key={trend.Id} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ApperIcon name="Activity" size={24} className="text-primary-600" />
                </div>
                <h3 className="font-medium text-gray-900">{trend.metric}</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {latestValue ? latestValue.value : "N/A"}
                  <span className="text-sm font-normal text-gray-600 ml-1">
                    {trend.unit}
                  </span>
                </p>
                <p className={`text-sm ${change > 0 ? "text-red-600" : "text-green-600"}`}>
                  {change > 0 ? "+" : ""}{change}% from last reading
                </p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Recommendations */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">AI Recommendations</h2>
        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
            <ApperIcon name="CheckCircle" size={20} className="text-green-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-green-900">Keep it up!</h3>
              <p className="text-sm text-green-800">Your blood pressure trend is excellent. Continue your current medication and lifestyle.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
            <ApperIcon name="Info" size={20} className="text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900">Consider consultation</h3>
              <p className="text-sm text-blue-800">Your weight loss is progressing well. Consider consulting with a nutritionist for optimization.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg">
            <ApperIcon name="AlertTriangle" size={20} className="text-yellow-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-yellow-900">Monitor closely</h3>
              <p className="text-sm text-yellow-800">Keep tracking your blood sugar levels and maintain your current diet plan.</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default HealthTrends;
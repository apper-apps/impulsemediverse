import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import HealthChart from "@/components/organisms/HealthChart";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import StatCard from "@/components/molecules/StatCard";
import { medicalRecordService } from "@/services/api/medicalRecordService";
import { consultationService } from "@/services/api/consultationService";
import { departmentService } from "@/services/api/departmentService";

const AuthenticatedDashboard = () => {
  const [departments, setDepartments] = useState([]);
  const [recentConsultations, setRecentConsultations] = useState([]);
  const [recentRecords, setRecentRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Health trends data and helper functions
  const [healthTrends, setHealthTrends] = useState([
    {
      Id: "1",
      metric: "Blood Pressure",
      category: "Cardiovascular",
      unit: "mmHg",
      chartType: "line",
      color: "#EF4444",
      data: [
        { date: "2024-01-01", value: 120 },
        { date: "2024-01-15", value: 118 },
        { date: "2024-02-01", value: 115 },
        { date: "2024-02-15", value: 117 },
        { date: "2024-03-01", value: 113 },
        { date: "2024-03-15", value: 112 }
      ]
    },
    {
      Id: "2", 
      metric: "Heart Rate",
      category: "Cardiovascular",
      unit: "bpm",
      chartType: "area",
      color: "#3B82F6",
      data: [
        { date: "2024-01-01", value: 75 },
        { date: "2024-01-15", value: 72 },
        { date: "2024-02-01", value: 70 },
        { date: "2024-02-15", value: 73 },
        { date: "2024-03-01", value: 71 },
        { date: "2024-03-15", value: 69 }
      ]
    },
    {
      Id: "3",
      metric: "Blood Sugar",
      category: "Metabolic", 
      unit: "mg/dL",
      chartType: "bar",
      color: "#10B981",
      data: [
        { date: "2024-01-01", value: 95 },
        { date: "2024-01-15", value: 92 },
        { date: "2024-02-01", value: 88 },
        { date: "2024-02-15", value: 90 },
        { date: "2024-03-01", value: 86 },
        { date: "2024-03-15", value: 84 }
      ]
    },
    {
      Id: "4",
      metric: "Weight",
      category: "Metabolic",
      unit: "lbs",
      chartType: "line",
      color: "#8B5CF6",
      data: [
        { date: "2024-01-01", value: 180 },
        { date: "2024-01-15", value: 178 },
        { date: "2024-02-01", value: 175 },
        { date: "2024-02-15", value: 177 },
        { date: "2024-03-01", value: 174 },
        { date: "2024-03-15", value: 172 }
      ]
    }
  ]);

  const getHealthTrendInsight = (trend) => {
    if (!trend?.data || trend.data.length < 2) {
      return { status: "stable", change: 0, message: "Insufficient data" };
    }
    
    const recent = trend.data[trend.data.length - 1]?.value || 0;
    const previous = trend.data[trend.data.length - 2]?.value || 0;
    const change = recent - previous;
    
    let status = "stable";
    if (trend.metric === "Blood Pressure" || trend.metric === "Blood Sugar" || trend.metric === "Weight") {
      status = change < 0 ? "improving" : change > 0 ? "concerning" : "stable";
    } else if (trend.metric === "Heart Rate") {
      status = Math.abs(change) < 5 ? "stable" : change < 0 ? "improving" : "concerning";
    }
    
    const message = change > 0 ? `+${change} ${trend.unit} from last reading` : 
                   change < 0 ? `${change} ${trend.unit} from last reading` :
                   "No change from last reading";
    
    return { status, change, message };
  };

  const getAdvancedForecast = (trend) => {
    if (!trend?.data || trend.data.length < 4) {
      return { prediction: "N/A", confidence: "N/A", direction: "stable" };
    }
    
    const values = trend.data.map(d => d.value);
    const n = values.length;
    
    // Linear regression
    const xValues = Array.from({length: n}, (_, i) => i);
    const xMean = xValues.reduce((a, b) => a + b) / n;
    const yMean = values.reduce((a, b) => a + b) / n;
    
    const slope = xValues.reduce((sum, x, i) => sum + (x - xMean) * (values[i] - yMean), 0) /
                  xValues.reduce((sum, x) => sum + Math.pow(x - xMean, 2), 0);
    
    const intercept = yMean - slope * xMean;
    const nextValue = intercept + slope * n;
    
    // Calculate confidence
    const residuals = values.map((val, i) => val - (intercept + slope * i));
    const mse = residuals.reduce((sum, r) => sum + r * r, 0) / n;
    const confidence = Math.max(65, Math.min(95, 100 - Math.sqrt(mse)));
    
    return {
      prediction: nextValue.toFixed(1),
      confidence: confidence.toFixed(0),
      direction: slope > 0 ? "increasing" : slope < 0 ? "decreasing" : "stable",
      strength: Math.abs(slope) > 1 ? "strong" : "moderate"
    };
  };

  const getHealthTrendPrediction = (trend) => {
    if (!trend?.data || trend.data.length < 2) {
      return "Need more data for accurate prediction";
    }
    
    const forecast = getAdvancedForecast(trend);
    const insights = {
      "Blood Pressure": `${forecast.direction} trend - ${forecast.confidence}% confidence`,
      "Heart Rate": `${forecast.strength} ${forecast.direction} pattern detected`,
      "Blood Sugar": `${forecast.direction} control - ${forecast.confidence}% accuracy`, 
      "Weight": `${forecast.direction} trajectory - ${forecast.strength} trend`
    };
    
    return insights[trend.metric] || `${forecast.direction} trend with ${forecast.confidence}% confidence`;
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [departmentsData, consultationsData, recordsData] = await Promise.all([
        departmentService.getAll(),
        consultationService.getByPatientId("patient1"),
        medicalRecordService.getByPatientId("patient1")
      ]);

      setDepartments(departmentsData);
      setRecentConsultations(consultationsData.slice(0, 3));
      setRecentRecords(recordsData.slice(0, 3));
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    loadDashboardData();
  };

  if (loading) {
    return <Loading type="dashboard" />;
  }

  if (error) {
    return <Error message={error} onRetry={handleRetry} type="medical" />;
  }

  const stats = [
    {
      title: "Total Consultations",
      value: recentConsultations.length,
      icon: "MessageCircle",
      color: "primary",
      trend: "up",
      trendValue: "+2 this week"
    },
    {
      title: "Medical Records",
      value: recentRecords.length,
      icon: "FileText",
      color: "secondary",
      trend: "up",
      trendValue: "+1 this week"
    },
    {
      title: "Active Departments",
      value: departments.length,
      icon: "Building2",
      color: "accent",
      trend: "up",
      trendValue: "All available"
    },
    {
      title: "Health Score",
      value: "95%",
      icon: "Heart",
      color: "warning",
      trend: "up",
      trendValue: "+5% improved"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-2xl font-bold mb-2">Welcome to Your Health Dashboard</h1>
          <p className="text-primary-100">Monitor your health, track progress, and stay connected with our AI medical specialists.</p>
        </motion.div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            variant="outline"
            className="flex items-center justify-center space-x-2 h-12"
            onClick={() => navigate('/departments')}
          >
            <ApperIcon name="MessageCircle" size={20} />
            <span>New Consultation</span>
          </Button>
          <Button
            variant="outline"
            className="flex items-center justify-center space-x-2 h-12"
            onClick={() => navigate('/records')}
          >
            <ApperIcon name="Upload" size={20} />
            <span>Upload Records</span>
          </Button>
          <Button
            variant="outline"
            className="flex items-center justify-center space-x-2 h-12"
            onClick={() => navigate('/trends')}
          >
            <ApperIcon name="TrendingUp" size={20} />
            <span>View Trends</span>
          </Button>
          <Button
            variant="outline"
            className="flex items-center justify-center space-x-2 h-12"
            onClick={() => navigate('/profile')}
          >
            <ApperIcon name="User" size={20} />
            <span>Update Profile</span>
          </Button>
        </div>
      </Card>

      {/* Health Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Health Trends</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/trends')}
              icon="TrendingUp"
            >
              View All
            </Button>
          </div>
          <div className="space-y-4">
            {healthTrends.slice(0, 2).map((trend, index) => {
              const insight = getHealthTrendInsight(trend);
              return (
                <motion.div
                  key={trend.Id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
                      <ApperIcon name="Activity" size={20} className="text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{trend.metric}</h3>
                      <p className="text-sm text-gray-600">{insight.message}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      {trend.data[trend.data.length - 1]?.value} {trend.unit}
                    </p>
                    <Badge
                      variant={insight.status === "improving" ? "success" : insight.status === "concerning" ? "danger" : "default"}
                      size="sm"
                    >
                      {insight.status}
                    </Badge>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Consultations</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/consultations')}
              icon="MessageCircle"
            >
              View All
            </Button>
          </div>
          <div className="space-y-4">
            {recentConsultations.map((consultation, index) => (
              <motion.div
                key={consultation.Id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Stethoscope" size={20} className="text-secondary-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{consultation.department}</h3>
                    <p className="text-sm text-gray-600">{format(new Date(consultation.timestamp), "MMM d, yyyy")}</p>
                  </div>
                </div>
                <Badge
                  variant={consultation.status === "active" ? "primary" : consultation.status === "completed" ? "success" : "default"}
                  size="sm"
                >
                  {consultation.status}
                </Badge>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Records */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Medical Records</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/records')}
            icon="FileText"
          >
            View All
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentRecords.map((record, index) => (
            <motion.div
              key={record.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-accent-100 to-accent-200 rounded-lg flex items-center justify-center">
                  <ApperIcon name="FileText" size={20} className="text-accent-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 truncate">{record.fileName}</h3>
                  <p className="text-sm text-gray-600">{record.category}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {format(new Date(record.uploadDate), "MMM d")}
                </span>
                <Badge variant="secondary" size="sm">
                  {record.department}
                </Badge>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AuthenticatedDashboard;
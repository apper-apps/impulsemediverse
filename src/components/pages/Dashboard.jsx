import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import HealthChart from "@/components/organisms/HealthChart";
import Consultation from "@/components/pages/Consultation";
import Departments from "@/components/pages/Departments";
import Records from "@/components/pages/Records";
import Consultations from "@/components/pages/Consultations";
import StatCard from "@/components/molecules/StatCard";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { medicalRecordService } from "@/services/api/medicalRecordService";
import { departmentService } from "@/services/api/departmentService";
import { consultationService } from "@/services/api/consultationService";

const Dashboard = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-sm border-b border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ApperIcon name="Activity" size={28} className="text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="success">Active</Badge>
              <Button size="sm" onClick={() => navigate('/consultation')}>
                New Consultation
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </motion.div>

        {/* Health Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Health Trends</h2>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {healthTrends.map((trend) => {
                const insight = getHealthTrendInsight(trend);
                const prediction = getHealthTrendPrediction(trend);
                return (
                  <div key={trend.Id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900">{trend.metric}</h3>
                        <p className="text-sm text-gray-600">{trend.category}</p>
                      </div>
                      <Badge 
                        variant={insight.status === 'improving' ? 'success' : 
                                insight.status === 'concerning' ? 'destructive' : 'default'}
                      >
                        {insight.status}
                      </Badge>
                    </div>
                    <HealthChart data={trend} />
                    <div className="mt-3 space-y-1">
                      <p className="text-sm text-gray-600">{insight.message}</p>
                      <p className="text-xs text-gray-500">{prediction}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Consultations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Consultations</h2>
                <Button variant="outline" size="sm" onClick={() => navigate('/consultations')}>
                  View All
                </Button>
              </div>
              <div className="space-y-4">
                {recentConsultations.length > 0 ? (
                  recentConsultations.map((consultation) => (
<div key={consultation.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">{consultation.department}</h3>
                          <p className="text-sm text-gray-600">{consultation.reason}</p>
                          <p className="text-xs text-gray-500">
                            {(() => {
                              try {
                                const date = consultation?.createdAt ? new Date(consultation.createdAt) : null;
                                return date && !isNaN(date.getTime()) 
                                  ? format(date, 'MMM d, yyyy')
                                  : 'Date unavailable';
                              } catch (error) {
                                return 'Date unavailable';
                              }
                            })()}
                          </p>
                        </div>
                        <Badge variant={consultation.status === 'completed' ? 'success' : 'default'}>
                          {consultation.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">No recent consultations</p>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Recent Records */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Records</h2>
                <Button variant="outline" size="sm" onClick={() => navigate('/records')}>
                  View All
                </Button>
              </div>
              <div className="space-y-4">
                {recentRecords.length > 0 ? (
                  recentRecords.map((record) => (
<div key={record.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">{record.type}</h3>
                          <p className="text-sm text-gray-600">{record.description}</p>
                          <p className="text-xs text-gray-500">
                            {(() => {
                              try {
                                const date = record?.createdAt ? new Date(record.createdAt) : null;
                                return date && !isNaN(date.getTime()) 
                                  ? format(date, 'MMM d, yyyy')
                                  : 'Date unavailable';
                              } catch (error) {
                                return 'Date unavailable';
                              }
                            })()}
                          </p>
                        </div>
                        <ApperIcon name="FileText" size={20} className="text-gray-400" />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">No recent records</p>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
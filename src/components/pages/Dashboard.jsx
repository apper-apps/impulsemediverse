import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import Records from "@/components/pages/Records";
import Consultations from "@/components/pages/Consultations";
import Departments from "@/components/pages/Departments";
import Consultation from "@/components/pages/Consultation";
import StatCard from "@/components/molecules/StatCard";
import { medicalRecordService } from "@/services/api/medicalRecordService";
import { consultationService } from "@/services/api/consultationService";
import { departmentService } from "@/services/api/departmentService";

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
      data: [
        { date: "2024-01-01", value: 120 },
        { date: "2024-01-15", value: 118 },
        { date: "2024-02-01", value: 115 }
      ]
    },
    {
      Id: "2", 
      metric: "Heart Rate",
      category: "Cardiovascular",
      unit: "bpm",
      data: [
        { date: "2024-01-01", value: 75 },
        { date: "2024-01-15", value: 72 },
        { date: "2024-02-01", value: 70 }
      ]
    },
    {
      Id: "3",
      metric: "Blood Sugar",
      category: "Metabolic", 
      unit: "mg/dL",
      data: [
        { date: "2024-01-01", value: 95 },
        { date: "2024-01-15", value: 92 },
        { date: "2024-02-01", value: 88 }
      ]
    },
    {
      Id: "4",
      metric: "Weight",
      category: "Metabolic",
      unit: "lbs",
      data: [
        { date: "2024-01-01", value: 180 },
        { date: "2024-01-15", value: 178 },
        { date: "2024-02-01", value: 175 }
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

  const getHealthTrendPrediction = (trend) => {
    if (!trend?.data || trend.data.length < 2) {
      return "Need more data for accurate prediction";
    }
    
    const insights = {
      "Blood Pressure": "Trending downward - maintain current lifestyle",
      "Heart Rate": "Stable range - excellent cardiovascular health",
      "Blood Sugar": "Improving control - continue current diet plan", 
      "Weight": "Steady progress - on track to reach target"
    };
    
    return insights[trend.metric] || "Continue monitoring for optimal health";
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Health Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's your health overview and recent activity.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            icon="Upload"
            onClick={() => navigate("/records")}
          >
            Upload Records
          </Button>
          <Button
            icon="MessageCircle"
            onClick={() => navigate("/departments")}
          >
            New Consultation
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            className="h-20 flex-col"
            onClick={() => navigate("/departments")}
          >
            <ApperIcon name="Stethoscope" size={24} className="mb-2" />
            <span>Start Consultation</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex-col"
            onClick={() => navigate("/records")}
          >
            <ApperIcon name="Upload" size={24} className="mb-2" />
            <span>Upload Files</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex-col"
            onClick={() => navigate("/trends")}
          >
            <ApperIcon name="TrendingUp" size={24} className="mb-2" />
            <span>View Trends</span>
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Consultations */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Consultations</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/consultations")}
            >
              View All
            </Button>
          </div>
          
          <div className="space-y-4">
            {recentConsultations.map((consultation) => (
              <div
                key={consultation.Id}
                className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => navigate(`/consultation/${consultation.departmentId}`)}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
                  <ApperIcon name="MessageCircle" size={20} className="text-primary-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{consultation.department}</h3>
                  <p className="text-sm text-gray-600">
                    {format(new Date(consultation.timestamp), "MMM d, yyyy")}
                  </p>
                </div>
                <Badge
                  variant={consultation.status === "active" ? "primary" : "default"}
                  size="sm"
                >
                  {consultation.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Medical Records */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Medical Records</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/records")}
            >
              View All
            </Button>
          </div>
          
          <div className="space-y-4">
            {recentRecords.map((record) => (
              <div
                key={record.Id}
                className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => navigate("/records")}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-lg flex items-center justify-center">
                  <ApperIcon name="FileText" size={20} className="text-secondary-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{record.fileName}</h3>
                  <p className="text-sm text-gray-600">{record.category}</p>
                </div>
                <Badge variant="secondary" size="sm">
                  {record.fileType.toUpperCase()}
                </Badge>
              </div>
            ))}
          </div>
</Card>
      </div>

      {/* Health Trend Cards */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Health Trends & Predictions</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/trends")}
          >
            View All Trends
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {healthTrends.slice(0, 4).map((trend) => {
            const insight = getHealthTrendInsight(trend);
            const prediction = getHealthTrendPrediction(trend);
            
            return (
              <motion.div
                key={trend.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      insight.status === "improving" ? "bg-green-100" :
                      insight.status === "concerning" ? "bg-red-100" :
                      "bg-blue-100"
                    }`}>
                      <ApperIcon 
                        name={
                          trend.category === "Cardiovascular" ? "Heart" :
                          trend.category === "Metabolic" ? "Activity" :
                          "TrendingUp"
                        } 
                        size={24}
                        className={
                          insight.status === "improving" ? "text-green-600" :
                          insight.status === "concerning" ? "text-red-600" :
                          "text-blue-600"
                        }
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{trend.metric}</h3>
                      <p className="text-sm text-gray-600">{trend.category}</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    insight.status === "improving" ? "bg-green-100 text-green-800" :
                    insight.status === "concerning" ? "bg-red-100 text-red-800" :
                    "bg-blue-100 text-blue-800"
                  }`}>
                    {insight.status === "improving" ? "Improving" :
                     insight.status === "concerning" ? "Needs Attention" :
                     "Stable"}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Current</span>
                    <span className="text-lg font-semibold text-gray-900">
                      {trend.data[trend.data.length - 1]?.value} {trend.unit}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <ApperIcon 
                      name={insight.change > 0 ? "TrendingUp" : "TrendingDown"} 
                      size={16}
                      className={insight.change > 0 ? "text-green-600" : "text-red-600"}
                    />
                    <span className="text-sm text-gray-600">{insight.message}</span>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <ApperIcon name="Zap" size={14} className="text-yellow-600" />
                      <span className="text-xs font-medium text-gray-700">Prediction</span>
                    </div>
                    <p className="text-sm text-gray-600">{prediction}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>

      {/* Available Departments */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Departments</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.slice(0, 6).map((department) => (
            <div
              key={department.Id}
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => navigate(`/consultation/${department.Id}`)}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-accent-100 to-accent-200 rounded-lg flex items-center justify-center">
                <ApperIcon name={department.icon} size={20} className="text-accent-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{department.name}</h3>
                <p className="text-sm text-gray-600">AI Assistant</p>
              </div>
            </div>
          ))}
</div>
      </Card>
    </div>
  );
};
export default Dashboard;
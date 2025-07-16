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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
            >
              AI-Powered Healthcare
              <br />
              <span className="text-blue-600">Available 24/7</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
            >
              Experience the future of healthcare with MediVerse AI. Get instant medical consultations, 
              AI-powered diagnostics, and personalized treatment plans from the comfort of your home.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button size="lg" onClick={() => navigate('/signup')}>
                Get Started Free
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/signin')}>
                Sign In
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose MediVerse AI?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced AI technology meets compassionate healthcare to deliver personalized medical care
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "Bot",
                title: "AI-Powered Diagnostics",
                description: "Advanced machine learning algorithms analyze symptoms and medical history to provide accurate preliminary diagnoses."
              },
              {
                icon: "Clock",
                title: "24/7 Availability",
                description: "Access medical consultations anytime, anywhere. Our AI assistants are always ready to help with your health concerns."
              },
              {
                icon: "Shield",
                title: "HIPAA Compliant",
                description: "Your medical data is protected with enterprise-grade security and full HIPAA compliance for peace of mind."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mb-6">
                  <ApperIcon name={feature.icon} size={24} className="text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section id="departments" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Specialized AI Departments
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI specialists are trained in various medical fields to provide expert care
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "General Practice", icon: "Stethoscope", description: "Primary care and general health consultations" },
              { name: "Cardiology", icon: "Heart", description: "Heart and cardiovascular health specialists" },
              { name: "Neurology", icon: "Brain", description: "Brain and nervous system experts" },
              { name: "Pediatrics", icon: "Baby", description: "Specialized care for children and infants" },
              { name: "Dermatology", icon: "Sparkles", description: "Skin, hair, and nail health specialists" },
              { name: "Mental Health", icon: "Users", description: "Psychology and psychiatric support" }
            ].map((dept, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer group"
                onClick={() => navigate('/signup')}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mb-4 group-hover:from-blue-200 group-hover:to-blue-300 transition-all">
                  <ApperIcon name={dept.icon} size={24} className="text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{dept.name}</h3>
                <p className="text-gray-600 text-sm">{dept.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Healthcare?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of patients who trust MediVerse AI for their healthcare needs
            </p>
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-50"
              onClick={() => navigate('/signup')}
            >
              Start Your Free Consultation
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
export default Dashboard;
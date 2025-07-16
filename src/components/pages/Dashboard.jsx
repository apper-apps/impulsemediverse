import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import StatCard from "@/components/molecules/StatCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { departmentService } from "@/services/api/departmentService";
import { consultationService } from "@/services/api/consultationService";
import { medicalRecordService } from "@/services/api/medicalRecordService";
import { format } from "date-fns";

const Dashboard = () => {
  const [departments, setDepartments] = useState([]);
  const [recentConsultations, setRecentConsultations] = useState([]);
  const [recentRecords, setRecentRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
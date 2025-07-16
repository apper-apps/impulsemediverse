import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ChatInterface from "@/components/organisms/ChatInterface";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { departmentService } from "@/services/api/departmentService";
import { toast } from "react-toastify";

const Consultation = () => {
  const { departmentId } = useParams();
  const navigate = useNavigate();
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDepartment();
  }, [departmentId]);

  const loadDepartment = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await departmentService.getById(departmentId);
      if (!data) {
        throw new Error("Department not found");
      }
      setDepartment(data);
    } catch (err) {
      setError(err.message || "Failed to load department");
    } finally {
      setLoading(false);
    }
  };

  const handleEndConsultation = () => {
    toast.success("Consultation ended successfully. Summary saved to your records.");
    navigate("/consultations");
  };

  const handleRetry = () => {
    loadDepartment();
  };

  if (loading) {
    return <Loading type="dashboard" />;
  }

  if (error) {
    return <Error message={error} onRetry={handleRetry} type="medical" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/departments")}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ApperIcon name="ArrowLeft" size={20} className="text-gray-600" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
              <ApperIcon name={department.icon} size={24} className="text-primary-600 medical-icon" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{department.name}</h1>
              <p className="text-gray-600">AI Medical Assistant</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Badge variant="success" className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Online</span>
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={handleEndConsultation}
            icon="Square"
          >
            End Consultation
          </Button>
        </div>
      </div>

      {/* Department Info */}
      <Card className="p-6">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center">
            <ApperIcon name={department.icon} size={32} className="text-primary-600 medical-icon" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{department.name}</h2>
            <p className="text-gray-600 mb-4">{department.description}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <ApperIcon name="Clock" size={14} />
                <span>24/7 Available</span>
              </div>
              <div className="flex items-center space-x-1">
                <ApperIcon name="Shield" size={14} />
                <span>HIPAA Compliant</span>
              </div>
              <div className="flex items-center space-x-1">
                <ApperIcon name="Bot" size={14} />
                <span>AI-Powered</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Chat Interface */}
      <Card className="h-[600px] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
              <ApperIcon name="Bot" size={16} className="text-white" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">AI {department.name}</h3>
              <p className="text-sm text-gray-600">Ready to help with your health concerns</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" icon="Mic">
              Voice
            </Button>
            <Button variant="outline" size="sm" icon="Upload">
              Files
            </Button>
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <ChatInterface
            departmentId={departmentId}
            departmentName={department.name}
          />
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6"
        >
          <div className="flex items-center space-x-3 mb-3">
            <ApperIcon name="Upload" size={20} className="text-blue-600" />
            <h3 className="font-semibold text-blue-900">Upload Files</h3>
          </div>
          <p className="text-blue-800 text-sm">
            Upload test results, prescriptions, or medical images for AI analysis.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6"
        >
          <div className="flex items-center space-x-3 mb-3">
            <ApperIcon name="Mic" size={20} className="text-green-600" />
            <h3 className="font-semibold text-green-900">Voice Chat</h3>
          </div>
          <p className="text-green-800 text-sm">
            Use voice commands to describe symptoms or ask questions naturally.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6"
        >
          <div className="flex items-center space-x-3 mb-3">
            <ApperIcon name="FileText" size={20} className="text-purple-600" />
            <h3 className="font-semibold text-purple-900">Get Summary</h3>
          </div>
          <p className="text-purple-800 text-sm">
            Receive a detailed consultation summary with recommendations.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Consultation;
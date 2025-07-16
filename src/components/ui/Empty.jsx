import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No data available",
  description = "Get started by adding your first item.",
  icon = "Inbox",
  action,
  actionText = "Get Started",
  type = "general"
}) => {
  const getEmptyContent = () => {
    switch (type) {
      case "consultations":
        return {
          title: "No consultations yet",
          description: "Start your first AI consultation with one of our specialized departments.",
          icon: "MessageCircle",
          actionText: "Start Consultation"
        };
      case "records":
        return {
          title: "No medical records",
          description: "Upload your test results and medical documents to get AI-powered analysis.",
          icon: "FileText",
          actionText: "Upload Records"
        };
      case "departments":
        return {
          title: "No departments available",
          description: "Our AI specialists are currently being prepared for you.",
          icon: "Building2",
          actionText: "Refresh"
        };
      case "chat":
        return {
          title: "Start your consultation",
          description: "Ask questions about your health, symptoms, or upload medical files for analysis.",
          icon: "MessageSquare",
          actionText: "Ask Question"
        };
      default:
        return { title, description, icon, actionText };
    }
  };

  const content = getEmptyContent();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-12 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100"
    >
      <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={content.icon} size={40} className="text-primary-600" />
      </div>
      
      <h3 className="text-2xl font-semibold text-gray-900 mb-3">
        {content.title}
      </h3>
      
      <p className="text-gray-600 text-center mb-8 max-w-md leading-relaxed">
        {content.description}
      </p>
      
      {action && (
        <button
          onClick={action}
          className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          <ApperIcon name="Plus" size={18} />
          <span className="font-medium">{content.actionText}</span>
        </button>
      )}
      
      <div className="mt-8 flex items-center space-x-6 text-sm text-gray-500">
        <div className="flex items-center space-x-2">
          <ApperIcon name="Shield" size={16} />
          <span>HIPAA Compliant</span>
        </div>
        <div className="flex items-center space-x-2">
          <ApperIcon name="Lock" size={16} />
          <span>Secure & Private</span>
        </div>
        <div className="flex items-center space-x-2">
          <ApperIcon name="Clock" size={16} />
          <span>24/7 Available</span>
        </div>
      </div>
    </motion.div>
  );
};

export default Empty;
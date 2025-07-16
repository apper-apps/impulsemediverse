import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry, type = "general" }) => {
  const getErrorIcon = () => {
    switch (type) {
      case "network":
        return "WifiOff";
      case "file":
        return "FileX";
      case "medical":
        return "AlertTriangle";
      default:
        return "AlertCircle";
    }
  };

  const getErrorTitle = () => {
    switch (type) {
      case "network":
        return "Connection Problem";
      case "file":
        return "File Upload Error";
      case "medical":
        return "Medical Data Error";
      default:
        return "Oops! Something went wrong";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-lg border border-gray-100"
    >
      <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name={getErrorIcon()} size={32} className="text-red-500" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {getErrorTitle()}
      </h3>
      
      <p className="text-gray-600 text-center mb-6 max-w-md">
        {message}
      </p>
      
      <div className="flex space-x-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-200 transform hover:scale-105"
          >
            <ApperIcon name="RefreshCw" size={16} />
            <span>Try Again</span>
          </button>
        )}
        
        <button
          onClick={() => window.location.reload()}
          className="flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200"
        >
          <ApperIcon name="RotateCcw" size={16} />
          <span>Refresh Page</span>
        </button>
      </div>
      
      <div className="mt-6 text-sm text-gray-500">
        If the problem persists, please contact our support team.
      </div>
    </motion.div>
  );
};

export default Error;
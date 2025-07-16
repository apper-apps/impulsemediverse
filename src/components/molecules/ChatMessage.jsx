import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";

const ChatMessage = ({ message, isAi = false, timestamp, department, files = [] }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isAi ? "justify-start" : "justify-end"} mb-4`}
    >
      <div className={`max-w-xs lg:max-w-md ${isAi ? "mr-auto" : "ml-auto"}`}>
        {isAi && (
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-6 h-6 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
              <ApperIcon name="Bot" size={14} className="text-white" />
            </div>
            <span className="text-xs font-medium text-gray-600">AI Assistant</span>
            {department && (
              <Badge variant="primary" size="sm">
                {department}
              </Badge>
            )}
          </div>
        )}
        
        <div className={`px-4 py-3 rounded-2xl ${
          isAi 
            ? "bg-white border border-gray-200 text-gray-800" 
            : "bg-gradient-to-r from-primary-500 to-primary-600 text-white"
        }`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
          
          {files.length > 0 && (
            <div className="mt-3 space-y-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center space-x-2 text-xs">
                  <ApperIcon name="Paperclip" size={14} />
                  <span>{file.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className={`text-xs text-gray-500 mt-1 ${isAi ? "text-left" : "text-right"}`}>
          {format(new Date(timestamp), "h:mm a")}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
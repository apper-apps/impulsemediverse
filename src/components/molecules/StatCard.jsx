import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const StatCard = ({ title, value, icon, trend, trendValue, color = "primary" }) => {
  const colorClasses = {
    primary: {
      bg: "from-primary-500 to-primary-600",
      icon: "text-primary-600",
      iconBg: "from-primary-100 to-primary-200"
    },
    secondary: {
      bg: "from-secondary-500 to-secondary-600",
      icon: "text-secondary-600",
      iconBg: "from-secondary-100 to-secondary-200"
    },
    accent: {
      bg: "from-accent-500 to-accent-600",
      icon: "text-accent-600",
      iconBg: "from-accent-100 to-accent-200"
    },
    warning: {
      bg: "from-yellow-500 to-yellow-600",
      icon: "text-yellow-600",
      iconBg: "from-yellow-100 to-yellow-200"
    }
  };

  const colors = colorClasses[color];

  return (
    <Card hover className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 bg-gradient-to-br ${colors.iconBg} rounded-lg flex items-center justify-center`}>
            <ApperIcon name={icon} size={24} className={colors.icon} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        </div>
        
        {trend && (
          <div className={`flex items-center space-x-1 ${
            trend === "up" ? "text-accent-600" : "text-red-600"
          }`}>
            <ApperIcon name={trend === "up" ? "TrendingUp" : "TrendingDown"} size={16} />
            <span className="text-sm font-medium">{trendValue}</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatCard;
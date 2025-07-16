import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ isOpen, onClose, className }) => {
  const menuItems = [
{ name: "Dashboard", path: "/dashboard", icon: "LayoutDashboard" },
    { name: "Departments", path: "/departments", icon: "Building2" },
    { name: "Consultations", path: "/consultations", icon: "MessageCircle" },
    { name: "My Records", path: "/records", icon: "FileText" },
    { name: "Health Trends", path: "/trends", icon: "TrendingUp" },
    { name: "Profile", path: "/profile", icon: "User" }
  ];

  const quickActions = [
    { name: "Emergency", icon: "AlertTriangle", color: "text-red-500" },
    { name: "Upload Files", icon: "Upload", color: "text-blue-500" },
    { name: "Schedule", icon: "Calendar", color: "text-green-500" }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        />
      )}

      {/* Desktop Sidebar */}
      <div className={cn("hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:bg-white lg:border-r lg:border-gray-200", className)}>
        <div className="flex flex-col h-full">
          <div className="flex items-center space-x-3 p-6 border-b border-gray-200">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Heart" size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">MediVerse AI</h1>
              <p className="text-sm text-gray-600">AI General Hospital</p>
            </div>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                  isActive 
                    ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg" 
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <ApperIcon name={item.icon} size={20} />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                {quickActions.map((action) => (
                  <button
                    key={action.name}
                    className="flex items-center space-x-3 w-full px-3 py-2 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <ApperIcon name={action.icon} size={16} className={action.color} />
                    <span className="text-gray-700">{action.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <ApperIcon name="Shield" size={16} className="text-primary-600" />
                <span className="text-sm font-medium text-primary-800">Security</span>
              </div>
              <p className="text-xs text-primary-700">
                Your data is encrypted and HIPAA compliant
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 lg:hidden"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="Heart" size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">MediVerse AI</h1>
                <p className="text-sm text-gray-600">AI General Hospital</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ApperIcon name="X" size={20} className="text-gray-600" />
            </button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                  isActive 
                    ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg" 
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <ApperIcon name={item.icon} size={20} />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                {quickActions.map((action) => (
                  <button
                    key={action.name}
                    className="flex items-center space-x-3 w-full px-3 py-2 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <ApperIcon name={action.icon} size={16} className={action.color} />
                    <span className="text-gray-700">{action.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <ApperIcon name="Shield" size={16} className="text-primary-600" />
                <span className="text-sm font-medium text-primary-800">Security</span>
              </div>
              <p className="text-xs text-primary-700">
                Your data is encrypted and HIPAA compliant
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
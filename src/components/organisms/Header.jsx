import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = ({ currentDepartment, onMobileMenuToggle }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { logout, user } = useAuth();

  const notifications = [
    { id: 1, message: "New health trends available", type: "info", time: "2 min ago" },
    { id: 2, message: "Consultation reminder", type: "warning", time: "10 min ago" },
    { id: 3, message: "Lab results uploaded", type: "success", time: "1 hour ago" }
];

  const handleSignOut = async () => {
    setShowUserMenu(false);
    await logout();
  };

  return (
    <header className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <button
              onClick={onMobileMenuToggle}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ApperIcon name="Menu" size={24} className="text-gray-600" />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="Heart" size={20} className="text-white" />
</div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">MediVerse AI</h1>
                <p className="text-sm text-primary-600 font-medium">The future of healthcare is here</p>
                <p className="text-xs text-gray-500">AI-powered medical care available 24/7</p>
                {currentDepartment && (
                  <p className="text-sm text-gray-600 mt-1">
                    {currentDepartment}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-accent-100 to-accent-200 rounded-lg">
              <ApperIcon name="Shield" size={16} className="text-accent-600" />
              <span className="text-sm font-medium text-accent-800">HIPAA Compliant</span>
            </div>
            
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
              >
                <ApperIcon name="Bell" size={20} className="text-gray-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50"
                >
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="p-4 border-b border-gray-50 hover:bg-gray-50">
                        <div className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            notification.type === "info" ? "bg-blue-500" :
                            notification.type === "warning" ? "bg-yellow-500" :
                            "bg-green-500"
                          }`}></div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
<div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                  <ApperIcon name="User" size={16} className="text-white" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{user?.name || 'John Smith'}</p>
                  <p className="text-xs text-gray-500">{user?.role || 'Patient'}</p>
                </div>
                <ApperIcon name="ChevronDown" size={16} className="text-gray-500" />
              </button>
              
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 z-50"
                >
                  <div className="p-2">
                    <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-left">
                      <ApperIcon name="User" size={18} className="text-gray-600" />
                      <span className="text-sm text-gray-900">View Profile</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-left">
                      <ApperIcon name="Settings" size={18} className="text-gray-600" />
                      <span className="text-sm text-gray-900">Settings</span>
                    </button>
                    <div className="border-t border-gray-100 my-2"></div>
                    <button 
                      onClick={handleSignOut}
                      className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors text-left group"
                    >
                      <ApperIcon name="LogOut" size={18} className="text-gray-600 group-hover:text-red-600" />
                      <span className="text-sm text-gray-900 group-hover:text-red-600">Sign Out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
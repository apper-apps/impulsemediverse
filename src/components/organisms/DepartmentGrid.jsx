import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";

const DepartmentGrid = ({ departments, loading, error }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg shimmer"></div>
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded shimmer"></div>
                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-2/3 shimmer"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded shimmer"></div>
              <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-4/5 shimmer"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name="AlertCircle" size={32} className="text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Departments</h3>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {departments.map((department, index) => (
        <motion.div
          key={department.Id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card 
            hover 
            className="p-6 cursor-pointer department-card"
            onClick={() => navigate(`/consultation/${department.Id}`)}
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
                <ApperIcon name={department.icon} size={24} className="text-primary-600 medical-icon" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{department.name}</h3>
                <Badge variant="primary" size="sm" className="mt-1">
                  AI-Powered
                </Badge>
              </div>
            </div>
            
            <p className="text-gray-600 mb-4 line-clamp-2">{department.description}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <ApperIcon name="Clock" size={14} />
                <span>24/7 Available</span>
              </div>
              <div className="flex items-center space-x-1 text-primary-600">
                <span className="text-sm font-medium">Consult</span>
                <ApperIcon name="ArrowRight" size={16} />
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default DepartmentGrid;
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import DepartmentGrid from "@/components/organisms/DepartmentGrid";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { departmentService } from "@/services/api/departmentService";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadDepartments();
  }, []);

  useEffect(() => {
    filterDepartments();
  }, [departments, searchQuery]);

  const loadDepartments = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await departmentService.getAll();
      setDepartments(data);
    } catch (err) {
      setError(err.message || "Failed to load departments");
    } finally {
      setLoading(false);
    }
  };

  const filterDepartments = () => {
    if (!searchQuery.trim()) {
      setFilteredDepartments(departments);
      return;
    }

    const filtered = departments.filter(department =>
      department.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      department.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredDepartments(filtered);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleRetry = () => {
    loadDepartments();
  };

  if (loading) {
    return <Loading type="dashboard" />;
  }

  if (error) {
    return <Error message={error} onRetry={handleRetry} type="medical" />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Medical Departments</h1>
          <p className="text-gray-600 mt-1">
            Choose from our specialized AI medical assistants for personalized healthcare guidance.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" icon="Clock">
            24/7 Available
          </Button>
          <Button icon="Shield" variant="success">
            HIPAA Compliant
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search departments..."
            className="max-w-md"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" icon="Filter">
            Filter
          </Button>
          <Button variant="outline" size="sm" icon="SortAsc">
            Sort
          </Button>
        </div>
      </div>

      {/* Department Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Bot" size={20} className="text-white" />
            </div>
            <h3 className="text-lg font-semibold text-primary-900">AI-Powered Care</h3>
          </div>
          <p className="text-primary-800 text-sm">
            Our AI assistants are trained on the latest medical knowledge and can provide 24/7 support for your healthcare needs.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-xl p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="MessageCircle" size={20} className="text-white" />
            </div>
            <h3 className="text-lg font-semibold text-secondary-900">Voice & Text</h3>
          </div>
          <p className="text-secondary-800 text-sm">
            Communicate with our AI specialists through both voice and text interfaces for maximum convenience.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-accent-50 to-accent-100 rounded-xl p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Upload" size={20} className="text-white" />
            </div>
            <h3 className="text-lg font-semibold text-accent-900">File Analysis</h3>
          </div>
          <p className="text-accent-800 text-sm">
            Upload medical documents, lab results, and images for AI-powered analysis and insights.
          </p>
        </motion.div>
      </div>

      {/* Departments Grid */}
      {filteredDepartments.length === 0 && !loading ? (
        <Empty
          type="departments"
          title="No departments found"
          description="Try adjusting your search criteria or check back later."
          action={handleRetry}
          actionText="Refresh"
        />
      ) : (
        <DepartmentGrid
          departments={filteredDepartments}
          loading={loading}
          error={error}
        />
      )}

      {/* Health Tips */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Health Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <ApperIcon name="Heart" size={16} className="text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Regular Checkups</h3>
              <p className="text-sm text-gray-600">Schedule regular consultations with our AI specialists for preventive care.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <ApperIcon name="Activity" size={16} className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Stay Active</h3>
              <p className="text-sm text-gray-600">Maintain a healthy lifestyle with regular exercise and balanced nutrition.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <ApperIcon name="Brain" size={16} className="text-purple-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Mental Health</h3>
              <p className="text-sm text-gray-600">Don't forget to take care of your mental health and emotional well-being.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Departments;
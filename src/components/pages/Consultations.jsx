import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { consultationService } from "@/services/api/consultationService";
import { toast } from "react-toastify";

const Consultations = () => {
  const [consultations, setConsultations] = useState([]);
  const [filteredConsultations, setFilteredConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    loadConsultations();
  }, []);

  useEffect(() => {
    filterConsultations();
  }, [consultations, searchQuery, filter]);

  const loadConsultations = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await consultationService.getByPatientId("patient1");
      setConsultations(data);
    } catch (err) {
      setError(err.message || "Failed to load consultations");
    } finally {
      setLoading(false);
    }
  };

  const filterConsultations = () => {
    let filtered = [...consultations];

    if (searchQuery.trim()) {
      filtered = filtered.filter(consultation =>
        consultation.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        consultation.summary.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filter !== "all") {
      filtered = filtered.filter(consultation => consultation.status === filter);
    }

    setFilteredConsultations(filtered);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleRetry = () => {
    loadConsultations();
  };

  const handleDeleteConsultation = async (consultationId) => {
    try {
      await consultationService.delete(consultationId);
      setConsultations(prev => prev.filter(c => c.Id !== consultationId));
      toast.success("Consultation deleted successfully");
    } catch (err) {
      toast.error("Failed to delete consultation");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "primary";
      case "completed":
        return "success";
      case "cancelled":
        return "danger";
      default:
        return "default";
    }
  };

  const getDepartmentIcon = (department) => {
    const iconMap = {
      "General Practitioner": "Stethoscope",
      "Cardiologist": "Heart",
      "Neurologist": "Brain",
      "Psychologist": "Users",
      "General Nurse": "UserCheck"
    };
    return iconMap[department] || "MessageCircle";
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
          <h1 className="text-3xl font-bold text-gray-900">My Consultations</h1>
          <p className="text-gray-600 mt-1">
            View and manage your consultation history with our AI medical specialists.
          </p>
        </div>
        <Button
          icon="Plus"
          onClick={() => navigate("/departments")}
        >
          New Consultation
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search consultations..."
            className="max-w-md"
          />
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <Button variant="outline" size="sm" icon="Filter">
            Filter
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
              <ApperIcon name="MessageCircle" size={20} className="text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{consultations.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
              <ApperIcon name="Clock" size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">
                {consultations.filter(c => c.status === "active").length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckCircle" size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {consultations.filter(c => c.status === "completed").length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
              <ApperIcon name="Calendar" size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">
                {consultations.filter(c => 
                  new Date(c.timestamp).getMonth() === new Date().getMonth()
                ).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Consultations List */}
      {filteredConsultations.length === 0 ? (
        <Empty
          type="consultations"
          action={() => navigate("/departments")}
        />
      ) : (
        <div className="space-y-4">
          {filteredConsultations.map((consultation, index) => (
            <motion.div
              key={consultation.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
                      <ApperIcon 
                        name={getDepartmentIcon(consultation.department)} 
                        size={24} 
                        className="text-primary-600 medical-icon" 
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {consultation.department}
                        </h3>
                        <Badge variant={getStatusColor(consultation.status)}>
                          {consultation.status}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{consultation.summary}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <ApperIcon name="Calendar" size={14} />
                          <span>{format(new Date(consultation.timestamp), "MMM d, yyyy")}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ApperIcon name="Clock" size={14} />
                          <span>{format(new Date(consultation.timestamp), "h:mm a")}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ApperIcon name="MessageCircle" size={14} />
                          <span>{consultation.messages.length} messages</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {consultation.status === "active" && (
                      <Button
                        size="sm"
                        onClick={() => navigate(`/consultation/${consultation.departmentId}`)}
                        icon="MessageCircle"
                      >
                        Continue
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/consultation/${consultation.departmentId}`)}
                      icon="Eye"
                    >
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteConsultation(consultation.Id)}
                      icon="Trash2"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Consultations;
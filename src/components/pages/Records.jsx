import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import FileUpload from "@/components/molecules/FileUpload";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { medicalRecordService } from "@/services/api/medicalRecordService";
import { toast } from "react-toastify";

const Records = () => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    loadRecords();
  }, []);

  useEffect(() => {
    filterRecords();
  }, [records, searchQuery, categoryFilter]);

  const loadRecords = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await medicalRecordService.getByPatientId("patient1");
      setRecords(data);
    } catch (err) {
      setError(err.message || "Failed to load medical records");
    } finally {
      setLoading(false);
    }
  };

  const filterRecords = () => {
    let filtered = [...records];

    if (searchQuery.trim()) {
      filtered = filtered.filter(record =>
        record.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(record => record.category === categoryFilter);
    }

    setFilteredRecords(filtered);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFileUpload = async (file) => {
    try {
      const newRecord = await medicalRecordService.uploadFile(file, "patient1");
      setRecords(prev => [newRecord, ...prev]);
      toast.success("File uploaded and analyzed successfully!");
    } catch (err) {
      toast.error("Failed to upload file");
      throw err;
    }
  };

  const handleDeleteRecord = async (recordId) => {
    try {
      await medicalRecordService.delete(recordId);
      setRecords(prev => prev.filter(r => r.Id !== recordId));
      toast.success("Medical record deleted successfully");
    } catch (err) {
      toast.error("Failed to delete record");
    }
  };

  const handleRetry = () => {
    loadRecords();
  };

  const getFileIcon = (fileType) => {
    if (fileType.includes("pdf")) return "FileText";
    if (fileType.includes("image")) return "Image";
    return "File";
  };

  const getCategoryColor = (category) => {
    const colors = {
      "Lab Results": "primary",
      "Cardiac Tests": "danger",
      "Imaging": "secondary",
      "Medications": "accent",
      "General": "default"
    };
    return colors[category] || "default";
  };

  const categories = ["all", "Lab Results", "Cardiac Tests", "Imaging", "Medications", "General"];

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
          <h1 className="text-3xl font-bold text-gray-900">Medical Records</h1>
          <p className="text-gray-600 mt-1">
            Upload and manage your medical documents, test results, and health records.
          </p>
        </div>
        <Button
          icon="Upload"
          onClick={() => setShowUpload(!showUpload)}
        >
          Upload Files
        </Button>
      </div>

      {/* Upload Section */}
      {showUpload && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Medical Files</h2>
            <FileUpload onFileUpload={handleFileUpload} />
          </Card>
        </motion.div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search records..."
            className="max-w-md"
          />
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === "all" ? "All Categories" : category}
              </option>
            ))}
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
              <ApperIcon name="FileText" size={20} className="text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Records</p>
              <p className="text-2xl font-bold text-gray-900">{records.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
              <ApperIcon name="TestTube" size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Lab Results</p>
              <p className="text-2xl font-bold text-gray-900">
                {records.filter(r => r.category === "Lab Results").length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
              <ApperIcon name="Image" size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Imaging</p>
              <p className="text-2xl font-bold text-gray-900">
                {records.filter(r => r.category === "Imaging").length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
              <ApperIcon name="Pill" size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Medications</p>
              <p className="text-2xl font-bold text-gray-900">
                {records.filter(r => r.category === "Medications").length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Records List */}
      {filteredRecords.length === 0 ? (
        <Empty
          type="records"
          action={() => setShowUpload(true)}
        />
      ) : (
        <div className="space-y-4">
          {filteredRecords.map((record, index) => (
            <motion.div
              key={record.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-lg flex items-center justify-center">
                      <ApperIcon 
                        name={getFileIcon(record.fileType)} 
                        size={24} 
                        className="text-secondary-600" 
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {record.fileName}
                        </h3>
                        <Badge variant={getCategoryColor(record.category)}>
                          {record.category}
                        </Badge>
                        <Badge variant="default" size="sm">
                          {record.fileType.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{record.department}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <ApperIcon name="Calendar" size={14} />
                          <span>{format(new Date(record.uploadDate), "MMM d, yyyy")}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ApperIcon name="Clock" size={14} />
                          <span>{format(new Date(record.uploadDate), "h:mm a")}</span>
                        </div>
                        {record.parsedData && (
                          <div className="flex items-center space-x-1">
                            <ApperIcon name="Bot" size={14} />
                            <span>AI Analyzed</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      icon="Eye"
                    >
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      icon="Download"
                    >
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteRecord(record.Id)}
                      icon="Trash2"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
                
                {record.parsedData && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">AI Analysis Summary</h4>
                    <p className="text-sm text-gray-600">{record.parsedData.results}</p>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Records;
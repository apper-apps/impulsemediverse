import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import { toast } from "react-toastify";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "John Smith",
    email: "john.smith@example.com",
    dateOfBirth: "1985-06-15",
    gender: "Male",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, City, State 12345",
    emergencyContact: "Jane Smith - +1 (555) 987-6543",
    medicalConditions: ["Hypertension", "Type 2 Diabetes"],
    allergies: ["Penicillin", "Shellfish"],
    medications: ["Lisinopril 10mg", "Metformin 500mg"],
    bloodType: "A+",
    height: "5'10\"",
    weight: "175 lbs"
  });

  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    setEditForm(profile);
  }, [profile]);

  const handleEditToggle = () => {
    setEditing(!editing);
    if (!editing) {
      setEditForm(profile);
    }
  };

  const handleSave = () => {
    setProfile(editForm);
    setEditing(false);
    toast.success("Profile updated successfully!");
  };

  const handleCancel = () => {
    setEditForm(profile);
    setEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field, index, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const handleAddToArray = (field) => {
    setEditForm(prev => ({
      ...prev,
      [field]: [...prev[field], ""]
    }));
  };

  const handleRemoveFromArray = (field, index) => {
    setEditForm(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Medical Profile</h1>
          <p className="text-gray-600 mt-1">
            Manage your personal information and medical history.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {editing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave} icon="Save">
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={handleEditToggle} icon="Edit">
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Profile Overview */}
      <Card className="p-6">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
            <ApperIcon name="User" size={40} className="text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
            <p className="text-gray-600">{profile.email}</p>
            <div className="flex items-center space-x-4 mt-2">
              <Badge variant="primary">{profile.gender}</Badge>
              <Badge variant="secondary">{profile.bloodType}</Badge>
              <Badge variant="success">Active Patient</Badge>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Patient ID</p>
            <p className="font-mono text-gray-900">#PAT-001</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Personal Information */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              {editing ? (
                <Input
                  value={editForm.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter full name"
                />
              ) : (
                <p className="text-gray-900">{profile.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              {editing ? (
                <Input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter email"
                />
              ) : (
                <p className="text-gray-900">{profile.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              {editing ? (
                <Input
                  type="date"
                  value={editForm.dateOfBirth}
                  onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                />
              ) : (
                <p className="text-gray-900">{new Date(profile.dateOfBirth).toLocaleDateString()}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              {editing ? (
                <select
                  value={editForm.gender}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <p className="text-gray-900">{profile.gender}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              {editing ? (
                <Input
                  value={editForm.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Enter phone number"
                />
              ) : (
                <p className="text-gray-900">{profile.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              {editing ? (
                <textarea
                  value={editForm.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Enter address"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  rows="3"
                />
              ) : (
                <p className="text-gray-900">{profile.address}</p>
              )}
            </div>
          </div>
        </Card>

        {/* Medical Information */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Medical Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
              {editing ? (
                <select
                  value={editForm.bloodType}
                  onChange={(e) => handleInputChange("bloodType", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              ) : (
                <p className="text-gray-900">{profile.bloodType}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
<label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
                {editing ? (
                  <Input
                    value={editForm.height}
                    onChange={(e) => handleInputChange("height", e.target.value)}
                    placeholder="e.g., 5'10\""
                  />
                ) : (
                  <p className="text-gray-900">{profile.height}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                {editing ? (
                  <Input
                    value={editForm.weight}
                    onChange={(e) => handleInputChange("weight", e.target.value)}
                    placeholder="e.g., 175 lbs"
                  />
                ) : (
                  <p className="text-gray-900">{profile.weight}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
              {editing ? (
                <Input
                  value={editForm.emergencyContact}
                  onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                  placeholder="Name - Phone number"
                />
              ) : (
                <p className="text-gray-900">{profile.emergencyContact}</p>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Medical Conditions */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Medical Conditions</h3>
        <div className="space-y-3">
          {(editing ? editForm.medicalConditions : profile.medicalConditions).map((condition, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              {editing ? (
                <div className="flex-1 flex items-center space-x-2">
                  <Input
                    value={condition}
                    onChange={(e) => handleArrayChange("medicalConditions", index, e.target.value)}
                    placeholder="Enter medical condition"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveFromArray("medicalConditions", index)}
                    icon="X"
                  />
                </div>
              ) : (
                <span className="text-gray-900">{condition}</span>
              )}
            </div>
          ))}
          {editing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAddToArray("medicalConditions")}
              icon="Plus"
            >
              Add Condition
            </Button>
          )}
        </div>
      </Card>

      {/* Allergies */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Allergies</h3>
        <div className="space-y-3">
          {(editing ? editForm.allergies : profile.allergies).map((allergy, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              {editing ? (
                <div className="flex-1 flex items-center space-x-2">
                  <Input
                    value={allergy}
                    onChange={(e) => handleArrayChange("allergies", index, e.target.value)}
                    placeholder="Enter allergy"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveFromArray("allergies", index)}
                    icon="X"
                  />
                </div>
              ) : (
                <span className="text-gray-900">{allergy}</span>
              )}
            </div>
          ))}
          {editing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAddToArray("allergies")}
              icon="Plus"
            >
              Add Allergy
            </Button>
          )}
        </div>
      </Card>

      {/* Current Medications */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Current Medications</h3>
        <div className="space-y-3">
          {(editing ? editForm.medications : profile.medications).map((medication, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              {editing ? (
                <div className="flex-1 flex items-center space-x-2">
                  <Input
                    value={medication}
                    onChange={(e) => handleArrayChange("medications", index, e.target.value)}
                    placeholder="Enter medication and dosage"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveFromArray("medications", index)}
                    icon="X"
                  />
                </div>
              ) : (
                <span className="text-gray-900">{medication}</span>
              )}
            </div>
          ))}
          {editing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAddToArray("medications")}
              icon="Plus"
            >
              Add Medication
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Profile;
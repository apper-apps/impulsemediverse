import { Route, BrowserRouter, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/organisms/Layout";
import SignIn from "@/components/pages/SignIn";
import Consultation from "@/components/pages/Consultation";
import HealthTrends from "@/components/pages/HealthTrends";
import AuthenticatedDashboard from "@/components/pages/AuthenticatedDashboard";
import SignUp from "@/components/pages/SignUp";
import Profile from "@/components/pages/Profile";
import Departments from "@/components/pages/Departments";
import Records from "@/components/pages/Records";
import Dashboard from "@/components/pages/Dashboard";
import Consultations from "@/components/pages/Consultations";
import { AuthProvider } from "@/contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
<BrowserRouter>
        <div className="min-h-screen bg-white">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="departments" element={<Departments />} />
              <Route path="consultation/:departmentId" element={<Consultation />} />
              <Route path="consultations" element={<Consultations />} />
              <Route path="records" element={<Records />} />
              <Route path="trends" element={<HealthTrends />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            style={{ zIndex: 9999 }}
/>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
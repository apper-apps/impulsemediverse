import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "@/components/organisms/Layout";
import Dashboard from "@/components/pages/Dashboard";
import Departments from "@/components/pages/Departments";
import Consultation from "@/components/pages/Consultation";
import Consultations from "@/components/pages/Consultations";
import Records from "@/components/pages/Records";
import HealthTrends from "@/components/pages/HealthTrends";
import Profile from "@/components/pages/Profile";
import SignIn from "@/components/pages/SignIn";
import SignUp from "@/components/pages/SignUp";
import ProtectedRoute from "@/components/ProtectedRoute";

// Create new Landing Page component
const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Layout isLanding={true}>
        <Dashboard />
      </Layout>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <Routes>
            {/* Public landing page */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Authentication routes */}
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
      </Router>
    </AuthProvider>
  );
}

export default App;
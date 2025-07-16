import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";

const Layout = ({ isLanding = false, children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      <Header 
        onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        isLanding={isLanding}
      />
      
      <main className="flex-1 min-h-screen">
        {isLanding ? (
          children
        ) : isAuthenticated ? (
          <div className="lg:pl-64">
            <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children || <Outlet />}
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children || <Outlet />}
          </div>
        )}
      </main>
      
      {isLanding && <Footer />}
    </div>
  );
};

export default Layout;
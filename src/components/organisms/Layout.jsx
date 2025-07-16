import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ isLanding = false, children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Header 
        onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        isLanding={isLanding}
      />
      
      <main className="flex-1 min-h-screen">
        {isLanding ? (
          children
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Outlet />
          </div>
        )}
      </main>
      
      {isLanding && <Footer />}
    </div>
  );
};

export default Layout;
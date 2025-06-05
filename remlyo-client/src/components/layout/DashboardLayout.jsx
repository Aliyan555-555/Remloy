// src/components/layout/DashboardLayout.jsx
import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import DashboardSidebar from "./DashboardSidebar";
import AdminSidebar from "./AdminSidebar"; // Import AdminSidebar
import ModeratorSidebar from "./ModeratorSidebar";
import WriterSidebar from "./WriterSidebar";

const DashboardLayout = ({
  children,
  pageTitle = "Dashboard",
  user,
  isPremiumUser = false,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    // Check if window exists (for SSR compatibility)
    if (typeof window !== "undefined") {
      // Return false for mobile screens, true for larger screens
      return window.innerWidth >= 768; // 768px is standard md breakpoint
    }
    return true; // Default to true for SSR
  });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Sidebar toggle function
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Determine if user is admin
  const isAdmin = user && user.accessLevel !== "user";

  const RenderSidebar = () => {
    switch (user.accessLevel) {
      case "user":
        return (
          <DashboardSidebar
            user={user}
            isSidebarOpen={isSidebarOpen}
            isPremiumUser={isPremiumUser}
          />
        );
      case "admin":
        return <AdminSidebar user={user} isSidebarOpen={isSidebarOpen} />;
      case "moderator":
        return <ModeratorSidebar user={user} isSidebarOpen={isSidebarOpen} />;
      case "writer":
        return <WriterSidebar user={user} isSidebarOpen={isSidebarOpen} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* AI Banner */}
      <div className="bg-brand-green text-white py-2 text-center">
        <div className="container mx-auto px-4">
          <span>🌿 AI-Powered Remedy Recommendations Available!</span>
        </div>
      </div>

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <div className="flex-grow flex overflow-hidden">
        {/* Sidebar - conditionally render based on user role */}
        {/* {isAdmin ? (
          <AdminSidebar user={user} isSidebarOpen={isSidebarOpen} />
        ) : (
          <DashboardSidebar
            user={user}
            isSidebarOpen={isSidebarOpen}
            isPremiumUser={isPremiumUser}
          />
        )} */}
        {RenderSidebar()}

        {/* Main Content Area */}
        <div className="flex-grow p-6 md:ml-0 overflow-x-hidden">
          {/* Mobile Hamburger Button */}
          <div className="flex items-center mb-6">
            <div className="md:hidden mr-4">
              <button
                onClick={toggleSidebar}
                className="text-gray-700"
                aria-label="Toggle Sidebar"
              >
                {isSidebarOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">{pageTitle}</h1>
          </div>

          {/* Page Content */}
          {children}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default DashboardLayout;

import React from "react";
import { Link, useLocation } from "react-router-dom";
import Button from "../common/Button";

const WriterSidebar = ({ user, isSidebarOpen }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  if (!isSidebarOpen) return null;

  return (
    <div className="bg-white border-r border-gray-200 h-screen sticky top-0 w-64 flex-shrink-0 overflow-y-auto z-40">
      {/* User Info */}
      <div className="p-4 flex items-center space-x-3 border-b border-gray-200">
        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 overflow-hidden">
          <img
            src="/images/avatar.png"
            alt="Writer Avatar"
            className="w-full h-full object-cover rounded-full"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/48?text=✍️";
            }}
          />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">
            {user?.username || "Writer"}
          </h3>
          <p className="text-sm text-gray-500 capitalize">
            {user?.accessLevel || "writer"}
          </p>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <nav className="py-6 px-4 space-y-4">
        <Link to="/writer/dashboard" className="block">
          <Button
            variant={isActive("/writer/dashboard") ? "contained" : "text"}
            color="brand"
            className="w-full justify-start"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Dashboard
          </Button>
        </Link>
        <Link to="/writer/articles" className="block">
          <Button
            variant={isActive("/writer/articles") && !location.pathname.includes('/add') ? "contained" : "text"}
            color="brand"
            className="w-full justify-start"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21H5a2 2 0 01-2-2V7a2 2 0 012-2h7l2 2h5a2 2 0 012 2v10a2 2 0 01-2 2z"
              />
            </svg>
            Articles
          </Button>
        </Link>
        <Link to="/writer/articles/add" className="block">
          <Button
            variant={isActive("/writer/articles/add") && location.pathname.includes("/add") ? "contained" : "text"}
            color="brand"
            className="w-full justify-start"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            Add Articles
          </Button>
        </Link>
      </nav>
    </div>
  );
};

export default WriterSidebar;

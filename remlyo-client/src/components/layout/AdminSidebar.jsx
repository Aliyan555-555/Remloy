// src/components/layout/AdminSidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import Button from "../common/Button";

const AdminSidebar = ({ user, isSidebarOpen }) => {
  const location = useLocation();

  // Check if the current path matches the given path
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  // If sidebar is closed on mobile, don't render the content
  if (!isSidebarOpen) {
    return null; // Return null when sidebar should be hidden on mobile
  }

  return (
    <div className="bg-white border-r border-gray-200 h-screen sticky top-0 w-64 flex-shrink-0 overflow-y-auto z-40">
      {/* User Info */}
      <div className="p-4 flex items-center space-x-3 border-b border-gray-200">
        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 overflow-hidden">
          <img
            src="/images/avatar.png"
            alt="User Avatar"
            className="w-full h-full object-cover rounded-full"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/48?text=👤";
            }}
          />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">
            {user?.username || "Admin"}
          </h3>
          <p className="text-sm text-gray-500 capitalize">
            {user?.accessLevel || "admin123"}
          </p>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <nav className="py-6 px-4 space-y-4">
        <Link to="/admin/dashboard" className="block">
          <Button
            variant={isActive("/admin/dashboard") ? "contained" : "text"}
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

        <Link to="/admin/users" className="block">
          <Button
            variant={
              isActive("/admin/users") && !location.pathname.includes("/add")
                ? "contained"
                : "text"
            }
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
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            Users
          </Button>
        </Link>

        <Link to="/admin/users/add" className="block">
          <Button
            variant={isActive("/admin/users/add") ? "contained" : "text"}
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add User
          </Button>
        </Link>

        <Link to="/admin/remedies" className="block">
          <Button
            variant={
              isActive("/admin/remedies") && !location.pathname.includes("/add")
                ? "contained"
                : "text"
            }
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
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
              />
            </svg>
            Remedies
          </Button>
        </Link>

        <Link to="/admin/remedies/add" className="block">
          <Button
            variant={isActive("/admin/remedies/add") ? "contained" : "text"}
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Remedy
          </Button>
        </Link>
        <Link to="/admin/ailments" className="block">
          <Button
            variant={
              isActive("/admin/ailments") && !location.pathname.includes("/add")
                ? "contained"
                : "text"
            }
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
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
              />
            </svg>
            Ailments
          </Button>
        </Link>

        <Link to="/admin/ailments/add" className="block">
          <Button
            variant={isActive("/admin/ailments/add") ? "contained" : "text"}
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Ailment
          </Button>
        </Link>

        <Link to="/admin/reports" className="block">
          <Button
            variant={isActive("/admin/reports") ? "contained" : "text"}
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
            Reports
          </Button>
        </Link>

        <Link to="/admin/settings" className="block">
          <Button
            variant={isActive("/admin/settings") ? "contained" : "text"}
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
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Settings
          </Button>
        </Link>
      </nav>
    </div>
  );
};

export default AdminSidebar;

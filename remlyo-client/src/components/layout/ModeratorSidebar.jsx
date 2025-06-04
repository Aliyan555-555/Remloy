// src/components/layout/ModeratorSidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import Button from "../common/Button";

const ModeratorSidebar = ({ user, isSidebarOpen }) => {
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
            alt="Moderator Avatar"
            className="w-full h-full object-cover rounded-full"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/48?text=👤";
            }}
          />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">{user?.username || "Moderator"}</h3>
          <p className="text-sm text-gray-500 capitalize">{user?.accessLevel || "moderator"}</p>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <nav className="py-6 px-4 space-y-4">
        <Link to="/moderator/dashboard" className="block">
          <Button
            variant={isActive("/moderator/dashboard") ? "contained" : "text"}
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
        <Link to="/moderator/remedies" className="block">
          <Button
            variant={isActive("/moderator/remedies") ? "contained" : "text"}
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
                d="M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
              />
            </svg>
            Remedies
          </Button>
        </Link>

        <Link to="/moderator/comments" className="block">
          <Button
            variant={isActive("/moderator/comments") ? "contained" : "text"}
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
                d="M8 10h.01M12 10h.01M16 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Comments
          </Button>
        </Link>

        <Link to="/moderator/flags" className="block">
          <Button
            variant={isActive("/moderator/flags") ? "contained" : "text"}
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
                d="M5 5v14M5 5l7-2 7 2v6l-7-2-7 2V5z"
              />
            </svg>
            Flagged Content
          </Button>
        </Link>

        <Link to="/moderator/users" className="block">
          <Button
            variant={isActive("/moderator/users") ? "contained" : "text"}
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
                d="M18.364 5.636a9 9 0 11-12.728 0M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Moderate Users
          </Button>
        </Link>
      </nav>
    </div>
  );
};

export default ModeratorSidebar;

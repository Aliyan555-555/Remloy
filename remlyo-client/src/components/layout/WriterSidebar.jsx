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
          <h3 className="font-semibold text-gray-800">{user?.username || "Writer"}</h3>
          <p className="text-sm text-gray-500 capitalize">{user?.accessLevel || "writer"}</p>
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </Button>
        </Link>

        <Link to="/writer/remedies" className="block">
          <Button
            variant={isActive("/writer/remedies") ? "contained" : "text"}
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            My Remedies
          </Button>
        </Link>

        <Link to="/writer/articles" className="block">
          <Button
            variant={isActive("/writer/articles") ? "contained" : "text"}
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21H5a2 2 0 01-2-2V7a2 2 0 012-2h7l2 2h5a2 2 0 012 2v10a2 2 0 01-2 2z" />
            </svg>
            Articles
          </Button>
        </Link>

        <Link to="/writer/drafts" className="block">
          <Button
            variant={isActive("/writer/drafts") ? "contained" : "text"}
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M8 12h.01M12 12h.01M16 12h.01M9 16h6" />
            </svg>
            Drafts & Scheduling
          </Button>
        </Link>

        <Link to="/writer/analytics" className="block">
          <Button
            variant={isActive("/writer/analytics") ? "contained" : "text"}
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 11V5a1 1 0 112 0v6h3l-4 4-4-4h3zM5 19h14a2 2 0 002-2v-2a1 1 0 10-2 0v2H5v-2a1 1 0 10-2 0v2a2 2 0 002 2z" />
            </svg>
            My Analytics
          </Button>
        </Link>
      </nav>
    </div>
  );
};

export default WriterSidebar;

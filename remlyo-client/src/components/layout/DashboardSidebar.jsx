// src/components/layout/DashboardSidebar.jsx
import React from "react";
import { useLocation } from "react-router-dom";
import Button from "../common/Button";

const DashboardSidebar = ({ user, isSidebarOpen, isPremiumUser = false }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Get correct dashboard path based on user subscription
  const dashboardPath = "/dashboard";

  return (
    <div
      className={`bg-white border-r border-gray-200 overflow-y-auto z-30 ${
        isSidebarOpen ? "block" : "hidden md:block"
      }`}
      style={{ minWidth: "220px", maxWidth: "260px", width: "18%" }}
    >
      {/* User Info */}
      <div className="p-4 flex items-center space-x-3">
        <div className="w-12 h-12 rounded-full overflow-hidden">
          <img
            src="/images/avatar.png"
            alt="User Avatar"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">
            {user?.name || "User"}
          </h3>
          <p className="text-sm text-gray-500">{user?.username || ""}</p>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <div className="p-2">
        <Button
          variant={isActive(dashboardPath) ? "contained" : "text"}
          color="brand"
          className="justify-start w-full py-3 px-4 text-left rounded-full mb-2 z-10 relative overflow-hidden"
          to={dashboardPath}
        >
          <div className="flex items-center whitespace-nowrap">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-3 flex-shrink-0"
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
            <span className="truncate">Dashboard</span>
          </div>
        </Button>

        {/* Premium-only Manage Plan Button */}
        {isPremiumUser && (
          <Button
            variant={isActive("/manage-plan") ? "contained" : "text"}
            color="brand"
            className="justify-start w-full py-3 px-4 text-left rounded-full mb-2 z-10 relative overflow-hidden"
            to="/manage-plan"
          >
            <div className="flex items-center whitespace-nowrap">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-3 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
              <span className="truncate">Manage Plan</span>
            </div>
          </Button>
        )}

        <Button
          variant={isActive("/my-remedies") ? "contained" : "text"}
          color="brand"
          className="justify-start w-full py-3 px-4 text-left rounded-full mb-2 z-10 relative overflow-hidden"
          to="/my-remedies"
        >
          <div className="flex items-center whitespace-nowrap">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-3 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span className="truncate">My Remedies</span>
          </div>
        </Button>

        <Button
          variant={isActive("/saved-remedies") ? "contained" : "text"}
          color="brand"
          className="justify-start w-full py-3 px-4 text-left rounded-full mb-2 z-10 relative overflow-hidden"
          to="/saved-remedies"
        >
          <div className="flex items-center whitespace-nowrap">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-3 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
            <span className="truncate">Saved Remedies</span>
          </div>
        </Button>

        <Button
          variant={isActive("/settings") ? "contained" : "text"}
          color="brand"
          className="justify-start w-full py-3 px-4 text-left rounded-full mb-2 z-10 relative overflow-hidden"
          to="/settings"
        >
          <div className="flex items-center whitespace-nowrap">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-3 flex-shrink-0"
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
            <span className="truncate">Settings</span>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default DashboardSidebar;

"use client";

import React from "react";
import { Link } from "react-router-dom";

const UserProfileDropdown = ({ user, profileDropdownOpen }) => {
  return (
    <div
      style={{ boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px" }}
      className={`absolute rounded-lg top-[calc(100%+10px)] bg-white w-[250px] ${
        profileDropdownOpen ? "block opacity-100" : "hidden opacity-0"
      } right-3 z-50 transition-opacity overflow-hidden duration-300`}
    >
      <div className="flex px-4 py-3 items-center gap-3 border-b">
        <img
          src={user.profileImage}
          alt="User Avatar"
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex flex-col overflow-hidden max-w-[150px]">
          <span className="text-sm font-medium truncate whitespace-nowrap overflow-hidden">
            {user.email}
          </span>
          <span className="text-sm text-gray-500 truncate whitespace-nowrap overflow-hidden">
            {user.username}
          </span>
        </div>
      </div>

      <div className="flex flex-col ">
        <Link
          to="/dashboard"
          className="px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
};

export default UserProfileDropdown;

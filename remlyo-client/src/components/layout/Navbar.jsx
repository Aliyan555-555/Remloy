// src/components/layout/Navbar.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../common/Button";
import { useAuth } from "../../contexts/AuthContext";
import UserProfileDropdown from "../common/UserProfileDropdown";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  const handleClickOutside = (event) => {
    const dropdown = document.querySelector('.profile-dropdown-container');
    if (dropdown && !dropdown.contains(event.target)) {
      setProfileDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (profileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileDropdownOpen]);

  return (
    <nav className="bg-white py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/">
              <img src="/images/Remlyo Logo.png" alt="Remlyo" className="h-8" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-brand-green">
              Home
            </Link>
            <Link
              to="/ailments"
              className="text-gray-700 hover:text-brand-green"
            >
              Ailments
            </Link>
            <Link
              to="/remedies"
              className="text-gray-700 hover:text-brand-green"
            >
              Remedies
            </Link>
            <Link
              to="/pricing"
              className="text-gray-700 hover:text-brand-green"
            >
              Pricing
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-brand-green">
              About
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <React.Fragment>
                <Button
                  variant="outlined"
                  color="brand"
                  size="small"
                  onClick={logout}
                  className="md:text-base md:px-5 md:py-2" // Small on mobile, custom medium on desktop
                >
                  Logout
                </Button>
                <div onClick={handleProfileDropdown} className="flex relative items-center space-x-3 profile-dropdown-container">
                  <img
                    src={user.profileImage}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full"
                  />
                  <span className="text-gray-700">{user.name}</span>

                  <UserProfileDropdown user={user} profileDropdownOpen={profileDropdownOpen} />
                </div>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Button
                  variant="outlined"
                  color="brand"
                  size="small"
                  to="/signin"
                  className="md:text-base md:px-5 md:py-2" // Small on mobile, custom medium on desktop
                >
                  Sign In
                </Button>
                <Button
                  variant="contained"
                  color="brand"
                  size="small"
                  to="/signup"
                  className="md:text-base md:px-5 md:py-2" // Small on mobile, custom medium on desktop
                >
                  Join Now
                </Button>
              </React.Fragment>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-500 hover:text-brand-green"
            >
              {isMobileMenuOpen ? (
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
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4">
            <div className="flex flex-col space-y-3">
              <Link
                to="/"
                className="text-gray-700 hover:text-brand-green py-2"
              >
                Home
              </Link>
              <Link
                to="/ailments"
                className="text-gray-700 hover:text-brand-green py-2"
              >
                Ailments
              </Link>
              <Link
                to="/remedies"
                className="text-gray-700 hover:text-brand-green py-2"
              >
                Remedies
              </Link>
              <Link
                to="/pricing"
                className="text-gray-700 hover:text-brand-green py-2"
              >
                Pricing
              </Link>
              <Link
                to="/about"
                className="text-gray-700 hover:text-brand-green py-2"
              >
                About
              </Link>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outlined"
                  color="brand"
                  size="small"
                  to="/signin"
                  className="md:text-base md:px-5 md:py-2" // Small on mobile, custom medium on desktop
                >
                  Sign In
                </Button>
                <Button
                  variant="contained"
                  color="brand"
                  size="small"
                  to="/signup"
                  className="md:text-base md:px-5 md:py-2" // Small on mobile, custom medium on desktop
                >
                  Join Now
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

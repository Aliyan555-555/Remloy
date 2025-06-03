import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../../components/common/Button";
import { Link, useNavigate } from "react-router-dom";

const AddUserPage = () => {
  const { user, signup } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    accessLevel: "user",
    agreeTerms: false,
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    const { username, email, password, confirmPassword, agreeTerms } = formData;

    if (!username || !email || !password || !confirmPassword) {
      return "Please fill in all required fields.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Invalid email format.";
    }

    if (password !== confirmPassword) {
      return "Passwords do not match.";
    }

    if (!agreeTerms) {
      return "You must agree to the terms and privacy policy.";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      return setError(validationError);
    }

    const { username, email, password, accessLevel } = formData;
    const userData = { username, email, password, accessLevel };

    try {
      const res = await signup(userData);
      if (res?.success) {
      return  navigate("/admin/users", { replace: true });
      } else {
        setError(res?.message || "An error occurred while creating the user.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };


  return (
    <DashboardLayout pageTitle="Add User" user={user}>
      <div className="mb-6">
        <p className="text-gray-600">add user with customized role</p>
      </div>

      <div className="flex flex-col justify-between items-center mb-6">
        <div className="mb-4">
          <h2 className="text-4xl font-bold">Create User</h2>
        </div>

        {error && (
          <div className="mb-4 text-red-600 text-sm text-center">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="w-full max-w-lg">
          <div className="mb-4">
            <label htmlFor="username" className="sr-only">
              Full Name
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="sr-only">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="accessLevel" className="sr-only">
              Select Role
            </label>
            <select
              name="accessLevel"
              id="accessLevel"
              value={formData.accessLevel}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
            >
              <option value="user">User</option>
              <option value="moderator">Moderator</option>
              <option value="admin">Admin</option>
              <option value="writer">Writer</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
                required
              />
            </div>
          </div>

          <div className="w-full items-center flex justify-between">
            <div className="flex items-center mb-6">
              <input
                type="checkbox"
                id="agreeTerms"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="h-4 w-4 text-brand-green focus:ring-brand-green border-gray-300 rounded"
                required
              />
              <label htmlFor="agreeTerms" className="ml-2 block text-sm text-gray-700">
                I agree to the{" "}
                <Link to="/terms" className="text-brand-green hover:underline">
                  Terms
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-brand-green hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>
            <Button variant="contained" color="brand" type="submit" className="py-3">
              Create
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddUserPage;

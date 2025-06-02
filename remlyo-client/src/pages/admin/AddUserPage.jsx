import React, { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../../components/common/Button";

const AddUserPage = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { username, email, password, confirmPassword, agreeTerms } = formData;
    if (!username || !email || !password || !confirmPassword) {
      return setError("Please fill in all required fields.");
    }
    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }
    if (!agreeTerms) {
      return setError("You must agree to the terms and privacy policy.");
    }
    const userData = {
      username,
      email,
      password,
    };

    const res = await signup(userData);

    if (res?.success) {
      navigate("/admin/users/add");
    } else {
      setError(res.message);
    }
  };

  return (
    <DashboardLayout pageTitle="Add User" user={user}>
      <div className="mb-6">
        <p className="text-gray-600">add user with customized role</p>
      </div>

      <div className="flex flex-col justify-between items-center mb-6">
        {error && (
          <div className="mb-4 text-red-600 text-sm text-center">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
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

        <div className="">
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
            <label className="block text-gray-700 font-medium mb-2">
              Select Role
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
              value={editRoleValue}
              onChange={(e) => setEditRoleValue(e.target.value)}
            >
              <option value="user">User</option>
              <option value="moderator">Moderator</option>
              <option value="admin">Admin</option>
              <option value="writer">Writer</option>
            </select>
          </div>
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

          <Button
            variant="contained"
            color="brand"
            type="submit"
            fullWidth
            className="py-3"
          >
            Submit
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddUserPage;

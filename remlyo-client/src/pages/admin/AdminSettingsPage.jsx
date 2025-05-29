// src/pages/admin/AdminSettingsPage.jsx
import React, { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Button from "../../components/common/Button";
import { useAuth } from "../../contexts/AuthContext";

const AdminSettingsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("general");

  // Toggle switch states
  const [toggleStates, setToggleStates] = useState({
    siteMaintenance: false,
    freeTrial: true,
    flaggedContent: true,
    spamFilter: true,
    visibilityAllUsers: true,
  });

  // Form states
  const [generalSettings, setGeneralSettings] = useState({
    platformName: "Remlyo",
    timezone: "04/27/2025, 09:57 UTC",
    defaultLanguage: "English",
    supportEmail: "support@remlyo.com",
  });

  const [paymentSettings, setPaymentSettings] = useState({
    stripeAPIKey: "sk_test_************",
    premiumMonthly: "9.99",
    premiumAnnually: "99.00",
    fiveRemediesPrice: "2.99",
    tenRemediesPrice: "4.99",
    refundPolicy: "",
  });

  const [aiSettings, setAiSettings] = useState({
    enableAI: true,
    confidenceThreshold: 75,
  });

  // User states
  const [selectedRole, setSelectedRole] = useState("Admin");
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedRoleForAssign, setSelectedRoleForAssign] = useState("");
  const [userToRemove, setUserToRemove] = useState("");

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    welcomeEmailTemplate: "",
    subscriptionEmailTemplate: "",
    reminderEmailTemplate: "",
    flaggedContent: true,
    failedPayments: true,
  });

  // Community settings
  const [communitySettings, setCommunitySettings] = useState({
    flagThreshold: "5",
    profanityFilter: true,
    spamFilter: true,
    keywordBlockList: "",
  });

  // Toggle handler
  const handleToggle = (setting) => {
    setToggleStates({
      ...toggleStates,
      [setting]: !toggleStates[setting],
    });
  };

  // Input change handlers
  const handleGeneralSettingsChange = (e) => {
    const { name, value } = e.target;
    setGeneralSettings({
      ...generalSettings,
      [name]: value,
    });
  };

  const handlePaymentSettingsChange = (e) => {
    const { name, value } = e.target;
    setPaymentSettings({
      ...paymentSettings,
      [name]: value,
    });
  };

  const handleAISettingsChange = (e) => {
    const { name, value } = e.target;
    setAiSettings({
      ...aiSettings,
      [name]: value,
    });
  };

  const handleNotificationSettingsChange = (e) => {
    const { name, value } = e.target;
    setNotificationSettings({
      ...notificationSettings,
      [name]: value,
    });
  };

  const handleCommunitySettingsChange = (e) => {
    const { name, value } = e.target;
    setCommunitySettings({
      ...communitySettings,
      [name]: value,
    });
  };

  // Save handlers
  const handleSaveGeneralSettings = () => {
    alert("General settings saved!");
  };

  const handleSaveUserAccessSettings = () => {
    alert("User access settings saved!");
  };

  const handleAssignRole = () => {
    if (selectedUser && selectedRoleForAssign) {
      alert(`Role ${selectedRoleForAssign} assigned to ${selectedUser}`);
    } else {
      alert("Please select both user and role");
    }
  };

  const handleRemoveUser = () => {
    if (userToRemove) {
      alert(`User ${userToRemove} removed`);
      setUserToRemove("");
    } else {
      alert("Please select a user to remove");
    }
  };

  const handleSavePaymentSettings = () => {
    alert("Payment settings saved!");
  };

  const handleSaveAISettings = () => {
    alert("AI settings saved!");
  };

  const handleSaveNotificationSettings = () => {
    alert("Notification settings saved!");
  };

  const handleSaveCommunitySettings = () => {
    alert("Community settings saved!");
  };

  // File upload handlers
  const handleFileUpload = (event, documentType) => {
    alert(
      `${documentType} file selected: ${
        event.target.files[0]?.name || "No file selected"
      }`
    );
  };

  // Toggle switch component
  const ToggleSwitch = ({ isOn, onToggle, disabled = false }) => {
    return (
      <div
        className={`relative w-12 h-6 rounded-full cursor-pointer transition-colors ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        } ${isOn ? "bg-brand-green" : "bg-gray-300"}`}
        onClick={disabled ? undefined : onToggle}
      >
        <div
          className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
            isOn ? "right-0.5" : "left-0.5"
          }`}
        />
      </div>
    );
  };

  return (
    <DashboardLayout pageTitle="Setting" user={user} isPremiumUser={true}>
      <div className="mb-4">
        <p className="text-gray-600">
          Manage your roles, security & permissions control settings.
        </p>
      </div>

      {/* Admin Profile Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
              <img
                src="/images/avatar.png"
                alt="Admin"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/64?text=👤";
                }}
              />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Admin</h3>
              <p className="text-gray-500">admin123</p>
            </div>
          </div>
          <Button variant="outlined" color="brand" size="small">
            Edit
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </span>
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">Admin</p>
              </div>
            </div>
            <div className="flex items-center">
              <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
              </span>
              <div>
                <p className="text-sm text-gray-500">Username</p>
                <p className="font-medium">admin123</p>
              </div>
            </div>
            <div className="flex items-center">
              <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </span>
              <div>
                <p className="text-sm text-gray-500">Password</p>
                <p className="font-medium">********</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </span>
              <div>
                <p className="text-sm text-gray-500">Phone No.</p>
                <p className="font-medium">+1 55456455</p>
              </div>
            </div>
            <div className="flex items-center">
              <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </span>
              <div>
                <p className="text-sm text-gray-500">Email Address</p>
                <p className="font-medium">admin@remlyo.com</p>
              </div>
            </div>
            <div className="flex items-center">
              <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </span>
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="font-medium">Admin</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Settings Tabs Navigation */}
        <div className="border-b border-gray-200 px-4">
          <div className="flex flex-wrap -mb-px">
            <button
              className={`mr-4 py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm ${
                activeTab === "general"
                  ? "border-brand-green text-brand-green"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("general")}
            >
              General Settings
            </button>
            <button
              className={`mr-4 py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm ${
                activeTab === "users"
                  ? "border-brand-green text-brand-green"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("users")}
            >
              User Access & Permissions
            </button>
            <button
              className={`mr-4 py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm ${
                activeTab === "removeUsers"
                  ? "border-brand-green text-brand-green"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("removeUsers")}
            >
              Remove Admin Users
            </button>
            <button
              className={`mr-4 py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm ${
                activeTab === "assignRoles"
                  ? "border-brand-green text-brand-green"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("assignRoles")}
            >
              Assign roles and privileges
            </button>
            <button
              className={`mr-4 py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm ${
                activeTab === "payment"
                  ? "border-brand-green text-brand-green"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("payment")}
            >
              Payment & Subscription Settings
            </button>
            <button
              className={`mr-4 py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm ${
                activeTab === "ai"
                  ? "border-brand-green text-brand-green"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("ai")}
            >
              AI Configuration
            </button>
            <button
              className={`mr-4 py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm ${
                activeTab === "notifications"
                  ? "border-brand-green text-brand-green"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("notifications")}
            >
              Notifications & Alerts
            </button>
            <button
              className={`mr-4 py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm ${
                activeTab === "community"
                  ? "border-brand-green text-brand-green"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("community")}
            >
              Community & Moderation Settings
            </button>
            <button
              className={`mr-4 py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm ${
                activeTab === "legal"
                  ? "border-brand-green text-brand-green"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("legal")}
            >
              Legal / Policy Uploads
            </button>
            <button
              className={`mr-4 py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm ${
                activeTab === "backup"
                  ? "border-brand-green text-brand-green"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("backup")}
            >
              Backup & Data Tools
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* General Settings */}
          {activeTab === "general" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    General Settings
                  </h3>
                  <p className="text-sm text-gray-600">
                    Configure the platform's basic settings.
                  </p>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400 cursor-pointer"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Platform Name / Branding
                  </label>
                  <input
                    type="text"
                    name="platformName"
                    value={generalSettings.platformName}
                    onChange={handleGeneralSettingsChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Timezone / Date Format
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="timezone"
                      value={generalSettings.timezone}
                      onChange={handleGeneralSettingsChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-green"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Default Language
                  </label>
                  <div className="relative">
                    <select
                      name="defaultLanguage"
                      value={generalSettings.defaultLanguage}
                      onChange={handleGeneralSettingsChange}
                      className="w-full appearance-none border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-green"
                    >
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
                      <option value="Chinese">Chinese</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Support Email
                  </label>
                  <input
                    type="email"
                    name="supportEmail"
                    value={generalSettings.supportEmail}
                    onChange={handleGeneralSettingsChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-md font-medium text-gray-800">
                    Site Maintenance Mode
                  </h4>
                  <p className="text-sm text-gray-600">
                    Enable this to temporarily take the site offline for
                    maintenance
                  </p>
                </div>
                <ToggleSwitch
                  isOn={toggleStates.siteMaintenance}
                  onToggle={() => handleToggle("siteMaintenance")}
                />
              </div>

              <div className="flex justify-end">
                <Button
                  variant="contained"
                  color="brand"
                  onClick={handleSaveGeneralSettings}
                >
                  Save
                </Button>
              </div>
            </div>
          )}

          {/* User Access & Permissions */}
          {activeTab === "users" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    User Access & Permissions
                  </h3>
                  <p className="text-sm text-gray-600">
                    Manage admin roles and access rights.
                  </p>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400 cursor-pointer"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Admin Roles
                  </label>
                  <label className="block text-sm font-medium text-gray-700">
                    Access Logs
                  </label>
                </div>
                <div className="flex justify-between">
                  <div className="relative w-1/2 mr-4">
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="w-full appearance-none border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-green"
                    >
                      <option>Admin</option>
                      <option>Moderator</option>
                      <option>Editor</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <Button
                    variant="outlined"
                    color="brand"
                    size="small"
                    className="bg-gray-100 text-brand-green border-gray-200"
                  >
                    View Logs
                  </Button>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-md font-medium text-gray-800">
                    Add Admin Users
                  </h4>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400 cursor-pointer"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter full name"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      placeholder="Enter username"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="enter email address"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Role
                    </label>
                    <div className="relative">
                      <select className="w-full appearance-none border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-green">
                        <option value="">Select Role</option>
                        <option value="Admin">Admin</option>
                        <option value="Moderator">Moderator</option>
                        <option value="Editor">Editor</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-xs text-gray-500 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter password"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green"
                  />
                </div>

                <div className="flex justify-between items-center">
                  <button className="text-brand-green hover:underline text-sm">
                    See all users
                  </button>
                  <Button
                    variant="contained"
                    color="brand"
                    className="flex items-center"
                  >
                    Add user
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Button>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button
                  variant="contained"
                  color="brand"
                  onClick={handleSaveUserAccessSettings}
                >
                  Save
                </Button>
              </div>
            </div>
          )}

          {/* Remove Admin Users */}
          {activeTab === "removeUsers" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Remove Admin Users
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">All Users</p>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400 cursor-pointer"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              <div className="mb-4">
                <div className="relative">
                  <select
                    value={userToRemove}
                    onChange={(e) => setUserToRemove(e.target.value)}
                    className="w-full appearance-none border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-green"
                  >
                    <option value="">Select User</option>
                    <option value="John Doe">John Doe</option>
                    <option value="Jane Smith">Jane Smith</option>
                    <option value="Alex Johnson">Alex Johnson</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  variant="contained"
                  color="default"
                  className="bg-red-500 text-white hover:bg-red-600"
                  onClick={handleRemoveUser}
                >
                  Remove user
                </Button>
              </div>
            </div>
          )}

          {/* Assign Roles and Privileges */}
          {activeTab === "assignRoles" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Assign roles and privileges
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">All Users</p>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400 cursor-pointer"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              <div className="flex justify-between mb-4">
                <div className="w-1/2 pr-2">
                  <label className="block text-xs text-gray-500 mb-1">
                    Select User
                  </label>
                  <div className="relative">
                    <select
                      value={selectedUser}
                      onChange={(e) => setSelectedUser(e.target.value)}
                      className="w-full appearance-none border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-green"
                    >
                      <option value="">Select User</option>
                      <option value="John Doe">John Doe</option>
                      <option value="Jane Smith">Jane Smith</option>
                      <option value="Alex Johnson">Alex Johnson</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="w-1/2 pl-2">
                  <label className="block text-xs text-gray-500 mb-1">
                    Select Role
                  </label>
                  <div className="relative">
                    <select
                      value={selectedRoleForAssign}
                      onChange={(e) => setSelectedRoleForAssign(e.target.value)}
                      className="w-full appearance-none border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-green"
                    >
                      <option value="">Select Role</option>
                      <option value="Admin">Admin</option>
                      <option value="Moderator">Moderator</option>
                      <option value="Editor">Editor</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mb-6">
                <Button
                  variant="contained"
                  color="brand"
                  onClick={handleAssignRole}
                >
                  Assign role
                </Button>
              </div>

              <div className="flex justify-end mt-6">
                <Button variant="contained" color="brand">
                  Save
                </Button>
              </div>
            </div>
          )}

          {/* Payment & Subscription Settings */}
          {activeTab === "payment" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Payment & Subscription Settings
                  </h3>
                  <p className="text-sm text-gray-600">
                    Manage payment gateways and subscription plans.
                  </p>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400 cursor-pointer"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stripe/PayPal API Keys
                  </label>
                  <input
                    type="text"
                    name="stripeAPIKey"
                    value={paymentSettings.stripeAPIKey}
                    onChange={handlePaymentSettingsChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Premium Monthly
                  </label>
                  <input
                    type="text"
                    name="premiumMonthly"
                    value={paymentSettings.premiumMonthly}
                    onChange={handlePaymentSettingsChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Premium Annually
                  </label>
                  <input
                    type="text"
                    name="premiumAnnually"
                    value={paymentSettings.premiumAnnually}
                    onChange={handlePaymentSettingsChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    5 Remedies Price
                  </label>
                  <input
                    type="text"
                    name="fiveRemediesPrice"
                    value={paymentSettings.fiveRemediesPrice}
                    onChange={handlePaymentSettingsChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    10 Remedies Price
                  </label>
                  <input
                    type="text"
                    name="tenRemediesPrice"
                    value={paymentSettings.tenRemediesPrice}
                    onChange={handlePaymentSettingsChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Free Trial Period
                    </label>
                  </div>
                  <ToggleSwitch
                    isOn={toggleStates.freeTrial}
                    onToggle={() => handleToggle("freeTrial")}
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Refund & Cancellation Policy
                </label>
                <textarea
                  name="refundPolicy"
                  value={paymentSettings.refundPolicy}
                  onChange={handlePaymentSettingsChange}
                  placeholder="Enter..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green"
                  rows={5}
                ></textarea>
              </div>

              <div className="flex justify-end">
                <Button
                  variant="contained"
                  color="brand"
                  onClick={handleSavePaymentSettings}
                >
                  Save
                </Button>
              </div>
            </div>
          )}

          {/* AI Configuration */}
          {activeTab === "ai" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    AI Configuration
                  </h3>
                  <p className="text-sm text-gray-600">
                    Control AI-powered remedy generation settings.
                  </p>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400 cursor-pointer"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-md font-medium text-gray-800">
                    Enable AI Remedy Generation
                  </h4>
                </div>
                <ToggleSwitch
                  isOn={aiSettings.enableAI}
                  onToggle={() =>
                    setAiSettings({
                      ...aiSettings,
                      enableAI: !aiSettings.enableAI,
                    })
                  }
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confidence Threshold
                </label>
                <div className="w-full">
                  <div className="flex items-center">
                    <span className="mr-2">Low</span>
                    <div className="flex-grow bg-gray-200 h-2 rounded-full relative">
                      <div
                        className="bg-brand-green h-2 rounded-full"
                        style={{ width: `${aiSettings.confidenceThreshold}%` }}
                      ></div>
                    </div>
                    <span className="ml-2">High</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>50%</span>
                    <span>75%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  AI Usage Logs
                </label>
                <Button
                  variant="outlined"
                  color="default"
                  className="bg-gray-100 text-brand-green border-gray-200"
                >
                  Refresh Logs
                </Button>
              </div>

              <div className="flex justify-end">
                <Button
                  variant="contained"
                  color="brand"
                  onClick={handleSaveAISettings}
                >
                  Save
                </Button>
              </div>
            </div>
          )}

          {/* Notifications & Alerts */}
          {activeTab === "notifications" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Notifications & Alerts
                  </h3>
                  <p className="text-sm text-gray-600">
                    Set up notifications for admins and users.
                  </p>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400 cursor-pointer"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Welcome email template
                </label>
                <textarea
                  name="welcomeEmailTemplate"
                  value={notificationSettings.welcomeEmailTemplate}
                  onChange={handleNotificationSettingsChange}
                  placeholder="Welcome Email..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green"
                  rows={4}
                ></textarea>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subscription email template
                </label>
                <textarea
                  name="subscriptionEmailTemplate"
                  value={notificationSettings.subscriptionEmailTemplate}
                  onChange={handleNotificationSettingsChange}
                  placeholder="Subscription Email..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green"
                  rows={4}
                ></textarea>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reminder email template
                </label>
                <textarea
                  name="reminderEmailTemplate"
                  value={notificationSettings.reminderEmailTemplate}
                  onChange={handleNotificationSettingsChange}
                  placeholder="Reminder Email..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green"
                  rows={4}
                ></textarea>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Admin Alert Preferences
                  </label>
                  <label className="block text-sm font-medium text-gray-700">
                    Slack/Email Webhook
                  </label>
                </div>

                <div className="flex mb-2">
                  <div className="flex items-center space-x-2 mr-6">
                    <input
                      type="checkbox"
                      id="flaggedContent"
                      checked={notificationSettings.flaggedContent}
                      onChange={() =>
                        setNotificationSettings({
                          ...notificationSettings,
                          flaggedContent: !notificationSettings.flaggedContent,
                        })
                      }
                      className="h-4 w-4 text-brand-green border-gray-300 rounded focus:ring-brand-green"
                    />
                    <label
                      htmlFor="flaggedContent"
                      className="text-sm text-gray-700"
                    >
                      Flagged Content
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="failedPayments"
                      checked={notificationSettings.failedPayments}
                      onChange={() =>
                        setNotificationSettings({
                          ...notificationSettings,
                          failedPayments: !notificationSettings.failedPayments,
                        })
                      }
                      className="h-4 w-4 text-brand-green border-gray-300 rounded focus:ring-brand-green"
                    />
                    <label
                      htmlFor="failedPayments"
                      className="text-sm text-gray-700"
                    >
                      Failed Payments
                    </label>
                  </div>
                </div>

                <input
                  type="text"
                  placeholder="https://hooks.slack.com/"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
              </div>

              <div className="flex justify-end">
                <Button
                  variant="contained"
                  color="brand"
                  onClick={handleSaveNotificationSettings}
                >
                  Save
                </Button>
              </div>
            </div>
          )}

          {/* Community & Moderation Settings */}
          {activeTab === "community" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Community & Moderation Settings
                  </h3>
                  <p className="text-sm text-gray-600">
                    Manage community interactions and content moderation.
                  </p>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400 cursor-pointer"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Flag Threshold to Auto-Hide Content
                  </label>
                  <input
                    type="number"
                    name="flagThreshold"
                    value={communitySettings.flagThreshold}
                    onChange={handleCommunitySettingsChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Comment visibility per user type
                  </label>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">All Users</span>
                    <ToggleSwitch
                      isOn={toggleStates.visibilityAllUsers}
                      onToggle={() => handleToggle("visibilityAllUsers")}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Default Moderation Filters
                  </label>
                  <div className="flex space-x-6 mt-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="profanity"
                        checked={communitySettings.profanityFilter}
                        onChange={() =>
                          setCommunitySettings({
                            ...communitySettings,
                            profanityFilter: !communitySettings.profanityFilter,
                          })
                        }
                        className="h-4 w-4 text-brand-green border-gray-300 rounded focus:ring-brand-green"
                      />
                      <label
                        htmlFor="profanity"
                        className="text-sm text-gray-700"
                      >
                        Profanity
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="spam"
                        checked={communitySettings.spamFilter}
                        onChange={() =>
                          setCommunitySettings({
                            ...communitySettings,
                            spamFilter: !communitySettings.spamFilter,
                          })
                        }
                        className="h-4 w-4 text-brand-green border-gray-300 rounded focus:ring-brand-green"
                      />
                      <label htmlFor="spam" className="text-sm text-gray-700">
                        Spam
                      </label>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Keyword Block List
                  </label>
                  <input
                    type="text"
                    name="keywordBlockList"
                    value={communitySettings.keywordBlockList}
                    onChange={handleCommunitySettingsChange}
                    placeholder="Add keywords comma-separated"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  variant="contained"
                  color="brand"
                  onClick={handleSaveCommunitySettings}
                >
                  Save
                </Button>
              </div>
            </div>
          )}

          {/* Legal / Policy Uploads */}
          {activeTab === "legal" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Legal / Policy Uploads
                  </h3>
                  <p className="text-sm text-gray-600">
                    Upload or update legal documents.
                  </p>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400 cursor-pointer"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Terms & Conditions
                  </label>
                  <div className="flex items-center mt-2">
                    <input
                      type="file"
                      id="termsFile"
                      onChange={(e) =>
                        handleFileUpload(e, "Terms & Conditions")
                      }
                      className="hidden"
                    />
                    <label
                      htmlFor="termsFile"
                      className="cursor-pointer flex-grow border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green bg-white text-gray-700"
                    >
                      Upload new version
                    </label>
                    <button className="ml-2 text-gray-500">
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
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Privacy Policy
                  </label>
                  <div className="flex items-center mt-2">
                    <input
                      type="file"
                      id="privacyFile"
                      onChange={(e) => handleFileUpload(e, "Privacy Policy")}
                      className="hidden"
                    />
                    <label
                      htmlFor="privacyFile"
                      className="cursor-pointer flex-grow border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green bg-white text-gray-700"
                    >
                      Upload new version
                    </label>
                    <button className="ml-2 text-gray-500">
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
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Refund Policy
                </label>
                <div className="flex items-center mt-2">
                  <input
                    type="file"
                    id="refundFile"
                    onChange={(e) => handleFileUpload(e, "Refund Policy")}
                    className="hidden"
                  />
                  <label
                    htmlFor="refundFile"
                    className="cursor-pointer flex-grow border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green bg-white text-gray-700"
                  >
                    Upload new version
                  </label>
                  <button className="ml-2 text-gray-500">
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
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <Button variant="contained" color="brand">
                  Save
                </Button>
              </div>
            </div>
          )}

          {/* Backup & Data Tools */}
          {activeTab === "backup" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Backup & Data Tools
                  </h3>
                  <p className="text-sm text-gray-600">
                    Export data and manage backups.
                  </p>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400 cursor-pointer"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Export User Data
                  </label>
                  <Button
                    variant="outlined"
                    color="default"
                    className="bg-gray-100 text-brand-green border-gray-200"
                  >
                    Export as CSV
                  </Button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Export Remedies Database
                  </label>
                  <Button
                    variant="outlined"
                    color="default"
                    className="bg-gray-100 text-brand-green border-gray-200"
                  >
                    Export as CSV
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Manual Backup Trigger
                  </label>
                  <Button
                    variant="outlined"
                    color="default"
                    className="bg-gray-100 text-brand-green border-gray-200"
                  >
                    Trigger Backup
                  </Button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    View Storage Usage
                  </label>
                  <p className="text-sm mt-2">Current Usage: 2.5GB / 10GB</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminSettingsPage;

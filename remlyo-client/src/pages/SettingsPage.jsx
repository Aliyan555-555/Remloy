// src/pages/SettingsPage.jsx
import React, { useState } from "react";
import Button from "../components/common/Button";
import { useAuth } from "../contexts/AuthContext";
import DashboardLayout from "../components/layout/DashboardLayout";
import useUserPlan from "../hooks/useUserPlan";

const SettingsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("notification");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState("");
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);

  const { plan, isPremium } = useUserPlan();

  // Handler functions
  const handleExportDataClick = () => {
    setShowExportModal(true);
  };

  const handleConfirmExport = () => {
    alert("Export Data request initiated");
    setShowExportModal(false);
  };

  const handleDeleteAccountClick = () => {
    setShowDeleteAccountModal(true);
  };

  const handleConfirmDeleteAccount = () => {
    // Logic to handle account deletion
    if (confirmEmail) {
      alert("Verification email sent to " + confirmEmail);
      setShowDeleteAccountModal(false);
      setConfirmEmail("");
    }
  };

  const handleDeactivateClick = () => {
    setShowDeactivateModal(true);
  };

  // Toggle switches
  const [settings, setSettings] = useState({
    // Email notifications
    emailNewRemedies: true,
    emailSubscription: true,

    // Push notifications
    pushAiRecommendations: true,
    pushRemedyUpdates: true,
    pushCommunityMentions: true,

    // SMS notifications
    smsNewRemedies: false,
    smsSubscription: false,
    smsAiRecommendations: false,
    smsRemedyUpdates: false,
    smsCommunityMentions: false,

    // Privacy settings
    receivePersonalized: true,
    allowAnonymousData: true,

    // Master toggle
    turnAllOff: false,
  });

  const handleToggle = (setting) => {
    setSettings({
      ...settings,
      [setting]: !settings[setting],
    });
  };

  // Handle master toggle (Turn All)
  const handleTurnAllToggleClick = () => {
    if (!settings.turnAllOff) {
      // If turning off all notifications, show confirmation modal
      setShowConfirmModal(true);
    } else {
      // If turning on all notifications, no confirmation needed
      applyTurnAll(false);
    }
  };

  const handleConfirmTurnOff = () => {
    applyTurnAll(true);
    setShowConfirmModal(false);
  };

  const applyTurnAll = (turnOff) => {
    // Create a new settings object with all notification settings set to the new value
    const newSettings = { ...settings };
    Object.keys(newSettings).forEach((key) => {
      // Only update notification settings, not privacy settings
      if (key !== "receivePersonalized" && key !== "allowAnonymousData") {
        newSettings[key] = !turnOff;
      }
    });
    newSettings.turnAllOff = turnOff;

    setSettings(newSettings);
  };

  // Toggle component
  const ToggleSwitch = ({ isOn, onToggle }) => {
    return (
      <div
        className={`relative w-12 h-6 rounded-full cursor-pointer transition-colors ${
          isOn ? "bg-brand-green" : "bg-gray-300"
        }`}
        onClick={onToggle}
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
    <DashboardLayout 
      pageTitle="Settings" 
      user={user}
      isPremiumUser={isPremium}
    >
      {/* Settings Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex space-x-4">
          <Button
            variant={activeTab === "notification" ? "contained" : "text"}
            color="brand"
            onClick={() => setActiveTab("notification")}
          >
            Notification Settings
          </Button>
          <Button
            variant={activeTab === "privacy" ? "contained" : "text"}
            color="brand"
            onClick={() => setActiveTab("privacy")}
          >
            Privacy Settings
          </Button>
        </div>
      </div>

      {/* Notification Settings Content */}
      {activeTab === "notification" && (
        <div>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-bold text-gray-800">
                Notification settings
              </h2>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-3">Turn All</span>
                <ToggleSwitch
                  isOn={!settings.turnAllOff}
                  onToggle={handleTurnAllToggleClick}
                />
              </div>
            </div>
            <p className="text-gray-600">
              Here you can adjust your notification settings seamlessly
            </p>
          </div>

          {/* Email Notifications */}
          <div className="mb-10">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Email Notifications
            </h3>
            <p className="text-gray-600 mb-4">
              Get emails to find out what's going on when you're not online.
              You can turn these off.
            </p>

            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <h4 className="font-medium text-gray-800">
                    New Remedy Recommendations
                  </h4>
                  <p className="text-sm text-gray-600">
                    Receive email alerts for new remedies matching your
                    interests
                  </p>
                </div>
                <ToggleSwitch
                  isOn={settings.emailNewRemedies}
                  onToggle={() => handleToggle("emailNewRemedies")}
                />
              </div>

              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <h4 className="font-medium text-gray-800">
                    Subscription Updates
                  </h4>
                  <p className="text-sm text-gray-600">
                    Get notified about subscription changes
                  </p>
                </div>
                <ToggleSwitch
                  isOn={settings.emailSubscription}
                  onToggle={() => handleToggle("emailSubscription")}
                />
              </div>
            </div>
          </div>

          {/* Push Notifications */}
          <div className="mb-10">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Push Notifications
            </h3>
            <p className="text-gray-600 mb-4">
              Get real-time alerts for important updates, even when you're
              not actively using Remlyo.
            </p>

            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <h4 className="font-medium text-gray-800">
                    AI Recommendations
                    {isPremium && (
                      <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                        Premium
                      </span>
                    )}
                  </h4>
                  <p className="text-sm text-gray-600">
                    Get notified when new AI-generated suggestions are
                    available
                  </p>
                </div>
                <ToggleSwitch
                  isOn={settings.pushAiRecommendations}
                  onToggle={() => handleToggle("pushAiRecommendations")}
                />
              </div>

              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <h4 className="font-medium text-gray-800">
                    Remedy Updates
                  </h4>
                  <p className="text-sm text-gray-600">
                    Stay updated with the latest remedy changes
                  </p>
                </div>
                <ToggleSwitch
                  isOn={settings.pushRemedyUpdates}
                  onToggle={() => handleToggle("pushRemedyUpdates")}
                />
              </div>

              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <h4 className="font-medium text-gray-800">
                    Community Mentions
                  </h4>
                  <p className="text-sm text-gray-600">
                    Get notified when someone mentions you
                  </p>
                </div>
                <ToggleSwitch
                  isOn={settings.pushCommunityMentions}
                  onToggle={() => handleToggle("pushCommunityMentions")}
                />
              </div>
            </div>
          </div>

          {/* SMS Notifications */}
          <div className="mb-10">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              SMS Notifications
            </h3>
            <p className="text-gray-600 mb-4">
              Get important updates by text message. You can disable SMS
              notifications at any time.
            </p>

            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <h4 className="font-medium text-gray-800">
                    New Remedy Recommendations
                  </h4>
                  <p className="text-sm text-gray-600">
                    Discover tailored solutions for your health concerns
                  </p>
                </div>
                <ToggleSwitch
                  isOn={settings.smsNewRemedies}
                  onToggle={() => handleToggle("smsNewRemedies")}
                />
              </div>

              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <h4 className="font-medium text-gray-800">
                    Subscription Updates
                  </h4>
                  <p className="text-sm text-gray-600">
                    Stay informed about changes to your subscriptions
                  </p>
                </div>
                <ToggleSwitch
                  isOn={settings.smsSubscription}
                  onToggle={() => handleToggle("smsSubscription")}
                />
              </div>

              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <h4 className="font-medium text-gray-800">
                    AI Recommendations
                  </h4>
                  <p className="text-sm text-gray-600">
                    Receive smart tips curated just for you
                  </p>
                </div>
                <ToggleSwitch
                  isOn={settings.smsAiRecommendations}
                  onToggle={() => handleToggle("smsAiRecommendations")}
                />
              </div>

              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <h4 className="font-medium text-gray-800">
                    Remedy Updates
                  </h4>
                  <p className="text-sm text-gray-600">
                    Keep track of the latest adjustments to your remedies
                  </p>
                </div>
                <ToggleSwitch
                  isOn={settings.smsRemedyUpdates}
                  onToggle={() => handleToggle("smsRemedyUpdates")}
                />
              </div>

              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <h4 className="font-medium text-gray-800">
                    Community Mentions
                  </h4>
                  <p className="text-sm text-gray-600">
                    Get notified when someone mentions you in the community
                  </p>
                </div>
                <ToggleSwitch
                  isOn={settings.smsCommunityMentions}
                  onToggle={() => handleToggle("smsCommunityMentions")}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Settings Content */}
      {activeTab === "privacy" && (
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Privacy Settings
            </h2>
            <p className="text-gray-600">
              Here you can adjust your privacy settings seamlessly
            </p>
          </div>

          {/* Data Sharing Preferences */}
          <div className="mb-10">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Data Sharing Preferences
            </h3>
            <p className="text-gray-600 mb-4">
              Control data usage for AI, anonymity, and personalization.
            </p>

            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <h4 className="font-medium text-gray-800">
                    Receive personalized recommendations
                  </h4>
                  <p className="text-sm text-gray-600">
                    Your data will be used in an aggregated form for AI
                    recommendations
                  </p>
                </div>
                <ToggleSwitch
                  isOn={settings.receivePersonalized}
                  onToggle={() => handleToggle("receivePersonalized")}
                />
              </div>

              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <h4 className="font-medium text-gray-800">
                    Allow anonymous data collection
                  </h4>
                  <p className="text-sm text-gray-600">
                    Help us improve by sharing anonymized usage data
                  </p>
                </div>
                <ToggleSwitch
                  isOn={settings.allowAnonymousData}
                  onToggle={() => handleToggle("allowAnonymousData")}
                />
              </div>
            </div>
          </div>

          {/* Account Management Section */}
          <div className="mb-10">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Account Management
            </h3>
            <p className="text-gray-600 mb-4">
              Control your data with options to export your data or delete
              your account.
            </p>

            <div className="space-y-6">
              {/* Export Data Section */}
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <h4 className="font-medium text-gray-800">
                    Export your data
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Request a copy of you account data
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Download saved remedies, account info, and AI
                    activity.
                  </p>
                </div>
                <Button
                  variant="outlined"
                  color="brand"
                  size="small"
                  onClick={handleExportDataClick}
                >
                  Export Data
                </Button>
              </div>

              {/* Deactivate Account Section */}
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <h4 className="font-medium text-gray-800">
                    Deactivate Account{" "}
                    <span className="text-sm text-gray-500">
                      (Recommended Option)
                    </span>
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    This hides your profile & data from public view while
                    preserving your history.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    You can reactivate anytime by logging in.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Your AI-generated insights will remain available and
                    continue to improve over time.
                  </p>
                </div>
                <Button
                  variant="outlined"
                  color="default"
                  size="small"
                  className="text-blue-500 border-blue-500 hover:bg-blue-50"
                  onClick={handleDeactivateClick}
                >
                  Deactivate Account
                </Button>
              </div>

              {/* Permanently Delete Account Section */}
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <h4 className="font-medium text-gray-800">
                    Permanently Delete Account{" "}
                    <span className="text-sm text-gray-500">
                      (GDPR-Compliant)
                    </span>
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    This will erase all personal data from our systems
                    after 30 days.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    You will lose access to saved remedies, AI insights,
                    and account history.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Anonymized, non-identifiable data may be retained for
                    AI research.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Before deletion, you can download your data.
                  </p>
                </div>
                <Button
                  variant="outlined"
                  color="default"
                  size="small"
                  className="text-red-500 border-red-500 hover:bg-red-50"
                  onClick={handleDeleteAccountClick}
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Data Confirmation Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 overflow-hidden">
            <div className="flex justify-end p-4">
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowExportModal(false)}
              >
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
              </button>
            </div>

            <div className="px-6 pb-6 text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Export your Data
              </h3>
              <p className="text-gray-600 mb-8">
                Request a copy of your account data. Download saved remedies,
                account info, and AI activity. This file will be sent to your
                registered email address.
              </p>

              <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-3">
                <Button
                  variant="outlined"
                  color="default"
                  onClick={() => setShowExportModal(false)}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="brand"
                  onClick={handleConfirmExport}
                  className="w-full sm:w-auto"
                >
                  Confirm Export
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Turn All Notifications Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 overflow-hidden">
            <div className="flex justify-end p-4">
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowConfirmModal(false)}
              >
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
              </button>
            </div>

            <div className="px-6 pb-6 text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Disable All Notifications?
              </h3>
              <p className="text-gray-600 mb-8">
                Turning this off will disable all Email, Push, and SMS
                notifications. Are you sure?
              </p>

              <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-3">
                <Button
                  variant="outlined"
                  color="default"
                  onClick={() => setShowConfirmModal(false)}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="brand"
                  onClick={handleConfirmTurnOff}
                  className="w-full sm:w-auto"
                >
                  Turn off
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Account Deletion Confirmation Modal */}
      {showDeleteAccountModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 overflow-hidden">
            <div className="flex justify-end p-4">
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowDeleteAccountModal(false)}
              >
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
              </button>
            </div>

            <div className="px-6 pb-6 text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Are you sure you want to permanently delete your account?
              </h3>
              <p className="text-gray-600 mb-8">
                This action is irreversible and will remove all your data after
                30 days. Before proceeding, we recommend downloading your data
                using the "Export Data" option. Confirm your request by entering
                your email below to receive a verification email to complete the
                process.
              </p>

              <div className="mb-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-green"
                  value={confirmEmail}
                  onChange={(e) => setConfirmEmail(e.target.value)}
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-3">
                <Button
                  variant="outlined"
                  color="default"
                  onClick={() => setShowDeleteAccountModal(false)}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="brand"
                  onClick={handleConfirmDeleteAccount}
                  className="w-full sm:w-auto"
                >
                  Verify Email
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deactivate Account Modal */}
      {showDeactivateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 overflow-hidden">
            <div className="flex justify-end p-4">
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowDeactivateModal(false)}
              >
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
              </button>
            </div>

            <div className="px-6 pb-6 text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Deactivate Account
              </h3>
              <p className="text-gray-600 mb-8">
                Hide your profile and data from public view while keeping your
                account intact. You can reactivate anytime by logging in. Your
                AI-generated insights will remain available.
              </p>

              <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-3">
                <Button
                  variant="outlined"
                  color="default"
                  onClick={() => setShowDeactivateModal(false)}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="brand"
                  onClick={() => {
                    alert("Account deactivated successfully");
                    setShowDeactivateModal(false);
                  }}
                  className="w-full sm:w-auto"
                >
                  Deactivate Account
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default SettingsPage;
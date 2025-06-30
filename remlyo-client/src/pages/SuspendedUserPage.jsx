import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import Button from "./../components/common/Button";

const SuspendedUserPage = () => {
  const { user } = useAuth();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-lg w-full text-center">
        <h1 className="text-3xl font-semibold text-red-600 mb-3">
          Account Suspended
        </h1>
        <p className="text-gray-700 mb-5">
          Your access to the platform has been temporarily restricted due to a
          policy violation or concern.
        </p>

        {user?.suspendedMessage && (
          <div className="bg-red-50 border border-red-300 text-red-700 p-4 rounded mb-6 text-left">
            <strong>Reason:</strong> <span>{user.suspendedMessage}</span>
          </div>
        )}

        <p className="text-sm text-gray-500 mb-6">
          If you believe this is a mistake or want to appeal, please contact
          support.
        </p>

        <Button to={'/'} >Return to home</Button>
      </div>
    </div>
  );
};

export default SuspendedUserPage;

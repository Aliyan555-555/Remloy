import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const VerifyEmailPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { verifyEmailToken, isAuthenticated } = useAuth();

  const [status, setStatus] = useState("loading"); // 'loading' | 'success' | 'error'

  useEffect(() => {
    let isMounted = true;

    const verifyEmail = async () => {
      try {
        const result = await verifyEmailToken(token);
        if (!isMounted) return;

        if (result && result.success) {
          setStatus("success");

          setTimeout(() => {
            navigate(result.redirect || "/health-profile", { replace: true });
          }, 1500);
        } else {
          setStatus("error");
        }
      } catch (err) {
        if (isMounted) setStatus("error");
      }
    };

    verifyEmail();

    return () => {
      isMounted = false;
    };
  }, [token]);

  if (isAuthenticated) {
    return <Navigate to="/health-profile" replace />;
  }

  const renderContent = () => {
    switch (status) {
      case "loading":
        return (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#1E4D2B] mb-4"></div>
            <p className="text-gray-600 text-sm">
              Verifying your email, please wait...
            </p>
          </div>
        );
      case "success":
        return (
          <div className="max-w-xl text-center animate-fade-in">
            <h1 className="text-2xl font-semibold text-[#1E4D2B]">
              Email Verified
            </h1>
            <p className="mt-4 text-gray-700">
              Your email has been successfully verified. Redirecting to your
              account...
            </p>
          </div>
        );
      case "error":
        return (
          <div className="max-w-xl text-center animate-fade-in">
            <h1 className="text-2xl font-semibold text-[#1E4D2B]">
              Verification Failed
            </h1>
            <p className="mt-4 text-gray-700">
              We couldn’t verify your email. This might be due to:
            </p>
            <ul className="mt-3 text-sm text-gray-600 list-disc list-inside">
              <li>The link has expired.</li>
              <li>The link is invalid or already used.</li>
            </ul>
            <p className="mt-4 text-gray-600">
              Please try registering again or contact support.
            </p>
            <button
              onClick={() => navigate("/signin")}
              className="mt-6 px-6 py-2 bg-[#1E4D2B] text-white rounded-md hover:bg-[#2d6a3f] transition-all"
            >
              Back to Login
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center px-6 py-12">
      {renderContent()}
    </div>
  );
};

export default VerifyEmailPage;

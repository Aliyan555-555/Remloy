import React, { useEffect, useState } from "react";
import { sendEmailVerification } from "../api/authApi";
import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

const SendEmailVerificationPage = () => {
  const [loading, setLoading] = useState(true);
  const [resendLoading, setResendLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState(null);
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const email = localStorage.getItem("signupEmail");
  useEffect(() => {
    if (!authLoading) {
      sendEmailVerification(setLoading, setError, email);
    }
  }, []);

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    } else {
      setResendLoading(false);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const resendEmail = async () => {
    if (resendLoading || cooldown > 0) return;
    if (!user.email) {
      setError("Email not found");
      return;
    }

    setResendLoading(true);
    setError(null); // Clear any previous error

    // Wrap sendEmailVerification in a promise so we can await it
    try {
      await sendEmailVerification(
        () => {},
        (err) => {
          if (err) {
            setError(err);
            setResendLoading(false); // stop loading on error
            return;
          }
          // ✅ Only start cooldown if no error
          setCooldown(60);
        },
        user.email
      );
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setResendLoading(false);
    }
  };

  //  useEffect(() =>{
  if (!authLoading && isAuthenticated && user.emailVerified) {
    console.log("redirecting../dashboard");
    return (
      <Navigate
        to={user.accessLevel == "user" ? "/dashboard" : "/admin/dashboard"}
      />
    );
  }

  //  })
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col items-center justify-center px-6 py-12">
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-green"></div>
        </div>
      ) : (
        <div className="max-w-xl text-center mt-12">
          {error && (
            <p className="text-center text-red-600 text-sm mb-4">{error}</p>
          )}
          <h1 className="text-3xl font-semibold text-[#1E4D2B]">
            Verify Your Email
          </h1>
          <p className="mt-4 text-gray-700">
            We've sent a verification link to your email. Please check your
            inbox and click the link to activate your account.
          </p>
          <p className="mt-2 text-gray-600 flex text-sm gap-2 justify-center">
            Didn't receive it? Check your spam folder or{" "}
            <span
              onClick={resendEmail}
              className={`text-[#1E4D2B] underline cursor-pointer`}
            >
              {resendLoading || cooldown > 0 ? (
                <span className="flex items-center gap-1">
                  {cooldown > 0 && <span>{cooldown}s</span>}
                </span>
              ) : (
                "resend the email"
              )}
            </span>
            .
          </p>
        </div>
      )}
    </div>
  );
};

export default SendEmailVerificationPage;

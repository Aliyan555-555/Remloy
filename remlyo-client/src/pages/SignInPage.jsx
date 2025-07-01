// src/pages/SignInPage.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Button from "../components/common/Button";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import {
  AppleAuthProvider,
  auth,
  FacebookProvider,
  GoogleProvider,
} from "../config/firebase";
import { useUserFlow } from "../contexts/UserFlowContext";

const SignInPage = () => {
  const navigate = useNavigate();
  const { login, socialAuth } = useAuth();
  const { checkUserFlow } = useUserFlow();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
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
    try {
      await login(formData, setError);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSocialSignIn = async (provider) => {
    try {
      const res = await signInWithPopup(auth, provider);
      await socialAuth(res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* AI Banner */}
      <div className="bg-brand-green text-white py-2 text-center">
        <div className="container mx-auto px-4">
          <span>🌿 AI-Powered Remedy Recommendations Available!</span>
        </div>
      </div>

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main
        className="flex-grow flex items-center justify-center"
        style={{
          background: "linear-gradient(to right, #2F6A50 50%, #EEF1F8 50%)",
        }}
      >
        <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-5xl w-full flex my-12">
          {/* Left side - Herbs Image */}
          <div className="w-1/2 bg-[#ddbea9] hidden md:block">
            <div className="h-full w-full relative overflow-hidden">
              <img
                src="/images/herbs-bottles.jpg"
                alt="Natural remedies"
                className="h-full w-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <img
                  src="/images/Remlyo Logo.png"
                  alt="Remlyo Logo"
                  className="h-10 text-brand-green"
                />
              </div>
            </div>
          </div>

          {/* Right side - Sign In Form */}
          <div className="w-full md:w-1/2 p-8 md:p-12">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-gray-800">Sign In</h1>
              <p className="text-gray-600 mt-2">
                Sign in to access your personalized remedies and health insights
              </p>
            </div>

            {/* Social Sign-in Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Button
                variant="outlined"
                color="default"
                onClick={() => handleSocialSignIn(GoogleProvider)}
                fullWidth
                className="flex items-center justify-center"
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"
                    fill="#4285F4"
                  />
                </svg>
                Google
              </Button>

              <Button
                variant="outlined"
                color="default"
                onClick={() => handleSocialSignIn(AppleAuthProvider)}
                fullWidth
                className="flex items-center justify-center"
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z"
                    fill="#000"
                  />
                </svg>
                Apple
              </Button>

              <Button
                variant="outlined"
                color="default"
                onClick={() => handleSocialSignIn(FacebookProvider)}
                fullWidth
                className="flex items-center justify-center"
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                    fill="#1877F2"
                  />
                </svg>
                Facebook
              </Button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center mb-6">
              <div className="border-t border-gray-300 w-full"></div>
              <div className="bg-white px-4 text-nowrap text-sm text-gray-500">
                Or sign in with email
              </div>
              <div className="border-t border-gray-300 w-full"></div>
            </div>
            {error && (
              <p className="text-red-600 text-sm text-center mb-3">{error}</p>
            )}

            {/* Email Sign-in Form */}
            <form onSubmit={handleSubmit}>
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

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 text-brand-green focus:ring-brand-green border-gray-300 rounded"
                  />
                  <label
                    htmlFor="rememberMe"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="text-gray-500 hover:text-brand-green">
                    forgot password?
                  </a>
                </div>
              </div>

              <Button
                variant="contained"
                color="brand"
                type="submit"
                fullWidth
                className="py-3"
              >
                Sign In
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                New User?
                <Link
                  to="/signup"
                  className="ml-1 text-brand-green font-medium hover:underline"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default SignInPage;

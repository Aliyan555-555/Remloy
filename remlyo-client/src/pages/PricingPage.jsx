// Updated src/pages/PricingPage.jsx with checkout links
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Button from "../components/common/Button";
import { getAllPlans } from "../api/pricingApi";
import { useAuth } from "../contexts/AuthContext";
import { preprepareForSubscription } from "../api/subscriptionApi";

const PricingPage = () => {
  const [billingPeriod, setBillingPeriod] = useState("monthly");
  const navigate = useNavigate();
  const [isFreePlanUsed, setIsFreePlanUsed] = useState(false);
  const [plans, setPlans] = useState([]);
  const { authToken } = useAuth();
  const [loading, setLoading] = useState(null);
  //  const { authToken } = useAuth();
  const fetchPlans = async () => {
    const res = await getAllPlans(authToken);

    if (res.success) {
      setPlans(res.plans);
      setIsFreePlanUsed(res.user.isFreePlanUsed);
    }
  };

  // Handle subscription purchase
  const handleSubscribe = async (id) => {
    try {
      setLoading(id);
      await preprepareForSubscription(authToken, id);
    } finally {
      setLoading(false);
    }
  };

  // Toggle between billing periods
  const handleBillingPeriodChange = (period) => {
    setBillingPeriod(period);
  };

  // Plans content based on billing period
  const getPlanContent = () => {
    if (billingPeriod === "monthly") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans
            .filter((p) => p.type == "monthly")
            .map((p) => (
              <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                {p.isPopular && (
                  <div className="bg-brand-green text-white text-center py-1 font-medium text-sm uppercase">
                    POPULAR
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-1">
                    {p.name}
                  </h2>
                  <div className="flex items-baseline mb-6">
                    <span className="text-3xl font-bold text-gray-900">
                      ${p.price}
                    </span>
                    <span className="text-gray-600 ml-1">/month</span>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {p.features.map((feature) => (
                      <li className="flex items-start">
                        <svg
                          className="h-5 w-5 text-brand-green mt-0.5 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="ml-3 text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant="contained"
                    color="brand"
                    className="disabled:bg-gray-500 "
                    fullWidth
                    disabled={p.originalPrice == 0 && isFreePlanUsed}
                    onClick={() => handleSubscribe(p._id)}
                  >
                    {p._id === loading
                      ? "Loading..."
                      : p.originalPrice === 0 && isFreePlanUsed
                      ? "Already Used"
                      : "Subscribe Now"}
                  </Button>
                </div>
              </div>
            ))}
        </div>
      );
    } else if (billingPeriod === "annually") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans
            .filter((p) => p.type == "yearly")
            .map((p) => (
              <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                {p.isPopular && (
                  <div className="bg-brand-green text-white text-center py-1 font-medium text-sm uppercase">
                    POPULAR
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-1">
                    {p.name}
                  </h2>
                  <div className="flex items-baseline mb-6">
                    <span className="text-3xl font-bold text-gray-900">
                      ${p.price}
                    </span>
                    <span className="text-gray-600 ml-1">/year</span>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {p.features.map((feature) => (
                      <li className="flex items-start">
                        <svg
                          className="h-5 w-5 text-brand-green mt-0.5 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="ml-3 text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant="contained"
                    color="brand"
                    fullWidth
                    onClick={() => handleSubscribe("premium")}
                  >
                    Subscribe Now
                  </Button>
                </div>
              </div>
            ))}
        </div>
      );
    } else if (billingPeriod === "payPerRemedy") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans
            .filter((p) => p.type == "one-time")
            .map((p) => (
              <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                {p.isPopular && (
                  <div className="bg-brand-green text-white text-center py-1 font-medium text-sm uppercase">
                    POPULAR
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-1">
                    {p.name}
                  </h2>
                  <div className="flex items-baseline mb-6">
                    <span className="text-3xl font-bold text-gray-900">
                      ${p.price}
                    </span>
                    <span className="text-gray-600 ml-1">
                      /Top {p.remediesPerAilment} remedies
                    </span>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {p.features.map((feature) => (
                      <li className="flex items-start">
                        <svg
                          className="h-5 w-5 text-brand-green mt-0.5 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="ml-3 text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant="contained"
                    color="brand"
                    fullWidth
                    onClick={() => handleSubscribe("premium")}
                  >
                    Subscribe Now
                  </Button>
                </div>
              </div>
            ))}
        </div>
      );
    }
  };

  // FAQ data
  const faqs = [
    {
      question: "What's included in the free plan?",
      answer: "Access to basic remedies and community features",
    },
    {
      question: "What happens when I cancel my plan?",
      answer:
        "Your access to premium features will end, but you can revert to the free plan features. Saved data may be retained based on your account settings.",
    },
    {
      question: "Can I access AI insights on the free plan?",
      answer: "No, AI insights are only available with the premium plan.",
    },
    {
      question: "How does billing work for annual subscriptions?",
      answer:
        "Annual subscriptions are charged upfront for the full year, with automatic renewal unless cancelled.",
    },
    {
      question: "What is the refund policy?",
      answer:
        "Refunds are available within 30 days of purchase, subject to review by our support team. View our full refund policy page for complete details.",
    },
  ];

  useEffect(() => {
    fetchPlans();
  }, []);

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
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-2">
            Choose Your Plan
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Get access to AI-powered remedies and exclusive features
          </p>

          {/* Billing Period Selector */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex bg-gray-200 rounded-full p-1 shadow-sm">
              {/* Monthly button */}
              <Button
                variant={billingPeriod === "monthly" ? "contained" : "outlined"}
                color="brand"
                onClick={() => handleBillingPeriodChange("monthly")}
                className="rounded-full"
              >
                Monthly
              </Button>

              {/* Annually button */}
              <Button
                variant={
                  billingPeriod === "annually" ? "contained" : "outlined"
                }
                color="brand"
                onClick={() => handleBillingPeriodChange("annually")}
                className="rounded-full"
              >
                Annually
              </Button>

              {/* Pay Per Remedy button */}
              <Button
                variant={
                  billingPeriod === "payPerRemedy" ? "contained" : "outlined"
                }
                color="brand"
                onClick={() => handleBillingPeriodChange("payPerRemedy")}
                className="rounded-full"
              >
                Pay Per Remedy
              </Button>
            </div>
          </div>

          {/* Pricing Plans based on selected billing period */}
          {getPlanContent()}

          {/* FAQs Section */}
          <div className="max-w-4xl mx-auto mt-20">
            <h2 className="text-2xl font-bold text-center mb-8">
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900">
                      {faq.question}
                    </h3>
                    <p className="mt-2 text-gray-600">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link
                to="/refund-policy"
                className="text-brand-green hover:underline"
              >
                View our full Refund & Cancellation Policy
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PricingPage;

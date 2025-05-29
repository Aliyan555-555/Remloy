// src/pages/HelpPage.jsx
import React, { useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import SearchBar from "../components/common/SearchBar";
import Button from "../components/common/Button";

const HelpPage = () => {
  const [activeQuestion, setActiveQuestion] = useState(null);

  const toggleQuestion = (index) => {
    if (activeQuestion === index) {
      setActiveQuestion(null);
    } else {
      setActiveQuestion(index);
    }
  };

  const faqItems = [
    {
      category: "Account & Subscription",
      question: "How do I manage my plan?",
      answer: "You can manage your subscription plan by logging into your account and navigating to 'Account Settings'. From there, select the 'Subscription' tab to view, modify, or cancel your current plan."
    },
    {
      category: "AI Remedies",
      question: "How are AI-generated remedies created?",
      answer: "Our AI analyzes thousands of natural remedies from traditional healing practices, scientific research, and user feedback. It then personalizes recommendations based on your specific health profile, preferences, and reported symptoms."
    },
    {
      category: "Refund Policy",
      question: "Can I get a refund for pay-per-remedy purchases?",
      answer: "Yes, we offer refunds for remedy purchases within 14 days if you're not satisfied with the results. Please contact our customer support team with your order details to process the refund."
    },
    {
      category: "Data & Privacy",
      question: "How does Remlyo protect my data?",
      answer: "We use industry-standard encryption and security practices to protect your personal data. We never share your health information with third parties without your explicit consent. For more details, please see our Privacy Policy."
    },
    {
      category: "Customer Support",
      question: "How can I contact customer support?",
      answer: "You can reach our customer support team through the 'Contact Support' button at the bottom of this page, or by emailing support@remlyo.com. Our team is available Monday through Friday, 9 AM to 6 PM EST."
    },
    {
      category: "Features",
      question: "What features does Remlyo offer?",
      answer: "Remlyo offers AI-powered personalized natural remedy recommendations, a comprehensive remedy library, symptom tracking, remedy effectiveness ratings, saved favorites, and premium features for subscribers including unlimited remedy access and personalized health reports."
    },
    {
      category: "Payments",
      question: "payment issues.",
      answer: "If you're experiencing payment issues, please ensure your payment method is up to date in your account settings. For declined payments, check with your bank for any restrictions. For any other payment problems, please contact our support team for assistance."
    }
  ];

  const handleSearch = (query) => {
    console.log("Searching for:", query);
    // Implement search functionality here
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
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          {/* Help Center Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-700 mb-2">Help Center</h1>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">How Can We Help You?</h2>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <SearchBar 
                onSearch={handleSearch} 
                className="mb-4"
                placeholder="Search common topics like refunds, remedy access, subscriptions..."
              />
            </div>
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Frequently Asked Questions (FAQ)</h2>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {faqItems.map((item, index) => (
                <div key={index} className="border-b border-gray-200 last:border-b-0">
                  <button
                    onClick={() => toggleQuestion(index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between focus:outline-none"
                  >
                    <div>
                      <span className="text-brand-green mr-2">◆</span>
                      <span className="font-medium">{item.category} – </span>
                      <span>"{item.question}"</span>
                    </div>
                    <svg
                      className={`h-5 w-5 text-gray-500 transform transition-transform ${activeQuestion === index ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {activeQuestion === index && (
                    <div className="px-6 py-4 bg-gray-50">
                      <p className="text-gray-700">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Still Need Help Section */}
          <div className="bg-brand-green rounded-lg text-white p-8 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0 md:mr-8">
                <h2 className="text-3xl font-bold mb-4">Still need help?</h2>
                <p className="mb-6">
                  Didn't find what you were looking for?<br />
                  Reach out and we'll get back to you shortly.
                </p>
                <Button 
                  variant="outlined" 
                  color="default" 
                  className="border-white text-white hover:bg-white hover:bg-opacity-20"
                >
                  Contact Support
                </Button>
              </div>
              <div className="flex-shrink-0">
                <img 
                  src="/images/help-illustration.png" 
                  alt="Support illustration" 
                  className="h-40"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/180x160?text=Support";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HelpPage;
// src/pages/AIInsightPage.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Button from "../components/common/Button";

const AIInsightPage = () => {
  const { remedyId } = useParams();
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch AI insight details
  useEffect(() => {
    const fetchAIInsight = async () => {
      setLoading(true);
      // Simulating API call
      setTimeout(() => {
        // Mock data for demonstration
        const mockInsight = {
          id: remedyId,
          title: "Advanced AI Insight: Personalized Migraine Analysis",
          subtitle: "Unlock deeper insights into your migraine remedy with AI-driven analysis tailored to your unique profile.",
          healthMatch: {
            score: 93,
            reasons: "This remedy was selected based on a 93% match with your health profile.",
            profileData: [
              { label: "Age", value: "35-40 years", icon: "calendar" },
              { label: "Diet", value: "High processed food intake", icon: "food" },
              { label: "Chronic Stress", value: "High", icon: "stress" },
              { label: "Low Sleep", value: "5-6 hours nightly", icon: "sleep" },
              { label: "Previous Remedy Success", value: "Low with pharmaceutical remedies", icon: "history" }
            ]
          },
          confidenceRating: {
            score: 95,
            users: 7412,
            description: "Based on 7,412 users with similar profiles"
          },
          selectionReasons: [
            "You recently reported symptoms related to throbbing pain and light sensitivity.",
            "You have not responded well to pharmaceutical remedies, so AI suggested a different approach with this herbal blend."
          ],
          userOutcomes: {
            title: "Similar User Outcomes",
            description: "Users with a similar profile saw improvements in :",
            outcomes: [
              { metric: "83% reported better sleep", icon: "sleep" },
              { metric: "72% reduction in stress symptoms", icon: "stress" },
              { metric: "65% reported less nerve inflammation", icon: "inflammation" }
            ]
          },
          learningLog: [
            "This remedy's score was recently updated based on 892 new ratings in March.",
            "AI learned that the remedy is more effective for people over 40 with low vitamin D levels."
          ],
          adjustmentNotice: "Your AI remedy may continue to evolve as your health data and feedback improve.",
          disclaimer: "This information is not a medical diagnosis. Always consult a healthcare provider."
        };

        setInsight(mockInsight);
        setLoading(false);
      }, 500);
    };

    fetchAIInsight();
  }, [remedyId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="bg-brand-green text-white py-2 text-center">
          <div className="container mx-auto px-4">
            <span>🌿 AI-Powered Remedy Recommendations Available!</span>
          </div>
        </div>
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-green"></div>
        </div>
        <Footer />
      </div>
    );
  }

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
          {/* Back Button */}
          <div className="mb-6">
            <Button
              variant="outlined"
              color="brand"
              size="small"
              to={`/remedies/${remedyId}`}
              className="flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Remedies
            </Button>
          </div>

          {/* Insight Title and Description */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{insight.title}</h1>
            <p className="text-gray-600 max-w-3xl mx-auto">
              {insight.subtitle}
            </p>
          </div>

          {/* Personal Health Match Score */}
          <div className="bg-white border border-green-100 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-brand-green mb-3">Personal Health Match Score</h2>
            <p className="text-gray-700 mb-4">{insight.healthMatch.reasons}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {insight.healthMatch.profileData.map((item, index) => (
                <div key={index} className="flex items-start">
                  {item.icon === "calendar" && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-green mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}
                  {item.icon === "food" && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-green mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  )}
                  {item.icon === "stress" && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-green mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  )}
                  {item.icon === "sleep" && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-green mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                  {item.icon === "history" && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-green mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  <div>
                    <span className="font-medium text-gray-700">{item.label}: </span>
                    <span className="text-gray-600">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Confidence Rating */}
          <div className="bg-white border border-blue-100 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-blue-600 mb-3">AI Confidence Rating</h2>
            <div className="mb-4 flex items-center">
              <div className="text-3xl font-bold text-blue-600 mr-3">{insight.confidenceRating.score}% Confidence</div>
              <div className="text-gray-600 text-sm">{insight.confidenceRating.description}</div>
            </div>
            
            {/* Confidence Bar */}
            <div className="w-full bg-gray-200 rounded-full h-4 mb-1">
              <div 
                className="bg-blue-600 h-4 rounded-full" 
                style={{ width: `${insight.confidenceRating.score}%` }}
              ></div>
            </div>
          </div>

          {/* Why This Was Selected */}
          <div className="bg-white border border-yellow-100 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-yellow-600 mb-3">Why This Was Selected</h2>
            <ul className="space-y-3">
              {insight.selectionReasons.map((reason, index) => (
                <li key={index} className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Similar User Outcomes */}
          <div className="bg-white border border-indigo-100 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-indigo-600 mb-3">{insight.userOutcomes.title}</h2>
            <p className="text-gray-700 mb-4">{insight.userOutcomes.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {insight.userOutcomes.outcomes.map((outcome, index) => (
                <div key={index} className="bg-indigo-50 rounded-lg p-4 flex items-start">
                  {outcome.icon === "sleep" && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                  {outcome.icon === "stress" && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  )}
                  {outcome.icon === "inflammation" && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  )}
                  <span className="text-gray-700">{outcome.metric}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Learning Log */}
          <div className="bg-white border border-purple-100 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-purple-600 mb-3">AI Learning Log</h2>
            <ul className="space-y-3">
              {insight.learningLog.map((entry, index) => (
                <li key={index} className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-gray-700">{entry}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Remedy Adjustment Notice */}
          <div className="bg-white border border-green-100 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-green-600 mb-3">Remedy Adjustment Notice</h2>
            <div className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-gray-700">{insight.adjustmentNotice}</span>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  {insight.disclaimer}
                </p>
              </div>
            </div>
          </div>

          {/* Get Custom Remedy Button */}
          <div className="text-center mb-8">
            <Button 
              variant="contained" 
              color="brand"
              size="large"
              className="group"
            >
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Generate Custom Remedy
              </span>
            </Button>
            <p className="text-gray-600 text-sm mt-2">
              Create a new personalized remedy based on your latest profile data
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AIInsightPage;
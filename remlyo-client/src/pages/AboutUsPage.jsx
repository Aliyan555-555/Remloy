// src/pages/AboutUsPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const AboutUsPage = () => {
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
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold text-center mb-10">About Us</h1>
          
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">About Remlyo</h2>
            <p className="text-gray-700 mb-4">
              At Remlyo, we believe in the power of nature, technology, and collective wisdom to transform health and 
              well-being. Our mission is to provide personalized, AI-driven natural remedies backed by both traditional 
              healing practices and modern scientific insights.
            </p>
            
            <p className="text-gray-700 mb-4">
              On Remlyo, you'll find a carefully curated selection of remedies, including:
            </p>
            
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li><strong>Community Remedies</strong> - Shared by real users based on personal success stories.</li>
              <li><strong>Alternative Remedies</strong> - Time-tested natural therapies like acupuncture, herbal medicine, and aromatherapy.</li>
              <li><strong>AI-Generated Remedies</strong> - Data-driven recommendations optimized for effectiveness.</li>
              <li><strong>Pharmaceutical Remedies</strong> - Evidence-based medical treatments sourced from trusted references.</li>
            </ul>
          </section>
          
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-700 mb-4">
              We empower individuals to take control of their health by offering customized and accessible natural 
              treatments. By blending centuries of healing traditions with cutting-edge AI technology, Remlyo ensures 
              that everyone has access to remedies that work for their unique needs.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-4">What Makes Remlyo Different?</h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3 text-brand-green">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Personalized Health Solutions</h3>
                  <p className="text-gray-700">AI analyzes your health profile to recommend remedies tailored just for you.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3 text-brand-green">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">A Global Community</h3>
                  <p className="text-gray-700">Learn from real experiences and contribute to collective healing wisdom.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3 text-brand-green">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Data-Backed Insights</h3>
                  <p className="text-gray-700">AI and success rate tracking help identify the most effective treatments.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3 text-brand-green">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Empowerment Through Knowledge</h3>
                  <p className="text-gray-700">We bridge the gap between traditional wisdom and modern science, making holistic healing more accessible than ever.</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
      </div>
  );
};

export default AboutUsPage;
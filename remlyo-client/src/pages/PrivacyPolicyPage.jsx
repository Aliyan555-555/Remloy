// src/pages/PrivacyPolicyPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const PrivacyPolicyPage = () => {
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
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold text-center mb-8">Privacy Policy</h1>
          
          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
              <p>
                At Remlyo, we are committed to protecting your privacy and ensuring compliance with applicable data protection
                laws, while simultaneously protecting your online rights. This Privacy Policy explains how we collect, use,
                and safeguard your data, and your rights regarding data access, deletion, and retention.
              </p>
              <p className="mt-2">
                By using Remlyo, you agree to the terms outlined in this policy.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-2">2. Information We Collect</h2>
              <p>We may collect the following types of data when you interact with our platform:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Account information: Name, email address, and other info provided during registration.</li>
                <li>Health data: Health conditions, symptoms, treatments tried, and treatment outcomes.</li>
                <li>Usage data: Browsing behavior, feature interactions, and content preferences used to generate AI-driven remedy recommendations.</li>
                <li>Transaction data: Payment details and subscription history (processed securely via third-party payment processors).</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-2">3. How We Use Your Information</h2>
              <p>We use your information to:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Provide and improve core platform functionality.</li>
                <li>Personalize your remedy recommendations.</li>
                <li>Communicate with you regarding updates, support, and service improvements.</li>
                <li>Process payments and manage subscriptions.</li>
                <li>Ensure compliance with legal and security requirements.</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-2">4. Sharing Your Information</h2>
              <p>Remlyo may (but will not) share your personal information with third parties, except in the following cases:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Legal Requirements: When required by law or to protect our legal rights.</li>
                <li>Service Providers: With trusted partners (e.g., payment processors, cloud hosting) necessary for platform operation.</li>
                <li>Anonymized Data: Aggregated, non-identifiable insights may be used for AI learning, research, and service improvement.</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-2">5. Data Security</h2>
              <p>
                We implement appropriate technical and security measures to protect your personal data from unauthorized
                access, alteration, or disclosure. However, no online service is entirely risk-free, and users should take
                personal precautions as well.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-2">6. Account Retention & Inactivity Policy</h2>
              <p>
                We retain personal account information for active users until data deletion is explicitly requested. Remlyo retains all registered accounts, including inactive ones.
              </p>
              
              <h3 className="text-lg font-medium mt-4 mb-1">6.1 Inactive Accounts & Dormant Status</h3>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>After 12 months of no account activity, accounts may be flagged as Dormant.</li>
                <li>Dormant accounts are not deleted but may receive fewer notifications and updates.</li>
                <li>Dormant accounts can be reactivated at any time without restrictions.</li>
              </ul>
              
              <h3 className="text-lg font-medium mt-4 mb-1">6.2 Account Deactivation (Recommended Option)</h3>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Users can temporarily suspend their accounts without permanent deletion.</li>
                <li>All personal data remains private but hidden from public access.</li>
                <li>Users can reactivate their account at any time without losing past activity.</li>
              </ul>
              
              <h3 className="text-lg font-medium mt-4 mb-1">7. Permanent Account Deletion (GDPR Compliant)</h3>
              <p>
                We honor users' "Right to be Forgotten" under GDPR, allowing users to request full deletion of their account and associated data.
              </p>
              
              <h3 className="text-lg font-medium mt-4 mb-1">7.1 Account Deletion Request</h3>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Users can request permanent deletion of their account at any time.</li>
                <li>This request initiates a 30-day processing period to allow users to change their mind.</li>
                <li>After 30 days, all personal identifiable information and account data will be permanently deleted.</li>
                <li>Anonymized or pseudonymized data may, namely success rates may be retained for AI learning and research.</li>
              </ul>
              
              <h3 className="text-lg font-medium mt-4 mb-1">7.2 Data Export Before Deletion</h3>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Users can export a copy of their account data before deletion.</li>
                <li>The export includes remedy interactions, saved remedies, ratings, and AI-generated insights.</li>
              </ul>
              
              <h3 className="text-lg font-medium mt-4 mb-1">7.3 Anonymized Data Retention (Allowed Under GDPR)</h3>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Following account deletion, certain data may be retained in aggregated data for research & AI learning.</li>
                <li>Example: If a user gives a remedy a rating, their personal details are deleted, but the rating remains in an anonymized format used for recommendations.</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-2">8. Your Data Rights</h2>
              <p>As a user, you have the right to:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Access all personal data held on our platform.</li>
                <li>Request correction or deletion of your personal information.</li>
                <li>Withdraw consent for processing activities where consent is the lawful basis for processing functionality.</li>
                <li>Opt out of marketing communications at any time.</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-2">9. Changes to Privacy Policy</h2>
              <p>
                We may update this policy periodically. Any changes will be posted on this page, and continued use of
                Remlyo constitutes acceptance of the updated policy.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-2">10. Contact Us</h2>
              <p>
                For any privacy-related questions or to request data deletion/export, please contact us at: contact@remlyo.com
              </p>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
      </div>
  );
};

export default PrivacyPolicyPage;
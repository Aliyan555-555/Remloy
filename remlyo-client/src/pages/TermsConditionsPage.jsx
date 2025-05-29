// src/pages/TermsConditionsPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const TermsConditionsPage = () => {
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
          <h1 className="text-3xl font-bold text-center mb-8">Terms & Conditions</h1>
          
          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
              <p>
                Welcome to Remlyo! By accessing and using our platform, you agree to comply with and be bound by the
                following Terms and Conditions. If you do not agree with any part of these terms, please refrain from using
                our services. By continuing to use Remlyo after changes to these Terms are posted, you acknowledge that you
                have read, understand, and accepted these Terms.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-2">2. User Accounts</h2>
              <ol className="list-lower-alpha pl-6 space-y-1">
                <li>All users must create an account with accurate and current information.</li>
                <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                <li>You must be at least 18 years old (or the legal age of majority in your jurisdiction) to register.</li>
                <li>One person may only maintain one active account at a time.</li>
                <li>Remlyo reserves the right to suspend or terminate accounts that violate these Terms.</li>
              </ol>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-2">3. Use of the Platform</h2>
              <p>You agree that when using our platform that you will NOT:</p>
              <ol className="list-lower-alpha pl-6 space-y-1">
                <li>Post, upload, or share any unlawful, harmful, offensive, misleading, or defamatory content.</li>
                <li>Impersonate any person or entity or misrepresent your affiliation.</li>
                <li>Attempt to hack, modify, or disrupt the platform's security or integrity.</li>
                <li>Use automatic or programmatic methods to scrape, extract, or collect data from Remlyo.</li>
              </ol>
              <p className="mt-2">Violations may result in account suspension or legal action.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-2">4. Content Disclaimer</h2>
              <ol className="list-lower-alpha pl-6 space-y-1">
                <li>Information on Remlyo is provided "as is" for general informational and educational purposes only.</li>
                <li>Remlyo does not guarantee the safety, completeness, or effectiveness of any remedy.</li>
                <li>Do not use Remlyo as a personal advice substitute. Consult a qualified healthcare professional before starting any new treatment.</li>
                <li>Remlyo is not liable for any health outcomes resulting from the use of information on this platform.</li>
              </ol>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-2">5. Intellectual Property Rights</h2>
              <ol className="list-lower-alpha pl-6 space-y-1">
                <li>All content, logos, trademarks, and designs on Remlyo are either owned by us or licensed to us.</li>
                <li>You may not copy, distribute, or create derivative works from our materials without permission.</li>
                <li>Unauthorized use of our content may lead to legal action.</li>
              </ol>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-2">6. Limitation of Liability</h2>
              <ol className="list-lower-alpha pl-6 space-y-1">
                <li>Remlyo is not responsible for direct, indirect, incidental, or consequential damages resulting from your use of our services.</li>
                <li>We do not guarantee that our service will be error-free, uninterrupted, or secure.</li>
                <li>Your use of Remlyo is at your own risk.</li>
              </ol>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-2">7. Third-Party Content & External Links</h2>
              <ol className="list-lower-alpha pl-6 space-y-1">
                <li>Remlyo may contain links to third-party websites, products, or services.</li>
                <li>We do not assume or accept responsibility for third-party content.</li>
                <li>Your interactions with third-party services are solely between you and the third party.</li>
              </ol>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-2">8. Payment, Subscriptions & Refunds</h2>
              <ol className="list-lower-alpha pl-6 space-y-1">
                <li>Users may subscribe to monthly, annual, or pay-per-remedy plans.</li>
                <li>All payment information is processed securely through third-party providers.</li>
                <li>All subscription fees are billed upfront and are non-refundable.</li>
                <li>Auto-renewal will be applied unless cancelled.</li>
                <li>No refunds will be issued once a subscription or one-time payment has been processed.</li>
                <li>Exceptions may be made at our discretion in cases of fraudulent or unauthorized charges.</li>
              </ol>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-2">9. Account Termination & Inactivity Policy</h2>
              <p>Remlyo reserves the right to terminate or suspend your account if:</p>
              <ol className="list-lower-alpha pl-6 space-y-1">
                <li>You violate these Terms.</li>
                <li>You engage in fraudulent or harmful activities.</li>
                <li>Your account remains inactive for an extended period (refer to Privacy Policy for details).</li>
              </ol>
              <p className="mt-2">See our Privacy Policy for details on account retention and deletion.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-2">10. Changes to Terms & Conditions</h2>
              <ol className="list-lower-alpha pl-6 space-y-1">
                <li>Remlyo may update these Terms periodically.</li>
                <li>Continued use of Remlyo after changes are posted means you accept the updated Terms.</li>
                <li>The latest version of these Terms will always be available on our website.</li>
              </ol>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-2">11. Governing Law & Dispute Resolution</h2>
              <ol className="list-lower-alpha pl-6 space-y-1">
                <li>These Terms shall be governed by and construed in accordance with [Your Country/State].</li>
                <li>Any disputes shall first be resolved through good-faith negotiations.</li>
                <li>If unresolved, disputes will be handled through arbitration in [Your Jurisdiction].</li>
              </ol>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-2">12. Contact Us</h2>
              <p>
                For any questions regarding these Terms & Conditions, please contact us at <a href="mailto:contact@remlyo.com" className="text-brand-green hover:underline">contact@remlyo.com</a>
              </p>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
      </div>
  );
};

export default TermsConditionsPage;
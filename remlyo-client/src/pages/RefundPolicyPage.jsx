// src/pages/RefundPolicyPage.jsx
import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const RefundPolicyPage = () => {
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
          <h1 className="text-3xl font-bold mb-6">Refund & Cancellation Policy</h1>
          
          <div className="bg-white rounded-lg shadow-sm p-8">
            <p className="mb-6">
              At Remlyo, we value transparency and fairness in all user transactions. Please review our refund and
              cancellation terms below.
            </p>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Monthly Subscriptions</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>You may cancel your subscription at any time through your account settings.</li>
                <li>Cancellations take effect at the end of the current billing cycle - you will retain access until that time.</li>
                <li>Refunds are not available once a monthly billing period has started, regardless of usage.</li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Annual Subscriptions</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>You may cancel your annual subscription at any time.</li>
                <li>Upon cancellation, a pro-rated refund will be issued for any unused full months remaining in your subscription.</li>
                <li>Refunds are issued to the original payment method and may take 5–7 business days to process.</li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">One-Time Payments (Pay-Per-Remedy)</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Due to the nature of digital content, all one-time purchases are final and non-refundable once remedy access has been granted.</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-3">Need Help?</h2>
              <p>
                If you have any issues related to billing, cancellation, or your subscription, please contact us at{' '}
                <a href="mailto:support@remlyo.com" className="text-brand-green hover:underline">support@remlyo.com</a> or through our{' '}
                <a href="/contact" className="text-brand-green hover:underline">Contact Page</a>.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RefundPolicyPage;
// src/components/checkout/CheckoutPage.jsx
import React, { useState } from 'react';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import Button from '../common/Button';

const CheckoutPage = () => {
  const { planType } = useParams(); // 'premium' or 'remedy'
  const navigate = useNavigate();
  
  // State for form fields
  const [email, setEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [country, setCountry] = useState('United States of America');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [saveInfo, setSaveInfo] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' or 'link'

  // Determine plan details based on planType
  const getPlanDetails = () => {
    if (planType === 'premium') {
      return {
        title: 'Subscribe to Remlyo Premium',
        price: '$99.00',
        period: '/year',
        subtitle: 'Save 20% when you pay yearly!'
      };
    } else {
      return {
        title: 'Subscribe to Remlyo Pay per Remedy',
        price: '$4.99',
        period: '/One-Time Remedy Purchase - Top 10 Remedies',
        subtitle: 'Select an ailment to unlock its top remedies, with access to ten remedies via a one-time purchase.'
      };
    }
  };

  const planDetails = getPlanDetails();

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setPaymentProcessing(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setPaymentProcessing(false);
      
      // For demo purposes: 
      // - Show success for premium
      // - Show error for remedy
      if (planType === 'remedy') {
        setPaymentError(true);
      } else {
        setPaymentSuccess(true);
      }
    }, 1500);
  };

  // Handle payment with Link
  const handlePayWithLink = () => {
    setPaymentMethod('link');
    setPaymentProcessing(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setPaymentProcessing(false);
      setPaymentSuccess(true); // Always success for link payments
    }, 1500);
  };

  // Handle payment retry
  const handleRetryPayment = () => {
    setPaymentError(false);
  };

  // Success state
  if (paymentSuccess) {
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

        {/* Payment Success */}
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="text-center max-w-md w-full border border-gray-200 rounded-lg p-8 shadow-sm">
            <div className="w-16 h-16 bg-green-500 rounded-full mx-auto flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Payment Successful</h2>
            <p className="text-gray-600 mb-6">
              {planType === 'premium' 
                ? "You've successfully subscribed to the Premium Plan ($9.99/month)."
                : "You've successfully purchased access to top 10 remedies for your ailment."}
            </p>
            <p className="text-gray-600 mb-6">
              We've emailed your receipt and plan details for your records.
            </p>
            <p className="text-gray-600 mb-6">
              You now have full access to personalized remedies and premium features.
            </p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <Button
                variant="outlined"
                color="brand"
                fullWidth
                onClick={() => navigate('/')}
              >
                Go to Dashboard
              </Button>
              <Button
                variant="contained"
                color="brand"
                fullWidth
                onClick={() => navigate('/remedies')}
              >
                View Remedies
              </Button>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  // Error state
  if (paymentError) {
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

        {/* Payment Error */}
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="text-center max-w-md w-full border border-gray-200 rounded-lg p-8 shadow-sm">
            <div className="w-16 h-16 bg-red-500 rounded-full mx-auto flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Payment Failed</h2>
            <p className="text-gray-600 mb-6">
              Hmm, something went wrong. Please double-check your card info or try a different method.
            </p>
            <Button
              variant="contained"
              color="brand"
              fullWidth
              onClick={handleRetryPayment}
              className="mb-4"
            >
              Retry Payment
            </Button>
            <p className="text-gray-600">
              Need help? <a href="#" className="text-brand-green hover:underline">Contact support</a>
            </p>
          </div>
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
          {/* Back link */}
          <RouterLink to={planType === 'premium' ? '/pricing' : '/ailments'} className="flex items-center mb-6 text-gray-600 hover:text-brand-green">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>{planType === 'premium' ? 'Back to plans' : 'Back'}</span>
          </RouterLink>
          
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">{planDetails.title}</h1>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Column (Order Summary) */}
            <div className="w-full md:w-2/5">
              <div className="border border-gray-200 rounded-lg p-6 bg-white mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
                
                <div className="pb-4 mb-4 border-b border-gray-200">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">{planType === 'premium' ? 'Remlyo Premium' : 'Pay Per Remedy'}</span>
                    <span className="text-gray-900 font-medium">{planDetails.price}</span>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    {planType === 'premium' 
                      ? 'Allows access to unlimited remedies, AI recommendations, success insights, priority support, and personalized features.' 
                      : 'Select an ailment to unlock its top remedies.'}
                  </div>
                </div>
                
                <div className="pb-4 mb-4 border-b border-gray-200">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">Subtotal</span>
                    <span className="text-gray-900 font-medium">{planDetails.price}</span>
                  </div>
                </div>
                
                <div className="flex justify-between font-medium">
                  <span className="text-gray-700">Total due today</span>
                  <span className="text-gray-900">{planDetails.price}</span>
                </div>
              </div>
            </div>
            
            {/* Right Column (Payment Form) */}
            <div className="w-full md:w-3/5">
              {/* Pay with Link button */}
              <Button
                variant="contained"
                color="brand"
                fullWidth
                onClick={handlePayWithLink}
                className="mb-6"
                disabled={paymentProcessing}
              >
                <div className="flex items-center justify-center">
                  Pay with link
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </Button>
              
              {/* Divider */}
              <div className="flex items-center my-6">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink-0 mx-4 text-gray-600">Or pay with card</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              {/* Card Payment Form */}
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="w-full p-3 border border-gray-300 rounded-md"
                    placeholder="example@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={paymentProcessing}
                  />
                </div>
                
                <div className="mb-6">
                  <h2 className="text-lg font-medium text-gray-700 mb-3">Card Information</h2>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-md"
                      placeholder="4545 4545 4545 4545"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      required
                      disabled={paymentProcessing}
                    />
                  </div>
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      className="w-1/2 p-3 border border-gray-300 rounded-md"
                      placeholder="MM / YY"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      required
                      disabled={paymentProcessing}
                    />
                    <input
                      type="text"
                      className="w-1/2 p-3 border border-gray-300 rounded-md"
                      placeholder="CVC"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      required
                      disabled={paymentProcessing}
                    />
                  </div>
                  <div className="flex items-center mt-2 space-x-3">
                    <img src="/images/payment-icons/paypal.png" alt="PayPal" className="h-7" />
                    <img src="/images/payment-icons/visa.png" alt="Visa" className="h-6" />
                    <img src="/images/payment-icons/amazon.png" alt="Amazon Pay" className="h-6" />
                    <img src="/images/payment-icons/gpay.png" alt="Google Pay" className="h-6" />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="nameOnCard" className="block text-sm font-medium text-gray-700 mb-1">Name on card</label>
                  <input
                    type="text"
                    id="nameOnCard"
                    className="w-full p-3 border border-gray-300 rounded-md"
                    value={nameOnCard}
                    onChange={(e) => setNameOnCard(e.target.value)}
                    required
                    disabled={paymentProcessing}
                  />
                </div>
                
                <div className="mb-6">
                  <h2 className="text-lg font-medium text-gray-700 mb-3">Billing Address</h2>
                  <div className="mb-3">
                    <select
                      className="w-full p-3 border border-gray-300 rounded-md"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      disabled={paymentProcessing}
                    >
                      <option value="United States of America">United States of America</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                      <option value="India">India</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-md"
                      placeholder="Address Line 1"
                      value={addressLine1}
                      onChange={(e) => setAddressLine1(e.target.value)}
                      required
                      disabled={paymentProcessing}
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-md"
                      placeholder="Address Line 2"
                      value={addressLine2}
                      onChange={(e) => setAddressLine2(e.target.value)}
                      disabled={paymentProcessing}
                    />
                  </div>
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      className="w-1/2 p-3 border border-gray-300 rounded-md"
                      placeholder="Postal Code"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      required
                      disabled={paymentProcessing}
                    />
                    <input
                      type="text"
                      className="w-1/2 p-3 border border-gray-300 rounded-md"
                      placeholder="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                      disabled={paymentProcessing}
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id="saveInfo"
                        className="h-4 w-4 text-brand-green"
                        checked={saveInfo}
                        onChange={(e) => setSaveInfo(e.target.checked)}
                        disabled={paymentProcessing}
                      />
                      <label htmlFor="saveInfo" className="ml-2 text-gray-700">
                        Securely save my information for 1-click checkout
                      </label>
                    </div>
                    <p className="text-sm text-gray-600">
                      Enter your phone number to create a Link account and pay faster on MC and everywhere Link is accepted.
                    </p>
                    <div className="flex mt-3">
                      <input
                        type="tel"
                        className="w-full p-3 border border-gray-300 rounded-l-md"
                        placeholder="048 123 456"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        disabled={paymentProcessing}
                      />
                      <span className="bg-gray-100 border border-gray-300 border-l-0 rounded-r-md px-4 flex items-center text-gray-500">
                        Optional
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center mb-6">
                  <span className="mr-2">
                    <img src="/images/payment-icons/link.png" alt="Link" className="h-5" />
                  </span>
                  <span className="text-gray-600 font-light mr-1">•</span>
                  <a href="#" className="text-gray-600 underline text-sm">More info</a>
                </div>
                
                <Button
                  variant="contained"
                  color="brand"
                  fullWidth
                  type="submit"
                  disabled={paymentProcessing}
                  className={paymentProcessing ? 'opacity-75 cursor-not-allowed' : ''}
                >
                  {paymentProcessing ? 'Processing...' : 'Complete Purchase'}
                </Button>
                
                <p className="text-sm text-gray-600 mt-4 text-center">
                  By confirming your subscription, you allow MC to charge your card for this payment and future payments in accordance with their terms. You can always cancel your subscription.
                </p>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
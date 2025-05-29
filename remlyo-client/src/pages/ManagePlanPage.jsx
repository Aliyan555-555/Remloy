// src/pages/ManagePlanPage.jsx
import React from "react";
import Button from "../components/common/Button";
import { useAuth } from "../contexts/AuthContext";
import DashboardLayout from "../components/layout/DashboardLayout";

const ManagePlanPage = () => {
  const { user } = useAuth();

  // Mock payment history data
  const paymentHistory = [
    { date: "Jan 15, 2024", type: "Premium", amount: "$ 19.99" },
    { date: "Feb 15, 2024", type: "Premium", amount: "$ 19.99" },
    { date: "Mar 15, 2024", type: "Premium", amount: "$ 19.99" },
    { date: "Apr 15, 2024", type: "Premium", amount: "$ 19.99" },
  ];

  // Mock payment methods
  const paymentMethods = [
    {
      id: 1,
      type: "PayPal",
      number: "**** **** **** 4242",
      expires: "12/25",
      isPrimary: true,
    },
    {
      id: 2,
      type: "Visa",
      number: "**** **** **** 4242",
      expires: "12/25",
      isPrimary: false,
    },
    {
      id: 3,
      type: "Amazon",
      number: "**** **** **** 4242",
      expires: "12/25",
      isPrimary: false,
    },
    {
      id: 4,
      type: "Google Pay",
      number: "**** **** **** 4242",
      expires: "12/25",
      isPrimary: false,
    },
  ];

  return (
    <DashboardLayout 
      pageTitle="Manage Plan & Billing" 
      user={user}
      isPremiumUser={true}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment History Section - Takes 2/3 of space on large screens */}
        <div className="lg:col-span-2">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Payment History
            </h2>
            <p className="text-gray-600 mb-4">
              Manage billing information and view receipt
            </p>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="text-left text-gray-700">
                    <th className="py-3 px-4 font-medium">Date</th>
                    <th className="py-3 px-4 font-medium">Type</th>
                    <th className="py-3 px-4 font-medium">Amount</th>
                    <th className="py-3 px-4 font-medium">Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory.map((payment, index) => (
                    <tr key={index} className="border-t border-gray-200">
                      <td className="py-3 px-4">{payment.date}</td>
                      <td className="py-3 px-4">{payment.type}</td>
                      <td className="py-3 px-4">{payment.amount}</td>
                      <td className="py-3 px-4">
                        <Button
                          variant="outlined"
                          color="default"
                          size="small"
                          className="text-sm"
                        >
                          Download
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4">
              <Button variant="text" color="brand" className="text-sm">
                Load More
              </Button>
            </div>
          </div>

          {/* Payment Method Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Payment Method
            </h2>
            <p className="text-gray-600 mb-4">Your added payment method</p>

            <div className="flex justify-end mb-4">
              <Button
                variant="outlined"
                color="brand"
                className="flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Card
              </Button>
            </div>

            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="border border-gray-200 rounded-lg p-4 flex items-center"
                >
                  <div className="flex-shrink-0 mr-4 w-16 h-12 flex items-center justify-center">
                    {method.type === "PayPal" && (
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/196/196566.png"
                        alt="PayPal"
                        className="h-8"
                      />
                    )}
                    {method.type === "Visa" && (
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/196/196578.png"
                        alt="Visa"
                        className="h-8"
                      />
                    )}
                    {method.type === "Amazon" && (
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/5968/5968217.png"
                        alt="Amazon"
                        className="h-8"
                      />
                    )}
                    {method.type === "Google Pay" && (
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/6124/6124998.png"
                        alt="Google Pay"
                        className="h-8"
                      />
                    )}
                  </div>
                  <div className="flex-grow">
                    <div className="text-gray-700">{method.number}</div>
                    <div className="text-sm text-gray-500">
                      Expires {method.expires}
                    </div>
                    {method.isPrimary && (
                      <div className="mt-1">
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                          Primary Payment Method
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-shrink-0 space-x-2">
                    <Button
                      variant="outlined"
                      color="default"
                      size="small"
                      className="text-sm"
                    >
                      Remove
                    </Button>
                    <Button
                      variant="outlined"
                      color="default"
                      size="small"
                      className="text-sm"
                    >
                      Update
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Current Plan Card - Takes 1/3 of space on large screens */}
        <div className="lg:col-span-1">
          <div className="bg-brand-green text-white rounded-lg p-6">
            <h2 className="text-xl font-bold mb-2">Current Plan</h2>
            <div className="text-3xl font-bold mb-4">Premium</div>
            <p className="mb-1">Next charge: $9.99/month</p>
            <p className="mb-6">on Mar 15, 2025.</p>

            <Button
              variant="outlined"
              color="default"
              className="w-full justify-center bg-transparent border-white text-white hover:bg-white hover:bg-opacity-10 mb-4"
            >
              Manage Plan
            </Button>
          </div>

          <div className="mt-6 border border-gray-200 rounded-lg p-6">
            <Button
              variant="outlined"
              color="default"
              className="w-full justify-center text-red-500 border-red-500 hover:bg-red-50 mb-4"
            >
              Cancel Subscription
            </Button>
            <p className="text-sm text-gray-500 text-center">
              Canceling will stop future charges. Your access will remain
              active until March 15, 2025
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManagePlanPage;
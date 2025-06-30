// src/pages/ManagePlanPage.jsx
import React, { useEffect, useState } from "react";
import Button from "../components/common/Button";
import { useAuth } from "../contexts/AuthContext";
import DashboardLayout from "../components/layout/DashboardLayout";
import {
  getPaymentHistory,
  getPaymentMethods,
  removePaymentMethod,
} from "../api/userApi";
import LoadingSpinner from "../components/common/LoadingSpinner";
import Pagination from "./../components/common/Pagination";
import { formatDate } from "../utils";
import Modal, { ConfirmModal } from "../components/common/Modal";
import FormInput from "../components/form/FormInput";
import FormSelect from "../components/form/FormSelect";
import StripeCardModal from "../components/stripe/StripeCardMode";
import { generateReceipt } from "../api/subscriptionApi";
import useUserPlan from "../hooks/useUserPlan";

const ManagePlanPage = () => {
  const { user, authToken } = useAuth();
  const [paymentHistoryLoading, setPaymentHistoryLoading] = useState(true);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [paymentHistoryCurrentPage, setPaymentHistoryCurrentPage] = useState(1);
  const [paymentHistoryTotalPages, setPaymentHistoryTotalPages] = useState(0);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [paymentMethodLoading, setPaymentMethodLoading] = useState(true);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { isPremium } = useUserPlan();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [removeLoading, setRemoveLoading] = useState(false);

  const fetchHistory = async () => {
    setPaymentHistoryLoading(true);
    try {
      const res = await getPaymentHistory(
        authToken,
        paymentHistoryCurrentPage,
        5
      );
      if (res.success) {
        setPaymentHistory(res.history);
        setPaymentHistoryTotalPages(res.pagination.pages);
      }
    } catch (err) {
      setPaymentHistory([]);
      setPaymentHistoryTotalPages(0);
    } finally {
      setPaymentHistoryLoading(false);
    }
  };

  const fetchPaymentMethods = async () => {
    setPaymentMethodLoading(true);
    try {
      const res = await getPaymentMethods(authToken);
      if (res.success) {
        setPaymentMethods(res.methods);
      }
    } catch (err) {
      setPaymentMethods([]);
    } finally {
      setPaymentMethodLoading(false);
    }
  };

  const handleGenerateReceipt = async (id) => {
    try {
      await generateReceipt(authToken, id);
    } catch (err) {
      alert("Failed to generate receipt.");
    }
  };

  const handleSelect = (id) => {
    setSelectedPaymentMethod(id);
    setIsOpen(true);
  };

  const handleRemovePaymentMethod = async () => {
    setRemoveLoading(true);
    try {
      const res = await removePaymentMethod(authToken, selectedPaymentMethod);
      if (res.success) {
        setPaymentMethods((prev) =>
          prev.filter((m) => m._id !== selectedPaymentMethod)
        );
      }
    } catch (err) {
      alert("Error removing payment method.");
    } finally {
      setRemoveLoading(false);
      setIsOpen(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [paymentHistoryCurrentPage]);
  useEffect(() => {
    fetchPaymentMethods();
  }, []);
  return (
    <DashboardLayout
      pageTitle="Manage Plan & Billing"
      user={user}
      isPremiumUser={isPremium}
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

            {paymentHistoryLoading ? (
              <LoadingSpinner />
            ) : paymentHistory.length ? (
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
                        <td className="py-3 px-4">
                          {formatDate(payment.createdAt)}
                        </td>
                        <td className="py-3 px-4">
                          {payment.subscriptionId.plan.name}
                        </td>
                        <td className="py-3 px-4">{payment.amount}</td>
                        <td className="py-3 px-4">
                          <Button
                            variant="outlined"
                            color="default"
                            onClick={() =>
                              handleGenerateReceipt(payment.subscriptionId._id)
                            }
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
                <Pagination
                  currentPage={paymentHistoryCurrentPage}
                  totalPages={paymentHistoryTotalPages}
                  onPageChange={(page) => setPaymentHistoryCurrentPage(page)}
                />
              </div>
            ) : (
              <div className="text-center my-10 text-gray-800 py-10 border border-gray-300 rounded-lg">
                No history found
              </div>
            )}
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
                onClick={() => setShowAddCardModal(true)}
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
              {paymentMethodLoading ? (
                <LoadingSpinner />
              ) : paymentMethods.length ? (
                paymentMethods.map((method) => (
                  <div
                    key={method._id}
                    className="border border-gray-200 rounded-lg p-4 flex items-center"
                  >
                    <div className="flex-shrink-0 mr-4 w-16 h-12 flex items-center justify-center">
                      {method.provider === "paypal" && (
                        <img
                          src="https://cdn-icons-png.flaticon.com/512/196/196566.png"
                          alt="PayPal"
                          className="h-8"
                        />
                      )}
                      {method.provider === "visa" && (
                        <img
                          src="https://cdn-icons-png.flaticon.com/512/196/196578.png"
                          alt="Visa"
                          className="h-8"
                        />
                      )}
                    </div>
                    <div className="flex-grow">
                      <div className="text-gray-700">
                        **** **** **** {method.lastFourDigits}
                      </div>
                      <div className="text-sm text-gray-500">
                        Expires {formatDate(method.expiryDate)}
                      </div>
                      {method.isDefault && (
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
                        onClick={() => handleSelect(method._id)}
                        disabled={method.isDefault || removeLoading}
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
                ))
              ) : (
                <div className="text-center my-10 text-gray-800 py-10 border border-gray-300 rounded-lg">
                  No payment methods found
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Current Plan Card - Takes 1/3 of space on large screens */}
        <div className="lg:col-span-1">
          <div className="bg-brand-green text-white rounded-lg p-6">
            <h2 className="text-xl font-bold mb-2">Current Plan</h2>
            <div className="text-3xl font-bold mb-4">
              {user?.activeSubscription?.plan?.name || "-"}
            </div>
            <p className="mb-1">
              Next charge: ${user?.activeSubscription?.plan?.price ?? "-"}/
              {user?.activeSubscription?.plan?.type ?? "-"}
            </p>
            <p className="mb-6">
              on{" "}
              {user?.activeSubscription?.createdAt
                ? formatDate(user.activeSubscription.createdAt)
                : "-"}
            </p>

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
              Canceling will stop future charges. Your access will remain active
              until March 15, 2025
            </p>
          </div>
        </div>
      </div>

      <StripeCardModal
        isOpen={showAddCardModal}
        onClose={() => setShowAddCardModal(false)}
        onCardAdded={fetchPaymentMethods}
      />
      <ConfirmModal
        isOpen={isOpen}
        message={"Are you sure you want to delete this card?"}
        onClose={() => setIsOpen(false)}
        onConfirm={handleRemovePaymentMethod}
        cancelText="cancel"
        confirmColor="brand"
        confirmText={removeLoading ? "deleting..." : "delete"}
      />
    </DashboardLayout>
  );
};

export default ManagePlanPage;

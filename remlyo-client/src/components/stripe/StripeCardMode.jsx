import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Modal from "../common/Modal";
import Button from "../common/Button";

const StripeCardModal = ({ isOpen, onClose, onCardAdded }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [billingAddress, setBillingAddress] = useState({
    line1: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
  });
  const [isDefault, setIsDefault] = useState(false);

  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBillingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!stripe || !elements) {
      setError("Stripe not loaded");
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
      billing_details: {
        name: cardholderName,
        address: {
          line1: billingAddress.line1,
          city: billingAddress.city,
          state: billingAddress.state,
          postal_code: billingAddress.postal_code,
          country: billingAddress.country,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // TODO: Send paymentMethod.id and isDefault to your backend to attach to the user
    // await api.attachPaymentMethod(paymentMethod.id, isDefault);

    setLoading(false);
    onCardAdded && onCardAdded();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Card" size="md">
      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-brand-green"
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value)}
            required
            placeholder="Name on card"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Billing Address</label>
          <input
            type="text"
            name="line1"
            className="w-full border border-gray-300 rounded px-3 py-2 mb-2 focus:outline-none focus:ring focus:border-brand-green"
            value={billingAddress.line1}
            onChange={handleBillingChange}
            required
            placeholder="Address line 1"
          />
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              name="city"
              className="w-1/2 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-brand-green"
              value={billingAddress.city}
              onChange={handleBillingChange}
              required
              placeholder="City"
            />
            <input
              type="text"
              name="state"
              className="w-1/2 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-brand-green"
              value={billingAddress.state}
              onChange={handleBillingChange}
              required
              placeholder="State"
            />
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              name="postal_code"
              className="w-1/2 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-brand-green"
              value={billingAddress.postal_code}
              onChange={handleBillingChange}
              required
              placeholder="Postal Code"
            />
            <input
              type="text"
              name="country"
              className="w-1/2 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-brand-green"
              value={billingAddress.country}
              onChange={handleBillingChange}
              required
              placeholder="Country (e.g. US)"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Card Details</label>
          <div className="border border-gray-300 rounded px-3 py-2 bg-white">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#32325d",
                    '::placeholder': { color: "#a0aec0" },
                  },
                  invalid: { color: "#fa755a" },
                },
              }}
            />
          </div>
        </div>
        <div className="flex items-center mt-2 mb-2">
          <input
            type="checkbox"
            id="isDefault"
            checked={isDefault}
            onChange={(e) => setIsDefault(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="isDefault" className="text-sm text-gray-700">Set as default</label>
        </div>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outlined" color="default" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="brand" disabled={loading || !stripe}>
            {loading ? "Adding..." : "Add Card"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default StripeCardModal;
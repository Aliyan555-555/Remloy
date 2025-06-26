import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Modal from "../common/Modal";
import Button from "../common/Button";

const StripeCardModal = ({ isOpen, onClose, onCardAdded }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // TODO: Send paymentMethod.id to your backend to attach to the user
    // await api.attachPaymentMethod(paymentMethod.id);

    setLoading(false);
    onCardAdded && onCardAdded();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Card" size="md">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="mb-4">
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
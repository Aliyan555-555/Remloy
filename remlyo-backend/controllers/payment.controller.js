import stripe from './../config/stripe.config.js';
import PricingPlan from './../models/pricing_plan.model.js';

// Create a PaymentIntent for a pricing plan
const createPaymentIntent = async (req, res) => {
    try {
        const { planId } = req.body;
        const userId = req.user?._id || null; // Provided by auth middleware

        // Input validation
        if (!planId) {
            return res.status(400).json({ success: false, message: "planId is required" });
        }

        // Fetch plan and validate
        const plan = await PricingPlan.findById(planId);
        if (!plan) {
            return res.status(404).json({ success: false, message: "Plan not found" });
        }
        if (!plan.isActive) {
            return res.status(400).json({ success: false, message: "Plan is not active" });
        }
        if (typeof plan.price !== 'number' || plan.price <= 0) {
            return res.status(400).json({ success: false, message: "Invalid plan price" });
        }

        // Stripe expects amount in cents for USD, GBP, EUR
        let amount = plan.price;
        if (["USD", "EUR", "GBP"].includes(plan.currency)) {
            amount = Math.round(plan.price * 100);
        }

        // Create PaymentIntent
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: plan.currency.toLowerCase(),
            metadata: {
                planName: plan.name,
                planType: plan.type,
                planId: plan._id.toString(),
                userId: userId ? userId.toString() : "guest",
            },
            receipt_email: req.user?.email,
            description: `Remlyo ${plan.name} plan purchase for ${req.user?.email || "guest"}`,
        });

        res.json({ clientSecret: paymentIntent.client_secret, success: true });
    } catch (err) {
        console.error("[PaymentIntent Error]", err);
        res.status(500).json({ error: err.message, success: false });
    }
};

// TODO: Add Stripe webhook handler for payment confirmation and fulfillment

export {
    createPaymentIntent
}
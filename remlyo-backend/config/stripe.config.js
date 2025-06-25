import Stripe from "stripe"
const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // Add this key to your .env

export default stripe;
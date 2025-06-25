import express from 'express';
import { createPaymentIntent } from '../controllers/payment.controller.js';


const PaymentRouter = express.Router();

PaymentRouter.post('/create-payment-intent', createPaymentIntent);



export default PaymentRouter;
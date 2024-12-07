import {Router } from 'express'
import {PaymentController} from '../controllers/payment-controller.js'

const paymentRouter = Router();

paymentRouter.post('/checkout', PaymentController.processPayment);
paymentRouter.get('/history/:userId', PaymentController.getPaymentHistory);

export default paymentRouter
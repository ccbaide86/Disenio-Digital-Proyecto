import { Router } from "express";
import { PaymentController } from "../controllers/payment-controller.js";

const paymentRouter = Router();

paymentRouter.post("/checkout", PaymentController.processPayment);
paymentRouter.get("/history/:id", PaymentController.getPaymentHistory);

export default paymentRouter;
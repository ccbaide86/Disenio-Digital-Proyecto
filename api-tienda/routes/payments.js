import { Router } from "express";
import { PaymentController } from "../controllers/payment-controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import isAdmin from "../middlewares/isAdmin.js";

const paymentRouter = Router();

paymentRouter.post("/checkout", authMiddleware, PaymentController.processPayment);
paymentRouter.get("/history/:id", authMiddleware, PaymentController.getPaymentHistory);

export default paymentRouter;
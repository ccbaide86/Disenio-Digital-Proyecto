import { ReportsController } from "../controllers/reports-controller.js";
import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import isAdmin from "../middlewares/isAdmin.js";

const reportsRouter = Router();

reportsRouter.get("/sales", authMiddleware, isAdmin, ReportsController.getSalesReport);

reportsRouter.get("/inventory", authMiddleware, isAdmin, ReportsController.getInventoryReport);

export default reportsRouter;

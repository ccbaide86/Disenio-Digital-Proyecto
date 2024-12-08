import { Router } from 'express';
import { inventoryController } from '../controllers/inventory-controller.js';
import isAdmin from '../middlewares/isAdmin.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const inventoryRouter = Router();     

inventoryRouter.get('/:id', [authMiddleware,isAdmin],inventoryController.getStockById);

inventoryRouter.post('/restock',[authMiddleware,isAdmin], inventoryController.addNewStock);

export default inventoryRouter;

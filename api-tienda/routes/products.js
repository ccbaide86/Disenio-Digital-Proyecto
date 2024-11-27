import { Router } from 'express';
import { ProductController } from '../controllers/product-controller.js';

const productRoute = Router();

// productos 
productRoute.get('/', ProductController.getAllProducts);

productRoute.get('/:id', ProductController.getProductById);

productRoute.post('/', ProductController.createProduct);

productRoute.put('/:id', ProductController.updateProduct);

productRoute.delete('/:id', ProductController.deleteProduct);

// carrito

export default productRoute;

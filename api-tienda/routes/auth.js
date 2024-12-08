import { Router } from 'express';
import { AuthController } from '../controllers/auth-controller.js';

const authRouter = Router();

// POST: Registro de nuevos usuarios
authRouter.post('/register', AuthController.register);

// POST: Inicio de sesión
authRouter.post('/login', AuthController.login);

export default authRouter;
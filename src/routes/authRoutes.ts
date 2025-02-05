import { Router } from 'express';
import { login } from '../controllers/authController';

const router = Router();

// Rota para login
router.post('/login', async (req, res, next) => {
    try {
        // O controlador `login` será responsável por enviar a resposta
        await login(req, res);
    } catch (error) {
        // Passa o erro para o middleware de tratamento
        next(error);
    }
});

export default router;

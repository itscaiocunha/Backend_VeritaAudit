import { Router } from 'express';
import { login } from '../controllers/authController';
import { registro } from '../controllers/authController';
import { infoAdd } from '../controllers/authController';

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

router.post('/registro', async (req, res, next) => {
    try {
        // O controlador `registro` será responsável por enviar a resposta
        await registro(req, res);
    } catch (error) {
        // Passa o erro para o middleware de tratamento de erros
        next(error);
    }
});

router.post('/info', async (req, res, next) => {
    console.log("Requisição recebida em /api/auth/info:", req.body);
    try {
        await infoAdd(req, res);
    } catch (error) {
        next(error);
    }
});



export default router;

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';

dotenv.config(); // Carrega variáveis de ambiente do arquivo .env

const app = express();

// Configuração do middleware CORS para permitir todas as origens
app.use(cors()); // CORS desativado, aceita requisições de qualquer origem

// Middleware para interpretar JSON
app.use(express.json());

// Rota principal para verificação de funcionamento
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({ message: 'Backend funcionando corretamente!' });
});

// Rotas de autenticação
app.use('/api/auth', authRoutes);

// Middleware de tratamento de erros (precisa dos 4 parâmetros para ser reconhecido como middleware de erro)
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Middleware de erro:', error.message); // Loga o erro no servidor

    res.status(500).json({ error: 'Erro interno no servidor.' });
});

// Inicia o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

export default app;

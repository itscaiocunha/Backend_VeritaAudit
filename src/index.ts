import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';

dotenv.config(); // Carrega variáveis de ambiente do arquivo .env

const app = express();

// Configuração do CORS
const allowedOrigins = [
    'http://localhost:5173', // Origem do frontend local
    'https://verita-audit.vercel.app/' // Substitua pela URL do seu frontend em produção
];

app.use(cors({
    origin: (origin, callback) => {
        // Permite requisições de origens permitidas ou sem origem (ex.: Postman)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));

// Middleware para interpretar JSON
app.use(express.json());

// Rotas de autenticação
app.use('/api/auth', authRoutes);

// Middleware de tratamento de erros
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    console.error(error.stack); // Log do erro no servidor
    res.status(500).json({ error: 'Erro interno no servidor' });
});

// Inicia o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();

// Configuração do CORS
const allowedOrigins = [
    'http://localhost:5173', // Origem do frontend local
    'https://verita-audit.vercel.app' // Substitua pela URL do seu frontend em produção
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));

app.use(express.json());

// Rotas de autenticação
app.use('/api/auth', authRoutes);

// Rota principal para verificar o status
app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'API rodando na Vercel!' });
});

// Middleware de erro
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    console.error(error.stack);
    res.status(500).json({ error: 'Erro interno no servidor' });
});

// Exporta a aplicação para que a Vercel possa usá-la
export default app;

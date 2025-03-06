import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import { connectDB } from './config/db';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Teste de conexão com o banco de dados
(async () => {
    try {
        const pool = await connectDB();
        if (pool) {
            console.log('✅ Conexão com o banco de dados estabelecida!');
        } else {
            console.error('❌ Falha na conexão com o banco de dados.');
        }
    } catch (error) {
        console.error('❌ Erro ao conectar ao banco:', error);
    }
})();

// Rota principal
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({ message: 'Backend funcionando corretamente!' });
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Middleware de erro global
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('❌ Erro detectado:', error.message);
    res.status(500).json({ error: 'Erro interno no servidor.', detalhe: error.message });
});

// Inicializa o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

export default app;
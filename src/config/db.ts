import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
    user: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || '',
    server: process.env.DB_SERVER || '',
    database: process.env.DB_NAME || '',
    options: {
        encrypt: true, 
        trustServerCertificate: true,
    },
};

if (!dbConfig.user || !dbConfig.password || !dbConfig.server || !dbConfig.database) {
    throw new Error('Variáveis de ambiente de configuração do banco de dados não estão corretamente definidas!');
}

let pool: sql.ConnectionPool | null = null;

export const connectDB = async (): Promise<sql.ConnectionPool | null> => {
    try {
        if (!pool) {
            pool = await sql.connect(dbConfig);
            console.log("✅ Banco de dados conectado com sucesso!");
        }
        return pool;
    } catch (error) {
        console.error("❌ Erro ao conectar ao banco de dados:", error);
        pool = null;
        return null;
    }
};

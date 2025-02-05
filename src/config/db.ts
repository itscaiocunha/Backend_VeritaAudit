import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();

const dbConfig: sql.config = {
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    server: process.env.DB_SERVER!,
    database: process.env.DB_NAME!,
    options: {
        encrypt: true,
        trustServerCertificate: true,
    },
};

// Exportando a função de conexão
export async function connectDB() {
    try {
        const pool = await sql.connect(dbConfig);
        console.log("Conectado ao banco de dados!");
        return pool;
    } catch (err) {
        console.error("Erro ao conectar ao banco de dados:", err);
        throw err;
    }
}

import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { connectDB } from "../config/db";

interface User {
  id: number;
  email: string;
  senha: string; // Alterado para string
}

export const login = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "E-mail e senha são obrigatórios" });
  }

  try {
    const pool = await connectDB();
    if (!pool) {
      return res.status(500).json({ message: "Erro na conexão com o banco de dados" });
    }

    const result = await pool
      .request()
      .input("email", email)
      .query("SELECT id, Email1 AS email, senha FROM VeritaAudit_Usuarios WHERE Email1 = @email");

    if (!result.recordset.length) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const user: User = result.recordset[0];

    console.log("Usuário encontrado:", user); // Log para depuração

    if (!user.senha) {
      return res.status(500).json({ message: "Erro interno: senha não encontrada no banco de dados" });
    }

    if (password !== user.senha) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    return res.json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error("Erro no login:", err);
    return res.status(500).json({ message: "Erro no servidor" });
  }
};

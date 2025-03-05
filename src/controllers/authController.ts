import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { connectDB } from "../config/db";

interface User {
  id: number;
  email: string;
  senha: string;
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
      .query("SELECT id, Email1 AS email, senha FROM Usuarios WHERE Email1 = @email");

    if (!result.recordset.length) {
      return res.status(401).json({ message: "E-mail ou senha inválidos" });
    }

    const user: User = result.recordset[0];

    if (!user.senha) {
      return res.status(500).json({ message: "Erro interno: senha não encontrada no banco de dados" });
    }

    const senhaValida = await bcrypt.compare(password, user.senha);
    if (!senhaValida) {
      return res.status(401).json({ message: "E-mail ou senha inválidos" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h", algorithm: "HS256" }
    );

    return res.json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error("Erro no login:", err);
    return res.status(500).json({ message: "Erro no servidor", error: err });
  }
};

export const registro = async (req: Request, res: Response): Promise<Response> => {
  const { nome, cpf, telefone, email1, email2, senha } = req.body;

  if (!nome || !cpf || !telefone || !email1 || !email2 || !senha) {
    return res.status(400).json({ message: "Todos os campos são obrigatórios" });
  }

  try {
    const pool = await connectDB();
    if (!pool) {
      return res.status(500).json({ message: "Erro na conexão com o banco de dados" });
    }

    const result = await pool
      .request()
      .input("cpf", cpf)
      .query("SELECT * FROM Usuarios WHERE cpf = @cpf");

    if (result.recordset.length > 0) {
      return res.status(409).json({ message: "Usuário já cadastrado" });
    }

    const hashedPassword = await bcrypt.hash(senha, 12);

    await pool
      .request()
      .input("nome", nome)
      .input("cpf", cpf)
      .input("telefone", telefone)
      .input("email1", email1)
      .input("email2", email2)
      .input("password", hashedPassword)
      .query(`
        INSERT INTO Usuarios(nome, cpf, Celular, Email1, Email2, Senha)
        VALUES (@nome, @cpf, @telefone, @email1, @email2, @password)
      `);

    return res.status(201).json({ message: "Usuário cadastrado com sucesso" });
  } catch (err) {
    console.error("Erro no cadastro:", err);
    return res.status(500).json({ message: "Erro no servidor", error: err });
  }
};

export const infoAdd = async (req: Request, res: Response): Promise<Response> => {
  const { cep, endereco, bairro, numero, complemento, uf, cidade, cnpj, cpf } = req.body;

  // Validação dos campos obrigatórios
  if (!cep || !endereco || !bairro || !numero || !uf || !cidade || !cnpj || !cpf) {
    return res.status(400).json({ message: "Todos os campos são obrigatórios" });
  }

  try {
    const pool = await connectDB();
    console.log("Pool de conexão:", pool ? "Conectado" : "Falha na conexão");

    if (!pool) {
      return res.status(500).json({ message: "Erro na conexão com o banco de dados" });
    }

    // Verifica se o usuário existe no banco
    const result = await pool
      .request()
      .input("cpf", cpf)
      .query("SELECT * FROM Usuarios WHERE cpf = @cpf");

    if (result.recordset.length > 0) {
      // Usuário encontrado, atualizar informações
      await pool
        .request()
        .input("cep", cep)
        .input("cnpj", cnpj)
        .input("endereco", endereco)
        .input("bairro", bairro)
        .input("numero", numero)
        .input("complemento", complemento)
        .input("uf", uf)
        .input("cidade", cidade)
        .input("cpf", cpf)
        .query(`
          UPDATE Usuarios 
          SET CEP = @cep, 
              VinculoCNPJ = @cnpj, 
              Rua = @endereco, 
              Bairro = @bairro, 
              Numero = @numero, 
              Complemento = @complemento, 
              UF = @uf, 
              Cidade = @cidade 
          WHERE CPF = @cpf;
        `);

      return res.status(200).json({ message: "Dados atualizados com sucesso!" });
    } else {
      return res.status(404).json({ message: "Usuário não encontrado no banco de dados" });
    }
  } catch (err) {
    console.error("Erro no cadastro:", err);
    return res.status(500).json({ message: "Erro no servidor", error: err });
  }
};
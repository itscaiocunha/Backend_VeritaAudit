import { Request, Response } from "express";
import { connectDB } from "../config/db";

export const getStats = async (req: Request, res: Response): Promise<Response> => {
  try {
    console.log("🔹 Obtendo estatísticas do banco de dados...");
    const pool = await connectDB();

    if (!pool) {
      console.error("❌ Erro ao conectar ao banco de dados.");
      return res.status(500).json({ message: "Erro na conexão com o banco de dados" });
    }

    const pesquisas = await pool.request().query("SELECT COUNT(*) as Pesquisas FROM Estudos");
    const colaboradores = await pool.request().query("SELECT COUNT(*) as Colaboradores FROM Usuarios");
    const centrosPesquisa = await pool.request().query("SELECT COUNT(*) as CentrosPesquisa FROM CentrosPesquisa");
    const empresas = await pool.request().query("SELECT COUNT(*) as Empresas FROM EmpresasPatrocinadoras");
    const equipes = await pool.request().query("SELECT COUNT(*) as Equipes FROM Equipes");

    console.log("✅ Estatísticas recuperadas com sucesso!");

    return res.json({
      pesquisas: pesquisas.recordset[0]?.Pesquisas || 0,
      colaboradores: colaboradores.recordset[0]?.Colaboradores || 0,
      centrosPesquisa: centrosPesquisa.recordset[0]?.CentrosPesquisa || 0,
      empresas: empresas.recordset[0]?.Empresas || 0,
      equipes: equipes.recordset[0]?.Equipes || 0,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
        console.error("❌ Erro ao buscar estatísticas:", err.message);
        return res.status(500).json({ message: "Erro no servidor", error: err.message });
    } else {
        console.error("❌ Erro desconhecido:", err);
        return res.status(500).json({ message: "Erro no servidor", error: "Erro desconhecido" });
    }
  }
};
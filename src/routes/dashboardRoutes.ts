import { Router } from "express";
import { getStats } from "../controllers/dashboardController";

const router = Router();

router.get("/card", async (req, res, next) => {
  try {
    console.log("🔹 Rota /api/dashboard acessada");
    await getStats(req, res);
  } catch (error) {
    console.error("❌ Erro na rota /api/dashboard:", error);
    next(error);
  }
});

export default router;
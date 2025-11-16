import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { obtenerReseñasPorJuego, guardarReseña } from "../controllers/reseñaController.js";

const reseñaRoutes = express.Router();

reseñaRoutes.get("/:juegoId", obtenerReseñasPorJuego);
reseñaRoutes.post("/:juegoId", authenticateToken, guardarReseña);

export default reseñaRoutes;
import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { guardarPuntaje, obtenerMejorPuntaje } from "../controllers/partidaController.js";

const partidaRoutes = express.Router();

partidaRoutes.post("/guardar", authenticateToken, guardarPuntaje);
partidaRoutes.get("/mejor/:juegoId", authenticateToken, obtenerMejorPuntaje);

export default partidaRoutes;

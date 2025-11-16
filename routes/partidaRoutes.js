import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { guardarPuntaje, obtenerMejorPuntaje, obtenerTablaPuntajes} from "../controllers/partidaController.js";

const partidaRoutes = express.Router();

partidaRoutes.post("/guardar", authenticateToken, guardarPuntaje);
partidaRoutes.get("/mejor/:juegoId", authenticateToken, obtenerMejorPuntaje);
partidaRoutes.get("/ranking/:juegoId", obtenerTablaPuntajes);

export default partidaRoutes;

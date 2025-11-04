import express from "express";
import { registerUser, getUsuarios,loginUser } from "../controllers/userController.js";

const router = express.Router();

// Ruta para registrar usuarios
router.post("/register", registerUser);

// Iniciar sesión
router.post("/login", loginUser);

// Ruta para listar todos los usuarios
router.get("/usuarios", getUsuarios);

export default router;

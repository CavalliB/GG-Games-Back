import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";  
import partidaRoutes from "./routes/partidaRoutes.js"; 
import reseñaRoutes from "./routes/reseñaRoutes.js"; 
import path from "path";
import { fileURLToPath } from "url";


dotenv.config();

const app = express();
app.use(express.static('dist'))

const PORT = process.env.PORT || 5000;

// Corrección para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Ruta HTML
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Rutas API
app.use("/api", userRoutes);           // rutas de usuario
app.use("/api/partida", partidaRoutes); // rutas de puntaje
app.use("/api/resena", reseñaRoutes); // rutas de reseñas

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Fallback para SPA: servir index.html en rutas que no sean API
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Siempre al final
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
export default app;
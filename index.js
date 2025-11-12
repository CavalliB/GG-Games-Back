import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Corrección: definir __dirname manualmente en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración CORS (para permitir cookies)
app.use(
  cors({
    origin: "http://localhost:5173", // tu frontend
    credentials: true, // importante si usas cookies o auth
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

app.use("/api", userRoutes);

app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente");
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

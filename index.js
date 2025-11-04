import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { supabase } from "./Supabase.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//  Obtener todos los usuarios
app.get("/Usuario", async (req, res) => {
  try {
    const { data: Usuario, error } = await supabase.from("Usuario").select("*");
    if (error) throw error;
    res.status(200).json(Usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//  Crear un nuevo usuario
app.post("/Usuario", async (req, res) => {
  try {
    const { NombreUsuario, Email, Contraseña } = req.body;

    if (!NombreUsuario || !Email || !Contraseña) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    // Verificar si el usuario o el email ya existen
    const { data: existente } = await supabase
      .from("Usuario")
      .select("id")
      .or(`NombreUsuario.eq.${NombreUsuario},Email.eq.${Email}`)
      .single();

    if (existente) {
      return res.status(400).json({ error: "Usuario o email ya registrado" });
    }

    // Encriptar contraseña
    const hashedContraseña = await bcrypt.hash(Contraseña, 10);

    // Insertar en Supabase
    const { data, error } = await supabase
      .from("Usuario")
      .insert([
        {
          NombreUsuario,
          Email,
          Contraseña: hashedContraseña,
        },
      ])
      .select();

    if (error) throw error;

    res.status(201).json({
      mensaje: "Usuario creado correctamente",
      usuario: data[0],
    });
  } catch (error) {
    console.error("Error al crear usuario:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente 🚀");
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

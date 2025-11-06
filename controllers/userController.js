import bcrypt from "bcrypt";
import { supabase } from "../Supabase.js";
import { generateToken } from "../middleware/auth.js";

export const registerUser = async (req, res) => {
  try {
    const { NombreUsuario, Email, Contraseña } = req.body;

    if (!NombreUsuario || !Email || !Contraseña) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const hashedContraseña = await bcrypt.hash(Contraseña, 10);

    const { data, error } = await supabase
      .from("Usuario")
      .insert([{ NombreUsuario, Email, Contraseña: hashedContraseña }])
      .select();

    if (error) throw error;

    res.status(201).json({ message: "Usuario creado exitosamente", user: data[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Login de usuario
export const loginUser = async (req, res) => {
  try {
    const { Email, Contraseña } = req.body;

    if (!Email || !Contraseña) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    // Buscar usuario por Email
    const { data, error } = await supabase
      .from("Usuario")
      .select("*")
      .eq("Email", Email)
      .single();

    if (error || !data) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    // Comparar contraseñas
    const validContraseña = await bcrypt.compare(Contraseña, data.Contraseña);

    if (!validContraseña) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    // Generar token
const token = generateToken({
  id: data.id,
  nombreUsuario: data.NombreUsuario
});

// Guardar token en cookie
res.cookie("token", token, {
  httpOnly: true,     
  secure: false,      // true en HTTPS
  maxAge: 3600000     // 1 hora
});

res.status(200).json({
  message: "Login exitoso",
  usuario: {
    id: data.id,
    nombreUsuario: data.NombreUsuario
  }
});

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todos los usuarios
export const getUsuarios = async (req, res) => {
  try {
    const { data, error } = await supabase.from("Usuario").select("*");
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
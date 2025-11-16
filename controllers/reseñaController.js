import { supabase } from "../Supabase.js";

// Obtener todas las reseñas de un juego

export const obtenerReseñasPorJuego = async (req, res) => {
    try {
        const { juegoId } = req.params;
        if (!juegoId) return res.status(400).json({ error: "Falta juegoId" });

        const jugadorId = req.user?.id; // opcional, si está logueado

        // Traer todas las reseñas del juego
        const { data, error } = await supabase
            .from("Reseña")
            .select(`id, puntaje, comentario, Usuario ( id, NombreUsuario )`)
            .eq("juego", juegoId);

        if (error) throw error;

        // Calcular promedio
        const promedio =
            data.length > 0
                ? data.reduce((acc, r) => acc + r.puntaje, 0) / data.length
                : 0;

        // Buscar mi reseña si estoy logueado
        const miReseña = jugadorId
            ? data.find(r => r.Usuario?.id === jugadorId) || null
            : null;

        res.status(200).json({
            reseñas: data,
            promedio: promedio.toFixed(1),
            miReseña,
        });
    } catch (error) {
        console.error("Error obteniendo reseñas:", error);
        res.status(500).json({ error: error.message });
    }
};

// Guardar o actualizar reseña

export const guardarReseña = async (req, res) => {
    try {
        const { juegoId } = req.params;
        const jugadorId = req.user?.id;
        const { puntaje, comentario } = req.body;

        if (!juegoId) return res.status(400).json({ error: "Falta juegoId" });
        if (!jugadorId) return res.status(401).json({ error: "Jugador no logueado" });
        if (puntaje == null)
            return res.status(400).json({ error: "El puntaje es obligatorio" });

        // Validar puntaje en rango válido 
        if (puntaje < 1 || puntaje > 5) {
            return res.status(400).json({ error: "El puntaje debe estar entre 1 y 5" });
        }

        // 1. Verificar si ya existe reseña del jugador
        const { data: existente, error: selectError } = await supabase
            .from("Reseña")
            .select("*")
            .eq("jugador", jugadorId)
            .eq("juego", juegoId)
            .single();

        let responseData;

        if (!existente) {
            // 2. Insertar nueva reseña
            const { data, error } = await supabase
                .from("Reseña")
                .insert([{
                    juego: juegoId,
                    jugador: jugadorId,
                    puntaje,
                    comentario: comentario || null
                }])
                .select();

            if (error) throw error;
            responseData = data[0];
            return res.status(201).json({ message: "Reseña creada", reseña: responseData });
        }

        // 3. Actualizar reseña existente
        const { data, error } = await supabase
            .from("Reseña")
            .update({
                puntaje,
                comentario: comentario || null
            })
            .eq("id", existente.id)
            .select();

        if (error) throw error;
        responseData = data[0];

        res.status(200).json({ message: "Reseña actualizada", reseña: responseData });
    } catch (error) {
        console.error("Error guardando reseña:", error);
        res.status(500).json({ error: error.message });
    }
};

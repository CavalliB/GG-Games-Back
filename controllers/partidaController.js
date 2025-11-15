import { supabase } from "../Supabase.js";

export const guardarPuntaje = async (req, res) => {
    try {
        const { juegoId, puntuacion } = req.body;
        const usuarioId = req.user.id;

        // 1. Verificar si ya existe un puntaje previo
        const { data: existingScore, error: selectError } = await supabase
            .from("Partida")
            .select("*")
            .eq("jugador", usuarioId)
            .eq("juego", juegoId)
            .single();

        // Si el error NO es "no se encontró registro", lanzarlo
        if (selectError && selectError.code !== "PGRST116") { 
            throw selectError;
        }

        // 2. Si no existe registro, se crea uno
        if (!existingScore) {
            const { data, error } = await supabase
                .from("Partida")
                .insert([
                    {
                        juego: juegoId,
                        jugador: usuarioId,
                        puntuacion: puntuacion
                    }
                ])
                .select();

            if (error) throw error;

            return res.status(201).json({ 
                message: "Primer puntaje guardado",
                partida: data 
            });
        }

        // 3. Si existe, solo actualizar si el nuevo puntaje es mayor
        if (puntuacion > existingScore.puntuacion) {
            const { data, error } = await supabase
                .from("Partida")
                .update({ puntuacion: puntuacion })
                .eq("id", existingScore.id)
                .select();

            if (error) throw error;

            return res.json({ 
                message: "Puntaje actualizado (nuevo récord)",
                partida: data 
            });
        }

        // 4. Si el puntaje es menor o igual, no actualizar
        res.json({ 
            message: "No se actualizó: el puntaje no supera el récord actual",
            recordActual: existingScore.puntuacion 
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



// =========================================================
// 📌 Obtener el mejor puntaje del usuario para un juego
// =========================================================
export const obtenerMejorPuntaje = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { juegoId } = req.params;

        const { data, error } = await supabase
            .from("Partida")
            .select("puntuacion")
            .eq("jugador", usuarioId)
            .eq("juego", juegoId)
            .order("puntuacion", { ascending: false })
            .limit(1);

        if (error) throw error;

        res.json({
            mejorPuntaje: data && data.length ? data[0].puntuacion : 0
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

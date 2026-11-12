import db from "../config/dataBase.js";
import { AppError } from "./AppError.js";

export async function marcarPresencaService(eventId, userId) {
    const evento = await db.oneOrNone("SELECT * FROM events WHERE id = $1;", [eventId]);
    if (!evento) {
        throw new AppError("Evento não encontrado.", 404);
    }

    const totalPresencas = await db.one(
        "SELECT COUNT(*) FROM presencas WHERE event_id = $1;",
        [eventId],
        a => Number(a.count)
    );

    if (totalPresencas >= evento.capacidade_maxima) {
        throw new AppError("Este evento já atingiu a capacidade máxima.", 400);
    }

    try {
        const novaPresenca = await db.one(
            "INSERT INTO presencas (user_id, event_id) VALUES ($1, $2) RETURNING *;",
            [userId, eventId]
        );
        return novaPresenca;
    } catch (error) {
        if (error.code === '23505') {
            throw new AppError("Este usuário já está inscrito neste evento.", 409);
        }
        throw error;
    }
}

export async function desmarcarPresencaService(eventId, userId) {
    const resultado = await db.result(
           `DELETE FROM presencas
            WHERE event_id = $1
            AND user_id = $2;`,
        [eventId, userId]
    );
    
    return resultado.rowCount > 0;
}
import db from "../config/dataBase.js";

export async function marcarPresencaService(eventId, userId) {
    const evento = await db.oneOrNone("SELECT * FROM events WHERE id = $1;", [eventId]);
    if (!evento) {
        throw new Error("EVENTO_NAO_ENCONTRADO");
    }

    const totalPresencas = await db.one(
        "SELECT COUNT(*) FROM presencas WHERE event_id = $1;",
        [eventId],
        a => Number(a.count)
    );

    if (totalPresencas >= evento.capacidade_maxima) {
        throw new Error("EVENTO_LOTADO");
    }

    try {
        const novaPresenca = await db.one(
            "INSERT INTO presencas (user_id, event_id) VALUES ($1, $2) RETURNING *;",
            [userId, eventId]
        );
        return novaPresenca;
    } catch (error) {
        if (error.code === '23505') {
            throw new Error("JA_INSCRITO");
        }
        throw error;
    }
}

export async function desmarcarPresencaService(eventId, email) {
    const resultado = await db.result(
           `DELETE FROM presencas
            WHERE event_id = $1
                AND user_id IN (
                    SELECT id FROM users WHERE email = $2
                );`,
        [eventId, email]
    );
    
    return resultado.rowCount > 0;
}
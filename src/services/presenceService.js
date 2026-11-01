import db from "../config/database.js";

export async function marcarPresencaService(eventId, nome, email) {
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
            "INSERT INTO presencas (event_id, nome, email) VALUES ($1, $2, $3) RETURNING *;",
            [eventId, nome, email]
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
        "DELETE FROM presencas WHERE event_id = $1 AND email = $2;",
        [eventId, email]
    );
    
    return resultado.rowCount > 0;
}
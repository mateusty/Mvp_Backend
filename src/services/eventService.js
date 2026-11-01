import db from "../config/database.js";

export async function criarEventoService(dados) {
    const {
        atividade,
        descricao,
        localizacao,
        parque,
        capacidade_maxima,
        data_evento,
        google_maps_url
    } = dados;

    const dataFormatada = data_evento ? data_evento.replace("T", " ") + (data_evento.length === 16 ? ":00" : "") : null;

    const query = `
        INSERT INTO events (atividade, descricao, localizacao, parque, capacidade_maxima, data_evento, google_maps_url)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
    `;

    const values = [
        atividade,
        descricao,
        localizacao,
        parque,
        capacidade_maxima,
        dataFormatada,
        google_maps_url
    ];

   
    return await db.one(query, values);
}

export async function listarEventosService() {

    return await db.any("SELECT * FROM events ORDER BY data_evento ASC;");
}

export async function buscarEventoService(id) {
  
    return await db.oneOrNone("SELECT * FROM events WHERE id = $1;", [id]);
}

export async function atualizarEventoService(id, dados) {
    const eventoAtual = await buscarEventoService(id);
    if (!eventoAtual) return null;

    const atividade = dados.atividade ?? eventoAtual.atividade;
    const descricao = dados.descricao ?? eventoAtual.descricao;
    const localizacao = dados.localizacao ?? eventoAtual.localizacao;
    const parque = dados.parque ?? eventoAtual.parque;
    const capacidade_maxima = dados.capacidade_maxima ?? eventoAtual.capacidade_maxima;
    
    let data_evento = dados.data_evento ?? eventoAtual.data_evento;
    if (dados.data_evento) {
        data_evento = dados.data_evento.replace("T", " ") + (dados.data_evento.length === 16 ? ":00" : "");
    }

    const google_maps_url = dados.google_maps_url ?? eventoAtual.google_maps_url;

    const query = `
        UPDATE events
        SET atividade = $1, descricao = $2, localizacao = $3, parque = $4, capacidade_maxima = $5, data_evento = $6, google_maps_url = $7
        WHERE id = $8
        RETURNING *;
    `;

    const values = [
        atividade,
        descricao,
        localizacao,
        parque,
        capacidade_maxima,
        data_evento,
        google_maps_url,
        id
    ];

    return await db.one(query, values);
}

export async function excluirEventoService(id) {
    return await db.oneOrNone(
        "DELETE FROM events WHERE id = $1 RETURNING *;",
        [id]
    );
}
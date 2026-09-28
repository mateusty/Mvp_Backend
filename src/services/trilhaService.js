import { v4 as uuidv4 } from "uuid";
import db from "../config/dataBase.js";


export async function criarTrilhaService(dados) {

    const novaTrilha = {
        id: uuidv4(),
        nome: dados.nome,
        descricao: dados.descricao || null,
        dificuldade: dados.dificuldade,
        distancia_km: dados.distancia_km,
        duracao_minutos: dados.duracao_minutos,
        localizacao: dados.localizacao
    };


    const trilha = await db.one(
        `
        INSERT INTO trilhas (
            id,
            nome,
            descricao,
            dificuldade,
            distancia_km,
            duracao_minutos,
            localizacao
        )

        VALUES (
            $/id/,
            $/nome/,
            $/descricao/,
            $/dificuldade/,
            $/distancia_km/,
            $/duracao_minutos/,
            $/localizacao/
        )

        RETURNING *;
        `,
        novaTrilha
    );


    return trilha;
}


export async function listarTrilhasService() {

    return await db.any(
        `
        SELECT *
        FROM trilhas
        ORDER BY created_at DESC;
        `
    );
}


export async function buscarTrilhaService(id) {

    return await db.oneOrNone(
        `
        SELECT *
        FROM trilhas
        WHERE id = $1;
        `,
        [id]
    );
}


export async function atualizarTrilhaService(id, dados) {

    const parametros = {
        id,

        nome: dados.nome ?? null,

        descricao: dados.descricao ?? null,

        dificuldade: dados.dificuldade ?? null,

        distancia_km: dados.distancia_km ?? null,

        duracao_minutos: dados.duracao_minutos ?? null,

        localizacao: dados.localizacao ?? null
    };


    return await db.oneOrNone(
        `
        UPDATE trilhas

        SET
            nome = COALESCE($/nome/, nome),

            descricao = COALESCE(
                $/descricao/,
                descricao
            ),

            dificuldade = COALESCE(
                $/dificuldade/,
                dificuldade
            ),

            distancia_km = COALESCE(
                $/distancia_km/,
                distancia_km
            ),

            duracao_minutos = COALESCE(
                $/duracao_minutos/,
                duracao_minutos
            ),

            localizacao = COALESCE(
                $/localizacao/,
                localizacao
            )

        WHERE id = $/id/

        RETURNING *;
        `,
        parametros
    );
}


export async function excluirTrilhaService(id) {

    return await db.oneOrNone(
        `
        DELETE FROM trilhas
        WHERE id = $1
        RETURNING *;
        `,
        [id]
    );
}
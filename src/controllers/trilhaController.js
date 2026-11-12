import {
    criarTrilhaService,
    listarTrilhasService,
    buscarTrilhaService,
    atualizarTrilhaService,
    excluirTrilhaService
} from "../services/trilhaService.js";
import { AppError } from "../services/AppError.js";

export async function criarTrilha(req, res) {
    const {
        nome,
        descricao,
        dificuldade,
        distancia_km,
        duracao_minutos,
        localizacao,
        imagem_url,
        parque
    } = req.body;

    const trilha = await criarTrilhaService({
        nome: nome.trim(),
        descricao: descricao?.trim() || null,
        dificuldade,
        distancia_km,
        duracao_minutos,
        localizacao: localizacao.trim(),
        imagem_url: imagem_url?.trim() || null,
        parque
    });

    return res.status(201).json({
        mensagem: "Trilha criada com sucesso.",
        trilha
    });
}

export async function listarTrilhas(req, res) {
    const trilhas = await listarTrilhasService();
    return res.status(200).json(trilhas);
}

export async function buscarTrilha(req, res) {
    const trilha = await buscarTrilhaService(req.params.id);
    if (!trilha) {
        throw new AppError("Trilha não encontrada.", 404);
    }

    return res.status(200).json(trilha);
}

export async function atualizarTrilha(req, res) {
    const dados = { ...req.body };

    for (const campo of ["nome", "descricao", "localizacao", "imagem_url"]) {
        if (typeof dados[campo] === "string") {
            dados[campo] = dados[campo].trim();
        }
    }

    const trilhaAtualizada = await atualizarTrilhaService(req.params.id, dados);
    if (!trilhaAtualizada) {
        throw new AppError("Trilha não encontrada.", 404);
    }

    return res.status(200).json({
        mensagem: "Trilha atualizada com sucesso.",
        trilha: trilhaAtualizada
    });
}

export async function excluirTrilha(req, res) {
    const trilhaExcluida = await excluirTrilhaService(req.params.id);
    if (!trilhaExcluida) {
        throw new AppError("Trilha não encontrada.", 404);
    }

    return res.status(200).json({
        mensagem: "Trilha excluída com sucesso.",
        trilha: trilhaExcluida
    });
}

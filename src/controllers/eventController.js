import {
    criarEventoService,
    listarEventosService,
    buscarEventoService,
    atualizarEventoService,
    excluirEventoService
} from "../services/eventService.js";
import { AppError } from "../services/AppError.js";

function exigirAdmin(req, acao) {
    if (req.usuario && req.usuario.role !== "admin") {
        throw new AppError(
            `Acesso negado. Apenas administradores podem ${acao} eventos.`,
            403
        );
    }
}

export async function criarEvento(req, res) {
    exigirAdmin(req, "criar");

    const {
        atividade,
        descricao,
        localizacao,
        parque,
        capacidade_maxima,
        data_evento,
        google_maps_url
    } = req.body;

    const evento = await criarEventoService({
        atividade: atividade.trim(),
        descricao: descricao?.trim() || null,
        localizacao: localizacao.trim(),
        parque: parque.trim(),
        capacidade_maxima,
        data_evento,
        google_maps_url: google_maps_url?.trim() || null
    });

    return res.status(201).json({
        mensagem: "Evento criado com sucesso.",
        evento
    });
}

export async function listarEventos(req, res) {
    const eventos = await listarEventosService();
    return res.status(200).json(eventos || []);
}

export async function buscarEvento(req, res) {
    const evento = await buscarEventoService(req.params.id);

    if (!evento) {
        throw new AppError("Evento não encontrado.", 404);
    }

    return res.status(200).json(evento);
}

export async function atualizarEvento(req, res) {
    exigirAdmin(req, "atualizar");

    const dados = { ...req.body };
    if (dados.google_maps_url !== undefined) {
        dados.google_maps_url = dados.google_maps_url?.trim() || null;
    }

    const eventoAtualizado = await atualizarEventoService(req.params.id, dados);

    if (!eventoAtualizado) {
        throw new AppError("Evento não encontrado.", 404);
    }

    return res.status(200).json({
        mensagem: "Evento atualizado com sucesso.",
        evento: eventoAtualizado
    });
}

export async function excluirEvento(req, res) {
    exigirAdmin(req, "excluir");

    const eventoExcluido = await excluirEventoService(req.params.id);
    if (!eventoExcluido) {
        throw new AppError("Evento não encontrado.", 404);
    }

    return res.status(200).json({
        mensagem: "Evento excluído com sucesso.",
        evento: eventoExcluido
    });
}

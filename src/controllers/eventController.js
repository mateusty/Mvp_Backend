import { validate as validarUUID } from "uuid";
import {
    criarEventoService,
    listarEventosService,
    buscarEventoService,
    atualizarEventoService,
    excluirEventoService
} from "../services/eventService.js";

export async function criarEvento(req, res) {
    try {
        if (req.user && req.user.role !== 'admin') {
            return res.status(403).json({
                mensagem: "Acesso negado. Apenas administradores podem criar eventos."
            });
        }

        const {
            atividade,
            descricao,
            localizacao,
            parque,
            capacidade_maxima,
            data_evento,
            google_maps_url
        } = req.body;

        const capacidade = Number(capacidade_maxima);

        if (Number.isNaN(capacidade) || capacidade <= 0) {
            return res.status(400).json({
                mensagem: "A capacidade máxima deve ser um número maior que zero."
            });
        }

        const dadosEvento = {
            atividade: atividade?.trim(),
            descricao: descricao?.trim() || null,
            localizacao: localizacao?.trim(),
            parque: parque?.trim(),
            capacidade_maxima: capacidade,
            data_evento,
            google_maps_url: google_maps_url?.trim() || null
        };

        const evento = await criarEventoService(dadosEvento);

        return res.status(201).json({
            mensagem: "Evento criado com sucesso.",
            evento
        });

    } catch (erro) {
        console.error(erro);
        return res.status(500).json({
            mensagem: "Erro interno ao criar evento."
        });
    }
}

export async function listarEventos(req, res) {
    try {
        const eventos = await listarEventosService();
        return res.status(200).json(eventos || []); // Garante que envia um array mesmo se vier vazio
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({
            mensagem: "Erro interno ao listar eventos."
        });
    }
}

export async function buscarEvento(req, res) {
    try {
        const { id } = req.params;

        if (!validarUUID(id)) {
            return res.status(400).json({
                mensagem: "ID do evento inválido."
            });
        }

        const evento = await buscarEventoService(id);

        if (!evento) {
            return res.status(404).json({
                mensagem: "Evento não encontrado."
            });
        }

        return res.status(200).json(evento);

    } catch (erro) {
        console.error(erro);
        return res.status(500).json({
            mensagem: "Erro interno ao buscar evento."
        });
    }
}

export async function atualizarEvento(req, res) {
    try {
        if (req.user && req.user.role !== 'admin') {
            return res.status(403).json({
                mensagem: "Acesso negado. Apenas administradores podem atualizar eventos."
            });
        }

        const { id } = req.params;

        if (!validarUUID(id)) {
            return res.status(400).json({
                mensagem: "ID do evento inválido."
            });
        }

        const dados = { ...req.body };

        if (dados.capacidade_maxima !== undefined) {
            dados.capacidade_maxima = Number(dados.capacidade_maxima);

            if (Number.isNaN(dados.capacidade_maxima) || dados.capacidade_maxima <= 0) {
                return res.status(400).json({
                    mensagem: "A capacidade máxima deve ser maior que zero."
                });
            }
        }

        if (dados.google_maps_url !== undefined) {
            dados.google_maps_url = dados.google_maps_url?.trim() || null;
        }

        const eventoAtualizado = await atualizarEventoService(id, dados);

        if (!eventoAtualizado) {
            return res.status(404).json({
                mensagem: "Evento não encontrado."
            });
        }

        return res.status(200).json({
            mensagem: "Evento atualizado com sucesso.",
            evento: eventoAtualizado
        });

    } catch (erro) {
        console.error(erro);
        return res.status(500).json({
            mensagem: "Erro interno ao atualizar evento."
        });
    }
}

export async function excluirEvento(req, res) {
    try {
        if (req.user && req.user.role !== 'admin') {
            return res.status(403).json({
                mensagem: "Acesso negado. Apenas administradores podem excluir eventos."
            });
        }

        const { id } = req.params;

        if (!validarUUID(id)) {
            return res.status(400).json({
                mensagem: "ID do evento inválido."
            });
        }

        const eventoExcluido = await excluirEventoService(id);

        if (!eventoExcluido) {
            return res.status(404).json({
                mensagem: "Evento não encontrado."
            });
        }

        return res.status(200).json({
            mensagem: "Evento excluído com sucesso.",
            evento: eventoExcluido
        });

    } catch (erro) {
        console.error(erro);
        return res.status(500).json({
            mensagem: "Erro interno ao excluir evento."
        });
    }
}
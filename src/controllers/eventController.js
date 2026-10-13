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
        const {
            titulo,
            descricao,
            local,
            tema,
            data_horario,
            limite_pessoas
        } = req.body;

        const capacidade = Number(limite_pessoas);

        if (Number.isNaN(capacidade) || capacidade <= 0) {
            return res.status(400).json({
                mensagem: "O limite de pessoas deve ser um número maior que zero."
            });
        }

        const dadosEvento = {
            titulo: titulo.trim(),
            descricao: descricao?.trim() || null,
            local: local.trim(),
            tema: tema.trim(),
            data_horario,
            limite_pessoas: capacidade
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
        return res.status(200).json(eventos);
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
        const { id } = req.params;

        if (!validarUUID(id)) {
            return res.status(400).json({
                mensagem: "ID do evento inválido."
            });
        }

        const dados = { ...req.body };

        if (dados.limite_pessoas !== undefined) {
            dados.limite_pessoas = Number(dados.limite_pessoas);

            if (Number.isNaN(dados.limite_pessoas) || dados.limite_pessoas <= 0) {
                return res.status(400).json({
                    mensagem: "O limite de pessoas deve ser maior que zero."
                });
            }
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
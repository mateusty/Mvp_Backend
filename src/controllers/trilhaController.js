
import { validate as validarUUID } from "uuid";

import {
    criarTrilhaService,
    listarTrilhasService,
    buscarTrilhaService,
    atualizarTrilhaService,
    excluirTrilhaService
} from "../services/trilhaService.js";

function normalizarDificuldade(valor) {
    return valor
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

const dificuldadesPermitidas = ["facil", "medio", "dificil"];

const parquesPermitidos = [
    "parnaso",
    "tres-picos",
    "montanhas-tere"
];

export async function criarTrilha(req, res) {
    try {
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

        if (
            typeof nome !== "string" ||
            !nome.trim() ||
            typeof dificuldade !== "string" ||
            !dificuldade.trim() ||
            distancia_km === undefined ||
            duracao_minutos === undefined ||
            typeof localizacao !== "string" ||
            !localizacao.trim() ||
            typeof parque !== "string"
        ) {
            return res.status(400).json({
                mensagem: "Preencha todos os campos obrigatórios."
            });
        }

        const parqueNormalizado = parque.trim();

        if (!parquesPermitidos.includes(parqueNormalizado)) {
            return res.status(400).json({
                mensagem: "Parque inválido."
            });
        }

        const dificuldadeNormalizada = normalizarDificuldade(dificuldade);

        if (!dificuldadesPermitidas.includes(dificuldadeNormalizada)) {
            return res.status(400).json({
                mensagem: "Dificuldade deve ser facil, medio ou dificil."
            });
        }

        const distancia = Number(distancia_km);
        const duracao = Number(duracao_minutos);

        if (!Number.isFinite(distancia) || distancia <= 0) {
            return res.status(400).json({
                mensagem: "A distância deve ser maior que zero."
            });
        }

        if (!Number.isInteger(duracao) || duracao <= 0) {
            return res.status(400).json({
                mensagem: "A duração deve ser um inteiro maior que zero."
            });
        }

        if (
            (descricao != null && typeof descricao !== "string") ||
            (imagem_url != null && typeof imagem_url !== "string")
        ) {
            return res.status(400).json({
                mensagem: "Descrição ou endereço de imagem inválido."
            });
        }

        const dadosTrilha = {
            nome: nome.trim(),
            descricao: descricao?.trim() || null,
            dificuldade: dificuldadeNormalizada,
            distancia_km: distancia,
            duracao_minutos: duracao,
            localizacao: localizacao.trim(),
            imagem_url: imagem_url?.trim() || null,
            parque: parqueNormalizado
        };

        const trilha = await criarTrilhaService(dadosTrilha);

        return res.status(201).json({
            mensagem: "Trilha criada com sucesso.",
            trilha
        });

    } catch (erro) {
        console.error(erro);

        return res.status(500).json({
            mensagem: "Erro interno ao criar trilha."
        });
    }
}

export async function listarTrilhas(req, res) {
    try {
        const trilhas = await listarTrilhasService();

        return res.status(200).json(trilhas);

    } catch (erro) {
        console.error(erro);

        return res.status(500).json({
            mensagem: "Erro interno ao listar trilhas."
        });
    }
}

export async function buscarTrilha(req, res) {
    try {
        const { id } = req.params;

        if (!validarUUID(id)) {
            return res.status(400).json({
                mensagem: "ID da trilha inválido."
            });
        }

        const trilha = await buscarTrilhaService(id);

        if (!trilha) {
            return res.status(404).json({
                mensagem: "Trilha não encontrada."
            });
        }

        return res.status(200).json(trilha);

    } catch (erro) {
        console.error(erro);

        return res.status(500).json({
            mensagem: "Erro interno ao buscar trilha."
        });
    }
}

export async function atualizarTrilha(req, res) {
    try {
        const { id } = req.params;

        if (!validarUUID(id)) {
            return res.status(400).json({
                mensagem: "ID da trilha inválido."
            });
        }

        const dados = { ...req.body };

        for (const campo of [
            "nome",
            "descricao",
            "localizacao",
            "imagem_url"
        ]) {
            if (dados[campo] !== undefined && dados[campo] !== null) {
                if (typeof dados[campo] !== "string") {
                    return res.status(400).json({
                        mensagem: `${campo} inválido.`
                    });
                }

                dados[campo] = dados[campo].trim();
            }
        }

        if (dados.nome !== undefined && !dados.nome) {
            return res.status(400).json({
                mensagem: "Nome obrigatório."
            });
        }

        if (dados.localizacao !== undefined && !dados.localizacao) {
            return res.status(400).json({
                mensagem: "Localização obrigatória."
            });
        }

        if (dados.dificuldade !== undefined) {
            if (typeof dados.dificuldade !== "string") {
                return res.status(400).json({
                    mensagem: "Dificuldade inválida."
                });
            }

            dados.dificuldade = normalizarDificuldade(dados.dificuldade);

            if (!dificuldadesPermitidas.includes(dados.dificuldade)) {
                return res.status(400).json({
                    mensagem: "Dificuldade inválida."
                });
            }
        }

        if (dados.distancia_km !== undefined) {
            dados.distancia_km = Number(dados.distancia_km);

            if (!Number.isFinite(dados.distancia_km) || dados.distancia_km <= 0) {
                return res.status(400).json({
                    mensagem: "A distância deve ser maior que zero."
                });
            }
        }

        if (dados.duracao_minutos !== undefined) {
            dados.duracao_minutos = Number(dados.duracao_minutos);

            if (!Number.isInteger(dados.duracao_minutos) || dados.duracao_minutos <= 0) {
                return res.status(400).json({
                    mensagem: "A duração deve ser um inteiro maior que zero."
                });
            }
        }

        if (dados.parque !== undefined) {
            if (typeof dados.parque !== "string") {
                return res.status(400).json({
                    mensagem: "Parque inválido."
                });
            }

            dados.parque = dados.parque.trim();

            if (!parquesPermitidos.includes(dados.parque)) {
                return res.status(400).json({
                    mensagem: "Parque inválido."
                });
            }
        }

        const trilhaAtualizada = await atualizarTrilhaService(id, dados);

        if (!trilhaAtualizada) {
            return res.status(404).json({
                mensagem: "Trilha não encontrada."
            });
        }

        return res.status(200).json({
            mensagem: "Trilha atualizada com sucesso.",
            trilha: trilhaAtualizada
        });

    } catch (erro) {
        console.error(erro);

        return res.status(500).json({
            mensagem: "Erro interno ao atualizar trilha."
        });
    }
}

export async function excluirTrilha(req, res) {
    try {
        const { id } = req.params;

        if (!validarUUID(id)) {
            return res.status(400).json({
                mensagem: "ID da trilha inválido."
            });
        }

        const trilhaExcluida = await excluirTrilhaService(id);

        if (!trilhaExcluida) {
            return res.status(404).json({
                mensagem: "Trilha não encontrada."
            });
        }

        return res.status(200).json({
            mensagem: "Trilha excluída com sucesso.",
            trilha: trilhaExcluida
        });

    } catch (erro) {
        console.error(erro);

        return res.status(500).json({
            mensagem: "Erro interno ao excluir trilha."
        });
    }
}

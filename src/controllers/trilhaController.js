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


export async function criarTrilha(req, res) {

    try {

        const {
            nome,
            descricao,
            dificuldade,
            distancia_km,
            duracao_minutos,
            localizacao
        } = req.body;


        if (
            !nome ||
            !dificuldade ||
            distancia_km === undefined ||
            duracao_minutos === undefined ||
            !localizacao
        ) {

            return res.status(400).json({
                mensagem: "Preencha todos os campos obrigatórios."
            });
        }


        const dificuldadeNormalizada =
            normalizarDificuldade(dificuldade);


        const dificuldadesPermitidas = [
            "facil",
            "medio",
            "dificil"
        ];


        if (
            !dificuldadesPermitidas.includes(
                dificuldadeNormalizada
            )
        ) {

            return res.status(400).json({
                mensagem:
                    "Dificuldade deve ser facil, medio ou dificil."
            });
        }


        const distancia = Number(distancia_km);

        const duracao = Number(duracao_minutos);


        if (
            Number.isNaN(distancia) ||
            distancia <= 0
        ) {

            return res.status(400).json({
                mensagem:
                    "A distância deve ser maior que zero."
            });
        }


        if (
            Number.isNaN(duracao) ||
            duracao <= 0
        ) {

            return res.status(400).json({
                mensagem:
                    "A duração deve ser maior que zero."
            });
        }


        const dadosTrilha = {

            nome: nome.trim(),

            descricao:
                descricao?.trim() || null,

            dificuldade:
                dificuldadeNormalizada,

            distancia_km:
                distancia,

            duracao_minutos:
                duracao,

            localizacao:
                localizacao.trim()
        };


        const trilha =
            await criarTrilhaService(dadosTrilha);


        return res.status(201).json({

            mensagem:
                "Trilha criada com sucesso.",

            trilha
        });


    } catch (erro) {

        console.error(erro);

        return res.status(500).json({
            mensagem:
                "Erro interno ao criar trilha."
        });
    }
}



export async function listarTrilhas(req, res) {

    try {

        const trilhas =
            await listarTrilhasService();


        return res.status(200).json(
            trilhas
        );


    } catch (erro) {

        console.error(erro);

        return res.status(500).json({
            mensagem:
                "Erro interno ao listar trilhas."
        });
    }
}



export async function buscarTrilha(req, res) {

    try {

        const { id } = req.params;


        if (!validarUUID(id)) {

            return res.status(400).json({
                mensagem:
                    "ID da trilha inválido."
            });
        }


        const trilha =
            await buscarTrilhaService(id);


        if (!trilha) {

            return res.status(404).json({
                mensagem:
                    "Trilha não encontrada."
            });
        }


        return res.status(200).json(
            trilha
        );


    } catch (erro) {

        console.error(erro);

        return res.status(500).json({
            mensagem:
                "Erro interno ao buscar trilha."
        });
    }
}



export async function atualizarTrilha(req, res) {

    try {

        const { id } = req.params;


        if (!validarUUID(id)) {

            return res.status(400).json({
                mensagem:
                    "ID da trilha inválido."
            });
        }


        const dados = {
            ...req.body
        };


        if (dados.dificuldade) {

            dados.dificuldade =
                normalizarDificuldade(
                    dados.dificuldade
                );


            const permitidas = [
                "facil",
                "medio",
                "dificil"
            ];


            if (
                !permitidas.includes(
                    dados.dificuldade
                )
            ) {

                return res.status(400).json({
                    mensagem:
                        "Dificuldade inválida."
                });
            }
        }


        if (
            dados.distancia_km !== undefined
        ) {

            dados.distancia_km =
                Number(dados.distancia_km);


            if (
                Number.isNaN(
                    dados.distancia_km
                ) ||
                dados.distancia_km <= 0
            ) {

                return res.status(400).json({
                    mensagem:
                        "A distância deve ser maior que zero."
                });
            }
        }


        if (
            dados.duracao_minutos !== undefined
        ) {

            dados.duracao_minutos =
                Number(
                    dados.duracao_minutos
                );


            if (
                Number.isNaN(
                    dados.duracao_minutos
                ) ||
                dados.duracao_minutos <= 0
            ) {

                return res.status(400).json({
                    mensagem:
                        "A duração deve ser maior que zero."
                });
            }
        }


        const trilhaAtualizada =
            await atualizarTrilhaService(
                id,
                dados
            );


        if (!trilhaAtualizada) {

            return res.status(404).json({
                mensagem:
                    "Trilha não encontrada."
            });
        }


        return res.status(200).json({

            mensagem:
                "Trilha atualizada com sucesso.",

            trilha:
                trilhaAtualizada
        });


    } catch (erro) {

        console.error(erro);

        return res.status(500).json({
            mensagem:
                "Erro interno ao atualizar trilha."
        });
    }
}



export async function excluirTrilha(req, res) {

    try {

        const { id } = req.params;


        if (!validarUUID(id)) {

            return res.status(400).json({
                mensagem:
                    "ID da trilha inválido."
            });
        }


        const trilhaExcluida =
            await excluirTrilhaService(id);


        if (!trilhaExcluida) {

            return res.status(404).json({
                mensagem:
                    "Trilha não encontrada."
            });
        }


        return res.status(200).json({

            mensagem:
                "Trilha excluída com sucesso.",

            trilha:
                trilhaExcluida
        });


    } catch (erro) {

        console.error(erro);

        return res.status(500).json({
            mensagem:
                "Erro interno ao excluir trilha."
        });
    }
}
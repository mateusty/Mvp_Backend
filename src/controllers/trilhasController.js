const trilhaService = require("../services/trilhaService");

const trilhaController = {

    async listar(req, res) {
        try {
            const trilhas = await trilhaService.listar();

            return res.status(200).json(trilhas);

        } catch (erro) {
            console.error(erro);

            return res.status(500).json({
                mensagem: "Erro ao listar trilhas"
            });
        }
    },


    async buscarPorId(req, res) {
        try {
            const { id } = req.params;

            const trilha = await trilhaService.buscarPorId(id);

            if (!trilha) {
                return res.status(404).json({
                    mensagem: "Trilha não encontrada"
                });
            }

            return res.status(200).json(trilha);

        } catch (erro) {
            console.error(erro);

            return res.status(500).json({
                mensagem: "Erro ao buscar trilha"
            });
        }
    },


    async criar(req, res) {
        try {
            const dados = req.body;

            const novaTrilha = await trilhaService.criar(dados);

            return res.status(201).json(novaTrilha);

        } catch (erro) {
            console.error(erro);

            return res.status(400).json({
                mensagem: erro.message
            });
        }
    },


    async atualizar(req, res) {
        try {
            const { id } = req.params;
            const dados = req.body;

            const trilha = await trilhaService.atualizar(id, dados);

            if (!trilha) {
                return res.status(404).json({
                    mensagem: "Trilha não encontrada"
                });
            }

            return res.status(200).json(trilha);

        } catch (erro) {
            console.error(erro);

            return res.status(400).json({
                mensagem: erro.message
            });
        }
    },


    async excluir(req, res) {
        try {
            const { id } = req.params;

            const resultado = await trilhaService.excluir(id);

            if (!resultado) {
                return res.status(404).json({
                    mensagem: "Trilha não encontrada"
                });
            }

            return res.status(204).send();

        } catch (erro) {
            console.error(erro);

            return res.status(500).json({
                mensagem: "Erro ao excluir trilha"
            });
        }
    }

};

module.exports = trilhaController;
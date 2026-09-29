const Trilha = require("../models/Trilha");

const trilhaService = {

    async listar() {
        return await Trilha.findAll();
    },


    async buscarPorId(id) {
        return await Trilha.findByPk(id);
    },


    async criar(dados) {

        if (!dados.nome) {
            throw new Error("O nome da trilha é obrigatório");
        }

        const trilha = await Trilha.create(dados);

        return trilha;
    },


    async atualizar(id, dados) {

        const trilha = await Trilha.findByPk(id);

        if (!trilha) {
            return null;
        }

        await trilha.update(dados);

        return trilha;
    },


    async excluir(id) {

        const trilha = await Trilha.findByPk(id);

        if (!trilha) {
            return false;
        }

        await trilha.destroy();

        return true;
    }

};

module.exports = trilhaService;
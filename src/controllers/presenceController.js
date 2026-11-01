import { marcarPresencaService, desmarcarPresencaService } from "../services/presenceService.js";

export async function marcarPresenca(req, res) {
    try {
        const { eventId } = req.params;
        const { nome, email } = req.body;

        if (!nome || !email) {
            return res.status(400).json({ mensagem: "Nome e e-mail são obrigatórios." });
        }

        const novaPresenca = await marcarPresencaService(eventId, nome, email);

        return res.status(201).json({
            mensagem: "Presença marcada com sucesso.",
            presenca: novaPresenca
        });
    } catch (erro) {
        if (erro.message === "EVENTO_NAO_ENCONTRADO") {
            return res.status(404).json({ mensagem: "Evento não encontrado." });
        }
        if (erro.message === "EVENTO_LOTADO") {
            return res.status(400).json({ mensagem: "Este evento já atingiu a capacidade máxima." });
        }
        if (erro.message === "JA_INSCRITO") {
            return res.status(409).json({ mensagem: "Este e-mail já está inscrito neste evento." });
        }

        console.error(erro);
        return res.status(500).json({ mensagem: "Erro interno ao marcar presença." });
    }
}

export async function desmarcarPresenca(req, res) {
    try {
        const { eventId } = req.params;
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ mensagem: "E-mail é obrigatório para desmarcar." });
        }

        const removido = await desmarcarPresencaService(eventId, email);

        if (!removido) {
            return res.status(404).json({ mensagem: "Inscrição não encontrada para este e-mail neste evento." });
        }

        return res.status(200).json({ mensagem: "Presença desmarcada com sucesso." });
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ mensagem: "Erro interno ao desmarcar presença." });
    }
}
import { marcarPresencaService, desmarcarPresencaService } from "../services/presenceService.js";

export async function marcarPresenca(req, res) {
    try {
        const { eventId } = req.params;
        const token = req.headers.authorization.split(' ')[1];
        const userId = userIdPorToken(token);

        const novaPresenca = await marcarPresencaService(eventId, userId);

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
        const { eventId, id } = req.params;
        const { email } = req.body || {};
        
        if (!email) {
            return res.status(400).json({ mensagem: "E-mail é obrigatório para desmarcar." });
        }

        const presencaRemovida = await desmarcarPresencaService(eventId, email);

        return res.status(200).json({
            mensagem: "Presença removida com sucesso.",
            presenca: presencaRemovida
        });
    } catch (erro) {
        if (erro.message === "PRESENCA_NAO_ENCONTRADA") {
            return res.status(404).json({ mensagem: "Inscrição não encontrada para este e-mail." });
        }

        console.error(erro);
        return res.status(500).json({ mensagem: "Erro interno ao desmarcar presença." });
    }
}
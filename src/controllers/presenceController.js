import { AppError } from "../services/AppError.js";
import {
    marcarPresencaService,
    desmarcarPresencaService
} from "../services/presenceService.js";

export async function marcarPresenca(req, res) {
    const { eventId } = req.params;
    const novaPresenca = await marcarPresencaService(eventId, req.usuario.id);

    return res.status(201).json({
        mensagem: "Presença marcada com sucesso.",
        presenca: novaPresenca
    });
}

export async function desmarcarPresenca(req, res) {
    const { eventId } = req.params;
    const presencaRemovida = await desmarcarPresencaService(eventId, req.usuario.id);

    if (!presencaRemovida) {
        throw new AppError("Inscrição não encontrada para este e-mail.", 404);
    }

    return res.status(200).json({
        mensagem: "Presença removida com sucesso.",
        presenca: presencaRemovida
    });
}

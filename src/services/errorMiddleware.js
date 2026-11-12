import multer from "multer";
import { ZodError } from "zod";
import { AppError } from "./AppError.js";

export function errorMiddleware(error, req, res, next) {
    if (res.headersSent) {
        return next(error);
    }

    if (error instanceof ZodError) {
        return res.status(400).json({
            mensagem: "Dados inválidos na requisição.",
            erros: error.issues.map((issue) => ({
                campo: issue.path.join("."),
                mensagem: issue.message
            }))
        });
    }

    if (error instanceof multer.MulterError) {
        const arquivoGrande = error.code === "LIMIT_FILE_SIZE";
        return res.status(arquivoGrande ? 413 : 400).json({
            mensagem: arquivoGrande
                ? "A imagem deve ter no máximo 5 MB."
                : "Erro ao receber a imagem."
        });
    }

    if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
        return res.status(400).json({
            mensagem: "JSON inválido na requisição."
        });
    }

    if (error?.type === "entity.too.large") {
        return res.status(413).json({
            mensagem: "A requisição excede o tamanho permitido."
        });
    }

    if (error?.type === "encoding.unsupported" || error?.type === "charset.unsupported") {
        return res.status(415).json({
            mensagem: "Formato de requisição não suportado."
        });
    }

    if (error?.code === "23505") {
        return res.status(409).json({
            mensagem: "Dados já cadastrados"
        });
    }

    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            mensagem: error.message
        });
    }

    console.error(error);
    return res.status(500).json({
        mensagem: "Erro interno no servidor."
    });
}

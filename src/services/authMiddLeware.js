import jwt from "jsonwebtoken";
import { AppError } from "./AppError.js";


export function autenticarToken(req, res, next) {

    const authHeader = req.headers.authorization;

    const [tipo, token] = authHeader?.split(" ") ?? [];


    if (tipo !== "Bearer" || !token) {
        throw new AppError("Acesso negado. Token não fornecido!", 401);
    }


    try {

        const usuarioDecodificado = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.usuario = usuarioDecodificado;

        return next();

    } catch {
        throw new AppError("Token inválido ou expirado!", 401);
    }
}


export function somenteAdmin(req, res, next) {

    if (!req.usuario || req.usuario.role !== "admin") {

        throw new AppError("Acesso permitido somente para administradores!", 403);
    }

    return next();
}
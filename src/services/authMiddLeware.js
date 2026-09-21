import jwt from "jsonwebtoken";


export function autenticarToken(req, res, next) {

    const authHeader = req.headers.authorization;

    const [tipo, token] = authHeader?.split(" ") ?? [];


    if (tipo !== "Bearer" || !token) {

        return res.status(401).json({
            mensagem: "Acesso negado. Token não fornecido!"
        });

    }


    try {

        const usuarioDecodificado = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.usuario = usuarioDecodificado;

        return next();

    } catch (erro) {

        return res.status(401).json({
            mensagem: "Token inválido ou expirado!"
        });

    }
}


export function somenteAdmin(req, res, next) {

    if (!req.usuario || req.usuario.role !== "admin") {

        return res.status(403).json({
            mensagem: "Acesso permitido somente para administradores!"
        });

    }

    return next();
}
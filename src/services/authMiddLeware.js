import jwt from "jsonwebtoken";

export function autenticarToken(req, res, next) {

    const authHeader = req.headers.authorization;

    const token = authHeader?.split(" ")[1];

    if (!token) {
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

        next();

    } catch (erro) {

        return res.status(403).json({
            mensagem: "Token inválido ou expirado!"
        });

    }
}
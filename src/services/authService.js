import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function gerarHash(password) {
    return await bcrypt.hash(password, 10);
}

export async function verificarSenha(password, hash) {
    return await bcrypt.compare(password, hash);
}

export function gerarToken(usuario) {

    const token = jwt.sign(
        {
            id: usuario.id,
            email: usuario.email,
            role: usuario.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "2h"
        }
    );

    return token;
}
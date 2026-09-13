import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


export async function gerarHash(password) {

    const hash = await bcrypt.hash(password, 10);

    return hash;
}


export async function verificarSenha(password, hash) {

    return await bcrypt.compare(password, hash);
}


export function gerarToken(usuario) {

    const token = jwt.sign(
        {
            id: usuario.id,
            email: usuario.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "2h"
        }
    );

    return token;
}
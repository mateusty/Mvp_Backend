import pgPromise from "pg-promise";
import { v4 as uuidv4 } from "uuid";

import {
    gerarHash,
    verificarSenha
} from "./authService.js";


const pgp = pgPromise();


const db = pgp({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD
});


export async function cadastrarUsuario(user) {

    const hash = await gerarHash(user.password);

    await db.none(
        `
        INSERT INTO users (id, email, password_hash)
        VALUES ($1, $2, $3)
        `,
        [
            uuidv4(),
            user.email,
            hash
        ]
    );
}


export async function logarUsuario(user) {

    const usuarioBanco = await db.oneOrNone(
        `
        SELECT *
        FROM users
        WHERE email = $1
        `,
        [user.email]
    );


    if (!usuarioBanco) {
        return null;
    }


    const senhaCorreta = await verificarSenha(
        user.password,
        usuarioBanco.password_hash
    );


    if (!senhaCorreta) {
        return null;
    }


    return usuarioBanco;
}
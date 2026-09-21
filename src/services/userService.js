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

    const email = user.email.trim().toLowerCase();

    const hash = await gerarHash(user.password);


    const usuarioCriado = await db.one(
        `
        INSERT INTO users (
            id,
            email,
            password_hash
        )

        VALUES ($1, $2, $3)

        RETURNING
            id,
            email,
            role,
            created_at
        `,
        [
            uuidv4(),
            email,
            hash
        ]
    );


    return usuarioCriado;
}


export async function logarUsuario(user) {

    const email = user.email.trim().toLowerCase();


    const usuarioBanco = await db.oneOrNone(
        `
        SELECT
            id,
            email,
            password_hash,
            role

        FROM users

        WHERE email = $1
        `,
        [email]
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


    return {
        id: usuarioBanco.id,
        email: usuarioBanco.email,
        role: usuarioBanco.role
    };
}
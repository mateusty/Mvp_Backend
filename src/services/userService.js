import pgp from 'pg-promise';
import dotenv from 'dotenv';
import {v4 as uuidv4} from 'uuid';
import { gerarHash, verificarSenha } from './authService.js';

dotenv.config();
const db = pgp()(`postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.PORT}/${process.env.DB_NAME}`);

export async function CadastrarUsuario(user) {
    const hash = await gerarHash(user.password);

    await db.none('INSERT INTO users(id, email, password_hash) VALUES(${id}, ${email}, ${password_hash})', {
        id: uuidv4(),
        email: user.email,
        password_hash: hash
    });
}

export async function LogarUsuario(user) {
    const userDB = await db.oneOrNone('SELECT * FROM users WHERE email=${email}', {
        email: user.email
    })

    return await verificarSenha(user.password, userDB.password_hash);
}
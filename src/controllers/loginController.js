import {
    cadastrarUsuario,
    logarUsuario
} from "../services/userService.js";

import {
    gerarToken
} from "../services/authService.js";


export async function doRegister(req, res) {

    try {

        await cadastrarUsuario(req.body);

        return res.status(201).json({
            mensagem: "Usuário cadastrado com sucesso"
        });

    } catch (erro) {

        console.error(erro);

        return res.status(500).json({
            mensagem: "Erro ao cadastrar usuário"
        });

    }
}


export async function doLogin(req, res) {

    try {

        const usuario = await logarUsuario(req.body);

        if (!usuario) {

            return res.status(401).json({
                mensagem: "Email ou senha incorretos"
            });

        }

        const token = gerarToken(usuario);

        return res.status(200).json({
            mensagem: "Login realizado com sucesso",
            token: token,
            usuario: {
                id: usuario.id,
                email: usuario.email
            }
        });

    } catch (erro) {

        console.error(erro);

        return res.status(500).json({
            mensagem: "Erro interno no servidor"
        });

    }
}
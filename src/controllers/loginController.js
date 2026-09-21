import {
    cadastrarUsuario,
    logarUsuario
} from "../services/userService.js";

import {
    gerarToken
} from "../services/authService.js";


export async function doRegister(req, res) {

    try {

        const { email, password } = req.body;


        if (!email || !password) {

            return res.status(400).json({
                mensagem: "Email e senha são obrigatórios"
            });

        }


        if (password.length < 6) {

            return res.status(400).json({
                mensagem: "A senha deve possuir pelo menos 6 caracteres"
            });

        }


        const usuario = await cadastrarUsuario({
            email,
            password
        });


        return res.status(201).json({
            mensagem: "Usuário cadastrado com sucesso",
            usuario: usuario
        });

    } catch (erro) {

        console.error(erro);


        if (erro.code === "23505") {

            return res.status(409).json({
                mensagem: "Este email já está cadastrado"
            });

        }


        return res.status(500).json({
            mensagem: "Erro interno no servidor"
        });

    }
}


export async function doLogin(req, res) {

    try {

        const { email, password } = req.body;


        if (!email || !password) {

            return res.status(400).json({
                mensagem: "Email e senha são obrigatórios"
            });

        }


        const usuario = await logarUsuario({
            email,
            password
        });


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
                email: usuario.email,
                role: usuario.role
            }

        });

    } catch (erro) {

        console.error(erro);

        return res.status(500).json({
            mensagem: "Erro interno no servidor"
        });

    }
}
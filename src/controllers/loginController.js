import { AppError } from "../services/AppError.js";
import { gerarToken } from "../services/authService.js";
import {
    cadastrarUsuario,
    logarUsuario,
    buscarUsuarioPorId
} from "../services/userService.js";

export async function doRegister(req, res) {
    const { email, password, nome } = req.body;
    const usuario = await cadastrarUsuario({ nome, email, password });

    return res.status(201).json({
        mensagem: "Usuário cadastrado com sucesso",
        usuario
    });
}

export async function doLogin(req, res) {
    const { email, password } = req.body;
    const usuario = await logarUsuario({ email, password });

    if (!usuario) {
        throw new AppError("Email ou senha incorretos", 401);
    }

    const token = gerarToken(usuario);

    return res.status(200).json({
        mensagem: "Login realizado com sucesso",
        token,
        usuario: {
            id: usuario.id,
            email: usuario.email,
            role: usuario.role
        }
    });
}

export async function getMe(req, res) {
    const usuario = await buscarUsuarioPorId(req.usuario.id);

    if (!usuario) {
        throw new AppError("Usuário não encontrado.", 404);
    }

    return res.status(200).json({
        mensagem: "Dados do Usuário.",
        usuario
    });
}

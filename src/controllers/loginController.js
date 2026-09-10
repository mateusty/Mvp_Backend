import { CadastrarUsuario, LogarUsuario } from '../services/userService.js';


// mudar depois
export const doRegister = async (req, res) => {
    await CadastrarUsuario(req.body);
    res.json({response: "Usuário cadastrado com sucesso!"});
}

// mudar depois
export const doLogin = async (req, res) => {
    if (await LogarUsuario(req.body)) {
        res.json({response: "Usuário logado com sucesso"})
    }
    else res.json({response: "Senha incorreta"})
}

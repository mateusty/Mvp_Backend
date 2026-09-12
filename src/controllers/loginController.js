const{ gerartoken} = require('../services/authService');

const doLogin = (req, res) => {
     const {email, senha} = req.body;

     // SIMULAÇÃO: Estrutura do usuário que futuramente virá da consulta ao PostgreSQL
    const usuarioBanco = {
        id: 1,
        email: email,
        ehGuia: true
    };

    const token = gerartoken(usuarioBanco);

    //Retorna o token para o cliente
    return res.status(200).json({ 
        menssagem: 'Login realizado com sucesso',
        token: token,
        usuario: {
            id: usuarioBanco.id,
            email: usuarioBanco.email,
            ehGuia: usuarioBanco.ehGuia
        } 
    });

}

// mudar depois
export const doLogin = async (req, res) => {
    if (await LogarUsuario(req.body)) {
        res.json({response: "Usuário logado com sucesso"})
    }
    else res.json({response: "Senha incorreta"})
}

const LoginRequest = require("../models/loginRequest");
const authService = require("../services/authService");

const doLogin = (req, res) => {

    const login = new LoginRequest(req.body);

    if (!login.email || !login.password) {
        return res.status(400).json({
            mensagem: "Email e senha são obrigatórios"
        });
    }

    const token = authService.autenticar(
        login.email,
        login.password
    );

    if (!token) {
        return res.status(401).json({
            mensagem: "Email ou senha inválidos"
        });
    }

    return res.status(200).json({
        mensagem: "Login realizado com sucesso",
        token: token
    });
};

module.exports = {
    doLogin
};
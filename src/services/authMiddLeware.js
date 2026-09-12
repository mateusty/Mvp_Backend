const jwt  = require('jsonwebtoken');
const { SECRET_KEY } = require('../services/authService'); 

function autenticartoken(req, res, next) {

    // 1. Captura o cabeçalho authorization da requisição
    const authHeader = req.headers['authorization']

    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ mensagem: 'Acesso negado. Token não fornecido!' });
    }

    jwt.verify(token, SECRET_KEY, (err, usuarioDecodificado) => {
        if (err) {
            return res.status(403).json({ mensagem: 'Token inválido ou expirado!' });
        }
        
        // Anexa os dados do usuario (id, email, ehGuia) dentro do objeto req
        req.usuario = usuarioDecodificado;
       
        next();
    });
}

module.exports =  autenticartoken;
const jwt = require('jsonwebtoken');

// Esta é a chave secreta que assina o token
const SECRET_KEY = 'chave_secreta_tereverde';

/**
 * Gera o Token JWT para o usuário autenticado
 * @param {Object} usuario Objeto contendo id, email e perfil do usuário
 * @returns {string} Token JWT assinado
 */

    function gerartoken(usuario) {
        const token = jwt.sign(
        {
            id: usuario.id,
            email: usuario.email,
            ehGuia: usuario.ehGuia
        },
        SECRET_KEY,
        {
            expiresIn: '2h' // O token expira em 2 hora
        }
    );

    return token;
}

module.exports = {
    gerartoken,
    SECRET_KEY
};
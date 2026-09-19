const bcrypt = require('bcryptjs');

async function gerarHash(senha) {
    const saltRounds = 10;
    const hash = await bcrypt.hash(senha, saltRounds);
    return hash;
}

async function verificarSenha(senhaDigitada, hashSalvo) {
    const correspondencia = await bcrypt.compare(senhaDigitada, hashSalvo);
    return correspondencia;
}
module.exports = { gerarHash, verificarSenha };

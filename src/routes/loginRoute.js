const express = require('express');
const router = express.Router();
const userController = require('../controllers/loginController')
const autenticartoken = require('../services/authMiddLeware');

// Rota pública para autentificação de login
router.post('/', userController.doLogin);


// Rota protegida de teste (exige o Bearer Token no cabeçalho Authorization)
router.get('/perfil', autenticartoken, (req, res) => {
    return res.status(200).json({
        mensagem: 'Acesso autorizado à rota protegida!',
        usuarioLogado: req.usuario
    });
});

module.exports = router;


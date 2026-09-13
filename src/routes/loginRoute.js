const somenteAdmin = require("../middlewares/roleMiddleware");
const verificarToken = require("../middlewares/authMiddleware");
const express = require("express");

const router = express.Router();

const userController = require("../controllers/loginController");


router.post("/", userController.doLogin);


router.get("/protegido", verificarToken, (req, res) => {

    res.status(200).json({
        mensagem: "Você conseguiu entrar na rota protegida",
        usuario: req.usuario
    });

});


router.get(
    "/admin",
    verificarToken,
    somenteAdmin,
    (req, res) => {

        res.status(200).json({
            mensagem: "Área exclusiva para administradores"
        });

    }
);

module.exports = router;
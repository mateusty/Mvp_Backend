import express from "express";

import {
    doRegister,
    doLogin
} from "../controllers/loginController.js";

import {
    autenticarToken,
    somenteAdmin
} from "../services/authMiddleware.js";


const router = express.Router();


router.post(
    "/register",
    doRegister
);


router.post(
    "/login",
    doLogin
);


router.get(
    "/perfil",
    autenticarToken,
    (req, res) => {

        return res.status(200).json({
            mensagem: "Acesso autorizado",
            usuario: req.usuario
        });

    }
);


router.get(
    "/admin",
    autenticarToken,
    somenteAdmin,
    (req, res) => {

        return res.status(200).json({
            mensagem: "Acesso autorizado para administrador",
            usuario: req.usuario
        });

    }
);

import {
    doRegister,
    doLogin,
    getMe
} from "../controllers/loginCrontroller.js";

router.get(
    "/me",
    autenticarToken,
    getMe
);


export default router;
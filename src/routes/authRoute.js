import express from "express";

import {
    doRegister,
    doLogin,
    getMe
} from "../controllers/loginController.js";

import {
    autenticarToken,
    somenteAdmin
} from "../services/authMiddleware.js";

import { validarCampos } from "../services/validationMiddleware.js";

const router = express.Router();

router.post(
    "/register",
    validarCampos(["email", "password"]),
    doRegister
);

router.post(
    "/login",
    validarCampos(["email", "password"]),
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

router.get(
    "/me",
    autenticarToken,
    getMe
);


export default router;
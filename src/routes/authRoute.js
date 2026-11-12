import express from "express";

import {
    doRegister,
    doLogin,
    getMe
} from "../controllers/loginController.js";

import {
    autenticarToken,
    somenteAdmin
} from "../services/authMiddLeware.js";

import { validarCampos } from "../services/validationMiddleware.js";
import {
    loginBodySchema,
    registerBodySchema
} from "../schemas/requestSchemas.js";

const router = express.Router();

router.post(
    "/register",
    validarCampos({ body: registerBodySchema }),
    doRegister
);

router.post(
    "/login",
    validarCampos({ body: loginBodySchema }),
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
import express from "express";

import {
    doRegister,
    doLogin
} from "../controllers/loginController.js";

import {
    autenticarToken,
    somenteAdmin
} from "../services/authMiddLeware.js";


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


export default router;
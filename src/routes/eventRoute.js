import express from "express";

import {
    criarEvento,
    listarEventos,
    buscarEvento,
    atualizarEvento,
    excluirEvento
} from "../controllers/eventController.js";

import {
    autenticarToken,
    somenteAdmin
} from "../services/authMiddLeware.js";

import { validarCampos } from "../services/validationMiddleware.js";

const router = express.Router();

// Rotas públicas (Leitura)
router.get("/", listarEventos);
router.get("/:id", buscarEvento);

// Rotas restritas (Apenas Admins Autenticados)
router.post(
    "/",
    autenticarToken,
    somenteAdmin,
    validarCampos([
        "titulo",
        "descricao",
        "local",
        "tema",
        "data_horario",
        "limite_pessoas"
    ]),
    criarEvento
);

router.put(
    "/:id",
    autenticarToken,
    somenteAdmin,
    atualizarEvento
);

router.delete(
    "/:id",
    autenticarToken,
    somenteAdmin,
    excluirEvento
);

export default router;
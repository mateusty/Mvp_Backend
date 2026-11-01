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

router.get("/", listarEventos);
router.get("/:id", buscarEvento);

router.post(
    "/",
    autenticarToken,
    somenteAdmin,
    validarCampos([
        "atividade",
        "descricao",        
        "localizacao",
        "parque",
        "capacidade_maxima",
        "data_evento",
        "google_maps_url"  
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
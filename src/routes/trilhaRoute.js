import express from "express";

import {
    criarTrilha,
    listarTrilhas,
    buscarTrilha,
    atualizarTrilha,
    excluirTrilha
} from "../controllers/trilhaController.js";

import {
    autenticarToken,
    somenteAdmin
} from "../services/authMiddLeware.js";


const router = express.Router();


// público
router.get("/", listarTrilhas);

router.get("/:id", buscarTrilha);


// somente admin
router.post(
    "/",
    autenticarToken,
    somenteAdmin,
    criarTrilha
);

router.put(
    "/:id",
    autenticarToken,
    somenteAdmin,
    atualizarTrilha
);

router.delete(
    "/:id",
    autenticarToken,
    somenteAdmin,
    excluirTrilha
);


export default router;
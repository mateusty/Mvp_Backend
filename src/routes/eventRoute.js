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
import {
    createEventBodySchema,
    idParamsSchema,
    updateEventBodySchema
} from "../schemas/requestSchemas.js";

const router = express.Router();

router.get("/", listarEventos);
router.get("/:id", validarCampos({ params: idParamsSchema }), buscarEvento);

router.post(
    "/",
    autenticarToken,
    somenteAdmin,
    validarCampos({ body: createEventBodySchema }),
    criarEvento
);

router.put(
    "/:id",
    autenticarToken,
    somenteAdmin,
    validarCampos({
        params: idParamsSchema,
        body: updateEventBodySchema
    }),
    atualizarEvento
);

router.delete(
    "/:id",
    autenticarToken,
    somenteAdmin,
    validarCampos({ params: idParamsSchema }),
    excluirEvento
);

export default router;
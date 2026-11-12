import express from "express";
import { marcarPresenca, desmarcarPresenca } from "../controllers/presenceController.js";
import { autenticarToken, somenteAdmin } from "../services/authMiddLeware.js";
import { eventIdParamsSchema } from "../schemas/requestSchemas.js";
import { validarCampos } from "../services/validationMiddleware.js";

const router = express.Router();

router.post(
    "/:eventId/presenca",
    autenticarToken,
    validarCampos({ params: eventIdParamsSchema }),
    marcarPresenca
);

router.delete(
    "/:eventId/presenca",
    autenticarToken,
    validarCampos({ params: eventIdParamsSchema }),
    desmarcarPresenca
);
router.delete(
    "/admin/:eventId",
    autenticarToken,
    somenteAdmin,
    validarCampos({ params: eventIdParamsSchema }),
    desmarcarPresenca
);

export default router;
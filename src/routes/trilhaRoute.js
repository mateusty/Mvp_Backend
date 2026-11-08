
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

import {
  enviarImagemTrilha
} from "../controllers/UploadController.js";
import { validarCampos } from "../services/validationMiddleware.js";
import {
  createTrilhaBodySchema,
  idParamsSchema,
  updateTrilhaBodySchema
} from "../schemas/requestSchemas.js";

const router = express.Router();

router.get("/", listarTrilhas);

router.post(
  "/upload",
  autenticarToken,
  somenteAdmin,
  enviarImagemTrilha
);

router.get("/:id", validarCampos({ params: idParamsSchema }), buscarTrilha);

router.post(
  "/",
  autenticarToken,
  somenteAdmin,
  validarCampos({ body: createTrilhaBodySchema }),
  criarTrilha
);

router.put(
  "/:id",
  autenticarToken,
  somenteAdmin,
  validarCampos({
    params: idParamsSchema,
    body: updateTrilhaBodySchema
  }),
  atualizarTrilha
);

router.delete(
  "/:id",
  autenticarToken,
  somenteAdmin,
  validarCampos({ params: idParamsSchema }),
  excluirTrilha
);

export default router;

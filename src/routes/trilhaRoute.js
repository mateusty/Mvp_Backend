
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

const router = express.Router();

router.get("/", listarTrilhas);

router.post(
  "/upload",
  autenticarToken,
  somenteAdmin,
  enviarImagemTrilha
);

router.get("/:id", buscarTrilha);

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

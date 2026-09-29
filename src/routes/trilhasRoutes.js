const express = require("express");
const router = express.Router();

const trilhaController = require("../controllers/trilhaController");

// Listar todas as trilhas
router.get("/", trilhaController.listar);

// Buscar uma trilha pelo ID
router.get("/:id", trilhaController.buscarPorId);

// Criar uma trilha
router.post("/", trilhaController.criar);

// Atualizar uma trilha
router.put("/:id", trilhaController.atualizar);

// Excluir uma trilha
router.delete("/:id", trilhaController.excluir);

module.exports = router;
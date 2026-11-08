import express from "express";
import { marcarPresenca, desmarcarPresenca } from "../controllers/presenceController.js";
import { autenticarToken, somenteAdmin } from "../services/authMiddLeware.js";

const router = express.Router();

router.post("/:eventId/presenca", marcarPresenca);

router.delete("/:eventId/presenca", desmarcarPresenca);
router.delete("/admin/:id", autenticarToken, somenteAdmin, desmarcarPresenca);

export default router;
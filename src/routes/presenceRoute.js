import express from "express";
import { marcarPresenca, desmarcarPresenca } from "../controllers/presenceController.js";

const router = express.Router();

router.post("/:eventId/presenca", marcarPresenca);
router.delete("/:eventId/presenca", desmarcarPresenca);

export default router;
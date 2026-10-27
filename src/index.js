
import "dotenv/config";

import express from "express";
import cors from "cors";

import { fileURLToPath } from "node:url";

import authRoutes from "./routes/authRoute.js";
import trilhaRoute from "./routes/trilhaRoute.js";
import eventRoute from "./routes/eventRoute.js";

const app = express();

const PORT = process.env.PORT || 8080;

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET não configurado no .env");
}

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true
  })
);

const origensPermitidas = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://mateusty.github.io"
];

app.use(
  cors({
    origin: origensPermitidas
  })
);

const diretorioUploads = fileURLToPath(
  new URL("../uploads/trilhas/", import.meta.url)
);

app.use(
  "/uploads/trilhas",
  express.static(diretorioUploads, {
    index: false,
    dotfiles: "deny",
    setHeaders: (res) => {
      res.setHeader(
        "X-Content-Type-Options",
        "nosniff"
      );
    }
  })
);

app.get("/health", (req, res) => {
  return res.status(200).json({
    status: "ok"
  });
});

app.use("/auth", authRoutes);

app.use("/trilhas", trilhaRoute);

app.use("/eventos", eventRoute);

app.use((req, res) => {
  return res.status(404).json({
    mensagem: "Rota não encontrada"
  });
});

app.listen(PORT, () => {
  console.log(
    `Servidor funcionando na porta ${PORT}`
  );
});

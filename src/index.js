import "dotenv/config";

import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoute.js";


const app = express();

const PORT = process.env.PORT || 3000;


if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET não configurado no .env");
}


app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(cors({
    origin: 'https://mateusty.github.io/MVP-FrontEnd',
}));


app.get("/health", (req, res) => {

    return res.status(200).json({
        status: "ok"
    });

});


app.use(
    "/auth",
    authRoutes
);


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

import multer from "multer";
import { fileTypeFromFile } from "file-type";
import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import { rename, unlink } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { AppError } from "../services/AppError.js";

const diretorioUploads = fileURLToPath(
  new URL("../../uploads/trilhas/", import.meta.url)
);

mkdirSync(diretorioUploads, { recursive: true });

const formatosPermitidos = [
  "image/jpeg",
  "image/png",
  "image/webp"
];

const armazenamento = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, diretorioUploads);
  },

  filename: (req, file, callback) => {
    callback(null, `${randomUUID()}.tmp`);
  }
});

const upload = multer({
  storage: armazenamento,

  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
    fields: 0
  },

  fileFilter: (req, file, callback) => {
    if (!formatosPermitidos.includes(file.mimetype)) {
      return callback(
        new AppError("Envie uma imagem JPG, PNG ou WebP.", 400)
      );
    }

    callback(null, true);
  }
});

export function enviarImagemTrilha(req, res, next) {

  upload.single("imagem")(req, res, async (erroUpload) => {

    if (erroUpload) {
      return next(erroUpload);
    }

    if (!req.file) {
      return next(new AppError("Selecione uma imagem.", 400));
    }

    let caminhoArquivo = req.file.path;

    try {
      const tipo = await fileTypeFromFile(req.file.path);

      if (!tipo || !formatosPermitidos.includes(tipo.mime)) {
        await unlink(req.file.path);

        return next(new AppError("O arquivo não é uma imagem válida.", 400));
      }

      const identificador = req.file.filename.replace(
        /\.tmp$/,
        ""
      );

      const extensao = tipo.ext === "jpeg" ? "jpg" : tipo.ext;

      const nomeArquivo = `${identificador}.${extensao}`;

      const novoCaminho = join(
        diretorioUploads,
        nomeArquivo
      );

      await rename(req.file.path, novoCaminho);

      caminhoArquivo = novoCaminho;

      const enderecoApi = (
        process.env.PUBLIC_API_URL ||
        `${req.protocol}://${req.get("host")}`
      ).replace(/\/+$/, "");

      return res.status(201).json({
        mensagem: "Imagem enviada com sucesso.",
        imagem_url:
          `${enderecoApi}/uploads/trilhas/${nomeArquivo}`
      });

    } catch (erro) {
      try {
        await unlink(caminhoArquivo);
      } catch (erroLimpeza) {
        if (erroLimpeza.code !== "ENOENT") {
          console.error("Erro ao remover arquivo de upload:", erroLimpeza);
        }
      }

      return next(erro);
    }
  });
}

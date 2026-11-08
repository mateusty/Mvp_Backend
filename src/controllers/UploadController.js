
import multer from "multer";
import { fileTypeFromFile } from "file-type";
import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import { rename, unlink } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

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
        new Error("Envie uma imagem JPG, PNG ou WebP.")
      );
    }

    callback(null, true);
  }
});

export function enviarImagemTrilha(req, res) {

  upload.single("imagem")(req, res, async (erroUpload) => {

    if (erroUpload) {
      if (erroUpload instanceof multer.MulterError) {
        return res.status(
          erroUpload.code === "LIMIT_FILE_SIZE" ? 413 : 400
        ).json({
          mensagem:
            erroUpload.code === "LIMIT_FILE_SIZE"
              ? "A imagem deve ter no máximo 5 MB."
              : "Erro ao receber a imagem."
        });
      }

      return res.status(400).json({
        mensagem: erroUpload.message
      });
    }

    if (!req.file) {
      return res.status(400).json({
        mensagem: "Selecione uma imagem."
      });
    }

    let caminhoArquivo = req.file.path;

    try {
      const tipo = await fileTypeFromFile(req.file.path);

      if (!tipo || !formatosPermitidos.includes(tipo.mime)) {
        await unlink(req.file.path).catch(() => {});

        return res.status(400).json({
          mensagem: "O arquivo não é uma imagem válida."
        });
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
      await unlink(caminhoArquivo).catch(() => {});

      console.error("Erro no upload:", erro);

      return res.status(500).json({
        mensagem: "Erro interno ao salvar imagem."
      });
    }
  });
}

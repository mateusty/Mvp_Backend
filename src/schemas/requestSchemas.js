import { z } from "zod";
import { validate as validarUUID } from "uuid";

const textoObrigatorio = z.string().trim().min(1);
const uuid = z.string().refine(validarUUID, "ID inválido.");

export const idParamsSchema = z.object({
    id: uuid
}).strict();

export const eventIdParamsSchema = z.object({
    eventId: uuid
}).strict();

export const registerBodySchema = z.object({
    nome: textoObrigatorio,
    email: z.trim().email("Email inválido."),
    password: z.string().min(6, "A senha deve possuir pelo menos 6 caracteres.")
}).strict();

export const loginBodySchema = z.object({
    email: z.trim().email("Email inválido."),
    password: z.string().min(1, "A senha é obrigatória.")
}).strict();

const eventBodyFields = {
    atividade: textoObrigatorio,
    descricao: z.string().trim().nullable(),
    localizacao: textoObrigatorio,
    parque: textoObrigatorio,
    capacidade_maxima: z.coerce.number().positive(
        "A capacidade máxima deve ser um número maior que zero."
    ),
    data_evento: textoObrigatorio,
    google_maps_url: z.string().trim().nullable()
};

export const createEventBodySchema = z.object(eventBodyFields).strict();
export const updateEventBodySchema = z.object(eventBodyFields)
    .partial()
    .strict();

const dificuldadeSchema = z.string()
    .trim()
    .transform((value) => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
    .pipe(z.enum(["facil", "medio", "dificil"]));

const parqueSchema = z.string()
    .trim()
    .pipe(z.enum(["parnaso", "tres-picos", "montanhas-tere"]));

const trilhaBodyFields = {
    nome: textoObrigatorio,
    descricao: z.string().trim().nullable().optional(),
    dificuldade: dificuldadeSchema,
    distancia_km: z.coerce.number().positive(
        "A distância deve ser maior que zero."
    ),
    duracao_minutos: z.coerce.number().int().positive(
        "A duração deve ser um inteiro maior que zero."
    ),
    localizacao: textoObrigatorio,
    imagem_url: z.string().trim().nullable().optional(),
    parque: parqueSchema
};

export const createTrilhaBodySchema = z.object(trilhaBodyFields).strict();
export const updateTrilhaBodySchema = z.object(trilhaBodyFields)
    .partial()
    .strict();

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS trilhas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    dificuldade VARCHAR(20) NOT NULL,
    distancia_km NUMERIC(10,2) NOT NULL,
    duracao_minutos INTEGER NOT NULL,
    localizacao VARCHAR(255) NOT NULL,
    imagem_url TEXT,
    parque VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
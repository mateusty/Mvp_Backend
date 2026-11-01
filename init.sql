CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome_usuario VARCHAR(100) NOT NULL,
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

CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    atividade VARCHAR(255) NOT NULL,
    descricao TEXT,
    localizacao VARCHAR(255) NOT NULL,
    parque VARCHAR(50) NOT NULL,
    capacidade_maxima INTEGER NOT NULL,
    data_evento TIMESTAMPTZ NOT NULL,
    google_maps_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS presencas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_email_event UNIQUE (event_id, email)
);

INSERT INTO users (nome_usuario, email, password_hash, role)
VALUES (
    'Administrador',
    'admin@tereverde.com',
    '$2a$10$X7vH0W7z3Y9x2Q5v4K1e8O0Z6x3C2v1B9n8M7l6K5j4H3g2F1e0Dq',
    'admin'
)
ON CONFLICT (email) DO NOTHING;
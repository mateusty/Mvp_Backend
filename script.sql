INSERT INTO users (nome_usuario, email, password_hash, role)
VALUES (
    'Administrador',
    'admin@tereverde.com',
    '$2a$10$X7vH0W7z3Y9x2Q5v4K1e8O0Z6x3C2v1B9n8M7l6K5j4H3g2F1e0Dq',
    'admin'
)
ON CONFLICT (email) DO NOTHING;
const jwt = require("jsonwebtoken");

const usuarioTeste = {
    id: 1,
    email: "admin@gmail.com",
    password: "123456",
    role: "admin"
};

function autenticar(email, password) {

    if (
        email !== usuarioTeste.email ||
        password !== usuarioTeste.password
    ) {
        return null;
    }

    const token = jwt.sign(
        {
            id: usuarioTeste.id,
            email: usuarioTeste.email,
            role: usuarioTeste.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1h"
        }
    );

    return token;
}

module.exports = {
    autenticar
};
function somenteAdmin(req, res, next) {

    if (req.usuario.role !== "admin") {
        return res.status(403).json({
            mensagem: "Acesso negado"
        });
    }

    next();
}

module.exports = somenteAdmin;
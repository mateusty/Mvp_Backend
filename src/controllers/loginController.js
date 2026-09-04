const authService = require("../services/authService");

const doLogin = async (req, res) => {
    const hash = await authService.gerarHash("5673"); 
    res.json(hash);
}

module.exports = {
    doLogin
}
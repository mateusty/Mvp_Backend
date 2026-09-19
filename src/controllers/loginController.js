const authService = require("../services/authService");

const doLogin = async (req, res) => {
    const hash = await authService.gerarHash(req.body.password); 
    res.json(hash);
}

module.exports = {
    doLogin
}

/*node ./src/index.js*/

export function validarCampos(camposEsperados) {

    return (req, res, next) => {

        const camposRecebidos =
            Object.keys(req.body || {});


        const camposFaltando =
            camposEsperados.filter(
                campo =>
                    !camposRecebidos.includes(campo)
            );


        const camposExtras =
            camposRecebidos.filter(
                campo =>
                    !camposEsperados.includes(campo)
            );


        if (
            camposFaltando.length > 0 ||
            camposExtras.length > 0
        ) {

            return res.status(400).json({

                mensagem:
                    "Campos inválidos na requisição.",

                camposEsperados,
                camposFaltando,
                camposExtras
            });
        }


        return next();
    };
}
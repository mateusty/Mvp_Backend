export function validarCampos(esquemas) {
    return (req, res, next) => {
        for (const [origem, esquema] of Object.entries(esquemas)) {
            const resultado = esquema.safeParse(req[origem]);

            if (!resultado.success) {
                return next(resultado.error);
            }

            req[origem] = resultado.data;
        }

        return next();
    };
}
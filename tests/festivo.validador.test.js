const festivoValidador = require('../src/validadores/festivo.validador');

function crearRespuesta() {
    return {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
    };
}

describe('Validador del CRUD de festivos', () => {
    test('acepta y normaliza una fecha fija válida', () => {
        const solicitud = {
            body: { tipo: 1, dia: 29, mes: 2, nombre: ' Día especial ', diasPascua: 99 }
        };
        const respuesta = crearRespuesta();
        const siguiente = jest.fn();

        festivoValidador.validarCuerpo(solicitud, respuesta, siguiente);

        expect(siguiente).toHaveBeenCalledTimes(1);
        expect(solicitud.festivoValidado).toEqual({
            tipo: 1,
            dia: 29,
            mes: 2,
            nombre: 'Día especial',
            diasPascua: 0
        });
    });

    test('acepta una regla basada en Pascua y normaliza día y mes', () => {
        const solicitud = {
            body: { tipo: 4, dia: 15, mes: 8, nombre: 'Regla móvil', diasPascua: 50 }
        };
        const respuesta = crearRespuesta();
        const siguiente = jest.fn();

        festivoValidador.validarCuerpo(solicitud, respuesta, siguiente);

        expect(siguiente).toHaveBeenCalledTimes(1);
        expect(solicitud.festivoValidado).toEqual({
            tipo: 4,
            dia: 0,
            mes: 0,
            nombre: 'Regla móvil',
            diasPascua: 50
        });
    });

    test('rechaza fechas imposibles y nombres vacíos', () => {
        const solicitud = { body: { tipo: 1, dia: 31, mes: 4, nombre: ' ' } };
        const respuesta = crearRespuesta();
        const siguiente = jest.fn();

        festivoValidador.validarCuerpo(solicitud, respuesta, siguiente);

        expect(siguiente).not.toHaveBeenCalled();
        expect(respuesta.status).toHaveBeenCalledWith(400);
        expect(respuesta.json).toHaveBeenCalledWith(expect.objectContaining({
            mensaje: 'Los datos del festivo no son válidos.',
            errores: expect.arrayContaining([
                'El nombre debe contener entre 2 y 100 caracteres.',
                'Día y mes deben formar una fecha válida.'
            ])
        }));
    });

    test('rechaza ids no positivos', () => {
        const solicitud = { params: { id: '0' } };
        const respuesta = crearRespuesta();
        const siguiente = jest.fn();

        festivoValidador.validarId(solicitud, respuesta, siguiente);

        expect(siguiente).not.toHaveBeenCalled();
        expect(respuesta.status).toHaveBeenCalledWith(400);
    });
});

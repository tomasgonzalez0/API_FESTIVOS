const { esFechaValida } = require('../utilidades/fechas');

function esEnteroPositivo(texto) {
    return /^\d+$/.test(String(texto));
}

class FestivoValidador {
    validarFecha(solicitud, respuesta, siguiente) {
        const { anio, mes, dia } = solicitud.params;

        if (![anio, mes, dia].every(esEnteroPositivo)) {
            return respuesta.status(400).type('text/plain').send('Fecha No válida');
        }

        const valores = [anio, mes, dia].map(Number);
        if (!esFechaValida(...valores)) {
            return respuesta.status(400).type('text/plain').send('Fecha No válida');
        }

        solicitud.fechaValidada = {
            anio: valores[0],
            mes: valores[1],
            dia: valores[2]
        };
        return siguiente();
    }

    validarAnio(solicitud, respuesta, siguiente) {
        const { anio } = solicitud.params;

        if (!esEnteroPositivo(anio)) {
            return respuesta.status(400).json({ mensaje: 'El año debe ser un número entero válido.' });
        }

        const valor = Number(anio);
        if (valor < 1 || valor > 9999) {
            return respuesta.status(400).json({ mensaje: 'El año debe estar entre 1 y 9999.' });
        }

        solicitud.anioValidado = valor;
        return siguiente();
    }
}

module.exports = new FestivoValidador();

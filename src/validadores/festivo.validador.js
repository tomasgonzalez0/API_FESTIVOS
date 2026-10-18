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

    validarId(solicitud, respuesta, siguiente) {
        const { id } = solicitud.params;
        if (!esEnteroPositivo(id) || Number(id) < 1) {
            return respuesta.status(400).json({ mensaje: 'El id debe ser un número entero positivo.' });
        }

        solicitud.idValidado = Number(id);
        return siguiente();
    }

    validarNombre(solicitud, respuesta, siguiente) {
        const nombre = String(solicitud.params.nombre || '').trim();
        if (nombre.length < 2 || nombre.length > 100) {
            return respuesta.status(400).json({ mensaje: 'El nombre debe contener entre 2 y 100 caracteres.' });
        }

        solicitud.nombreValidado = nombre;
        return siguiente();
    }

    validarCuerpo(solicitud, respuesta, siguiente) {
        const { tipo, dia, mes, nombre, diasPascua } = solicitud.body || {};
        const tipoNumero = Number(tipo);
        const nombreLimpio = typeof nombre === 'string' ? nombre.trim() : '';
        const errores = [];

        if (!Number.isInteger(tipoNumero) || tipoNumero < 1 || tipoNumero > 4) {
            errores.push('El tipo debe ser un entero entre 1 y 4.');
        }
        if (nombreLimpio.length < 2 || nombreLimpio.length > 100) {
            errores.push('El nombre debe contener entre 2 y 100 caracteres.');
        }

        let festivo;
        if (tipoNumero === 1 || tipoNumero === 2) {
            const diaNumero = Number(dia);
            const mesNumero = Number(mes);
            if (!Number.isInteger(diaNumero) || !Number.isInteger(mesNumero)
                || !esFechaValida(2024, mesNumero, diaNumero)) {
                errores.push('Día y mes deben formar una fecha válida.');
            }
            festivo = {
                tipo: tipoNumero,
                dia: diaNumero,
                mes: mesNumero,
                nombre: nombreLimpio,
                diasPascua: 0
            };
        } else if (tipoNumero === 3 || tipoNumero === 4) {
            const diasNumero = Number(diasPascua);
            if (!Number.isInteger(diasNumero) || diasNumero < -366 || diasNumero > 366) {
                errores.push('diasPascua debe ser un entero entre -366 y 366.');
            }
            festivo = {
                tipo: tipoNumero,
                dia: 0,
                mes: 0,
                nombre: nombreLimpio,
                diasPascua: diasNumero
            };
        }

        if (errores.length > 0) {
            return respuesta.status(400).json({
                mensaje: 'Los datos del festivo no son válidos.',
                errores
            });
        }

        solicitud.festivoValidado = festivo;
        return siguiente();
    }
}

module.exports = new FestivoValidador();

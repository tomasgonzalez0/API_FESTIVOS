function crearFechaUTC(anio, mes, dia) {
    const fecha = new Date(0);
    fecha.setUTCHours(0, 0, 0, 0);
    fecha.setUTCFullYear(anio, mes - 1, dia);
    return fecha;
}

function obtenerDomingoDeRamos(anio) {
    const a = anio % 19;
    const b = anio % 4;
    const c = anio % 7;
    const d = ((19 * a) + 24) % 30;
    const dias = d + (((2 * b) + (4 * c) + (6 * d) + 5) % 7);

    return crearFechaUTC(anio, 3, 15 + dias);
}

function agregarDias(fecha, dias) {
    const resultado = new Date(fecha);
    resultado.setUTCDate(resultado.getUTCDate() + dias);
    return resultado;
}

function obtenerDomingoDePascua(anio) {
    return agregarDias(obtenerDomingoDeRamos(anio), 7);
}

function siguienteLunes(fecha) {
    const resultado = new Date(fecha);
    const diasASumar = (8 - resultado.getUTCDay()) % 7;
    resultado.setUTCDate(resultado.getUTCDate() + diasASumar);
    return resultado;
}

function formatearFechaISO(fecha) {
    return fecha.toISOString().slice(0, 10);
}

function esFechaValida(anio, mes, dia) {
    if (![anio, mes, dia].every(Number.isInteger)) {
        return false;
    }

    if (anio < 1 || anio > 9999 || mes < 1 || mes > 12 || dia < 1 || dia > 31) {
        return false;
    }

    const fecha = crearFechaUTC(anio, mes, dia);
    return fecha.getUTCFullYear() === anio
        && fecha.getUTCMonth() === mes - 1
        && fecha.getUTCDate() === dia;
}

module.exports = {
    crearFechaUTC,
    obtenerDomingoDeRamos,
    agregarDias,
    obtenerDomingoDePascua,
    siguienteLunes,
    formatearFechaISO,
    esFechaValida
};

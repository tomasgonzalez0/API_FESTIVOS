/**
 * Convierte el esquema de persistencia en el modelo plano que usa el servicio.
 * Así, la lógica de negocio no conoce la estructura interna de MongoDB.
 */
function crearFestivo({ tipo, dia = 0, mes = 0, nombre, diasPascua = 0 }) {
    return {
        tipo: Number(tipo),
        dia: Number(dia || 0),
        mes: Number(mes || 0),
        nombre: String(nombre || '').trim(),
        diasPascua: Number(diasPascua || 0)
    };
}

module.exports = { crearFestivo };

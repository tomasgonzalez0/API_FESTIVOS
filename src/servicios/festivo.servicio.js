const festivoRepositorio = require('../repositorios/festivo.repositorio');
const {
    crearFechaUTC,
    obtenerDomingoDePascua,
    agregarDias,
    siguienteLunes,
    formatearFechaISO
} = require('../utilidades/fechas');

class FestivoServicio {
    constructor(repositorio = festivoRepositorio) {
        this.repositorio = repositorio;
    }

    calcularFecha(festivo, anio, domingoPascua) {
        switch (festivo.tipo) {
            case 1:
                return crearFechaUTC(anio, festivo.mes, festivo.dia);
            case 2:
                return siguienteLunes(crearFechaUTC(anio, festivo.mes, festivo.dia));
            case 3:
                return agregarDias(domingoPascua, festivo.diasPascua);
            case 4:
                return siguienteLunes(agregarDias(domingoPascua, festivo.diasPascua));
            default:
                throw new Error(`Tipo de festivo no soportado: ${festivo.tipo}`);
        }
    }

    async obtenerPorAnio(anio) {
        const reglas = await this.repositorio.obtenerTodos();
        const domingoPascua = obtenerDomingoDePascua(anio);

        return reglas
            .map((festivo) => {
                const fecha = this.calcularFecha(festivo, anio, domingoPascua);
                return {
                    festivo: festivo.nombre,
                    fecha: formatearFechaISO(fecha)
                };
            })
            .sort((primero, segundo) => primero.fecha.localeCompare(segundo.fecha));
    }

    async verificar(anio, mes, dia) {
        const fechaConsultada = formatearFechaISO(crearFechaUTC(anio, mes, dia));
        const festivos = await this.obtenerPorAnio(anio);
        return festivos.some((festivo) => festivo.fecha === fechaConsultada);
    }
}

module.exports = new FestivoServicio();
module.exports.FestivoServicio = FestivoServicio;

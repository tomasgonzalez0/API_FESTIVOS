const festivoServicio = require('../servicios/festivo.servicio');

class FestivoControlador {
    async verificar(solicitud, respuesta) {
        try {
            const { anio, mes, dia } = solicitud.fechaValidada;
            const esFestivo = await festivoServicio.verificar(anio, mes, dia);
            return respuesta.type('text/plain').send(esFestivo ? 'Es Festivo' : 'No es festivo');
        } catch (error) {
            console.error('Error verificando la fecha:', error);
            return respuesta.status(500).json({ mensaje: 'Error interno verificando la fecha.' });
        }
    }

    async obtener(solicitud, respuesta) {
        try {
            const festivos = await festivoServicio.obtenerPorAnio(solicitud.anioValidado);
            return respuesta.json(festivos);
        } catch (error) {
            console.error('Error obteniendo los festivos:', error);
            return respuesta.status(500).json({ mensaje: 'Error interno obteniendo los festivos.' });
        }
    }
}

module.exports = new FestivoControlador();

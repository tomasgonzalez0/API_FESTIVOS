const festivoServicio = require('../servicios/festivo.servicio');

class FestivoControlador {
    manejarError(respuesta, error, operacion) {
        console.error(`Error ${operacion} el festivo:`, error);
        return respuesta.status(500).json({ mensaje: `Error interno ${operacion} el festivo.` });
    }

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

    async listar(solicitud, respuesta) {
        try {
            return respuesta.json(await festivoServicio.listar());
        } catch (error) {
            return this.manejarError(respuesta, error, 'listando');
        }
    }

    async obtenerPorId(solicitud, respuesta) {
        try {
            const festivo = await festivoServicio.obtenerPorId(solicitud.idValidado);
            if (!festivo) {
                return respuesta.status(404).json({ mensaje: 'Festivo no encontrado.' });
            }
            return respuesta.json(festivo);
        } catch (error) {
            return this.manejarError(respuesta, error, 'consultando');
        }
    }

    async crear(solicitud, respuesta) {
        try {
            const festivo = await festivoServicio.crear(solicitud.festivoValidado);
            return respuesta.status(201).json(festivo);
        } catch (error) {
            return this.manejarError(respuesta, error, 'creando');
        }
    }

    async actualizar(solicitud, respuesta) {
        try {
            const festivo = await festivoServicio.actualizar(
                solicitud.idValidado,
                solicitud.festivoValidado
            );
            if (!festivo) {
                return respuesta.status(404).json({ mensaje: 'Festivo no encontrado.' });
            }
            return respuesta.json(festivo);
        } catch (error) {
            return this.manejarError(respuesta, error, 'actualizando');
        }
    }

    async eliminar(solicitud, respuesta) {
        try {
            const festivo = await festivoServicio.eliminar(solicitud.idValidado);
            if (!festivo) {
                return respuesta.status(404).json({ mensaje: 'Festivo no encontrado.' });
            }
            return respuesta.json({ mensaje: 'Festivo eliminado correctamente.', festivo });
        } catch (error) {
            return this.manejarError(respuesta, error, 'eliminando');
        }
    }
}

module.exports = new FestivoControlador();

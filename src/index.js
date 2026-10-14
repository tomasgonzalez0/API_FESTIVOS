require('dotenv').config();

const express = require('express');
const conexionBD = require('./config/db');
const festivoRutas = require('./rutas/festivo.rutas');
const { configurarSwagger } = require('./config/swagger');

function crearAplicacion() {
    const aplicacion = express();

    aplicacion.use(express.json());
    aplicacion.use(express.urlencoded({ extended: true }));
    configurarSwagger(aplicacion);

    aplicacion.get('/', (solicitud, respuesta) => respuesta.json({ estado: 'Online' }));
    aplicacion.use('/api/festivos', festivoRutas);

    aplicacion.use((solicitud, respuesta) => {
        respuesta.status(404).json({ mensaje: 'Ruta no encontrada.' });
    });

    return aplicacion;
}

async function iniciar() {
    try {
        await conexionBD.conectar();
        const puerto = Number(process.env.PORT || 3030);
        const aplicacion = crearAplicacion();

        aplicacion.listen(puerto, () => {
            console.log(`API Festivos disponible en http://localhost:${puerto}`);
            console.log(`Swagger UI disponible en http://localhost:${puerto}/api-docs`);
        });
    } catch (error) {
        console.error('No fue posible iniciar la API Festivos:', error.message);
        process.exitCode = 1;
    }
}

if (require.main === module) {
    iniciar();
}

module.exports = { crearAplicacion, iniciar };

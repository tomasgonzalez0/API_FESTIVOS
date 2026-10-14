const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

function configurarSwagger(aplicacion) {
    const puerto = process.env.PORT || 3030;
    const especificacion = swaggerJsDoc({
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'API Festivos',
                version: '1.0.0',
                description: 'Consulta y cálculo de días festivos a partir de reglas almacenadas en MongoDB.'
            },
            servers: [
                {
                    url: `http://localhost:${puerto}`,
                    description: 'Servidor local'
                }
            ]
        },
        apis: ['./src/rutas/*.js']
    });

    aplicacion.use('/api-docs', swaggerUi.serve, swaggerUi.setup(especificacion));
}

module.exports = { configurarSwagger };

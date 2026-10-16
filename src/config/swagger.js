const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

function configurarSwagger(aplicacion) {
    const puerto = process.env.PORT || 3030;
    const especificacion = swaggerJsDoc({
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'API Festivos',
                version: '1.1.0',
                description: 'CRUD, consulta y cálculo de días festivos a partir de reglas almacenadas en MongoDB.'
            },
            components: {
                parameters: {
                    FestivoId: {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'integer', minimum: 1, example: 101 }
                    }
                },
                schemas: {
                    FestivoEntrada: {
                        type: 'object',
                        required: ['tipo', 'nombre'],
                        properties: {
                            tipo: {
                                type: 'integer',
                                minimum: 1,
                                maximum: 4,
                                description: '1 fijo, 2 siguiente lunes, 3 Pascua, 4 Pascua y siguiente lunes',
                                example: 1
                            },
                            dia: { type: 'integer', minimum: 1, maximum: 31, example: 1 },
                            mes: { type: 'integer', minimum: 1, maximum: 12, example: 1 },
                            nombre: { type: 'string', minLength: 2, maxLength: 100, example: 'Año nuevo' },
                            diasPascua: { type: 'integer', minimum: -366, maximum: 366, example: 0 }
                        }
                    },
                    Festivo: {
                        allOf: [
                            {
                                type: 'object',
                                required: ['id'],
                                properties: { id: { type: 'integer', example: 101 } }
                            },
                            { $ref: '#/components/schemas/FestivoEntrada' }
                        ]
                    }
                }
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

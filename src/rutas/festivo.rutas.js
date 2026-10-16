const express = require('express');
const festivoValidador = require('../validadores/festivo.validador');
const festivoControlador = require('../controladores/festivo.controlador');

const router = express.Router();

/**
 * @swagger
 * /api/festivos:
 *   get:
 *     summary: Lista todas las reglas de festivos
 *     tags: [Festivos CRUD]
 *     responses:
 *       200:
 *         description: Lista completa de festivos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Festivo' }
 *   post:
 *     summary: Crea un festivo
 *     tags: [Festivos CRUD]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/FestivoEntrada' }
 *     responses:
 *       201:
 *         description: Festivo creado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Festivo' }
 *       400: { description: Datos inválidos }
 */
router.get('/', (solicitud, respuesta) => festivoControlador.listar(solicitud, respuesta));
router.post(
    '/',
    (solicitud, respuesta, siguiente) => festivoValidador.validarCuerpo(solicitud, respuesta, siguiente),
    (solicitud, respuesta) => festivoControlador.crear(solicitud, respuesta)
);

/**
 * @swagger
 * /api/festivos/verificar/{anio}/{mes}/{dia}:
 *   get:
 *     summary: Determina si una fecha es festiva
 *     tags: [Festivos]
 *     parameters:
 *       - in: path
 *         name: anio
 *         required: true
 *         schema: { type: integer, example: 2024 }
 *       - in: path
 *         name: mes
 *         required: true
 *         schema: { type: integer, minimum: 1, maximum: 12, example: 7 }
 *       - in: path
 *         name: dia
 *         required: true
 *         schema: { type: integer, minimum: 1, maximum: 31, example: 20 }
 *     responses:
 *       200:
 *         description: Resultado de la verificación
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               enum: [Es Festivo, No es festivo]
 *             examples:
 *               festivo: { value: Es Festivo }
 *               noFestivo: { value: No es festivo }
 *       400:
 *         description: La fecha no existe o contiene parámetros no numéricos
 *         content:
 *           text/plain:
 *             schema: { type: string, example: Fecha No válida }
 */
router.get(
    '/verificar/:anio/:mes/:dia',
    (solicitud, respuesta, siguiente) => festivoValidador.validarFecha(solicitud, respuesta, siguiente),
    (solicitud, respuesta) => festivoControlador.verificar(solicitud, respuesta)
);

/**
 * @swagger
 * /api/festivos/obtener/{anio}:
 *   get:
 *     summary: Obtiene los festivos calculados para un año
 *     tags: [Festivos]
 *     parameters:
 *       - in: path
 *         name: anio
 *         required: true
 *         schema: { type: integer, example: 2025 }
 *     responses:
 *       200:
 *         description: Lista de festivos ordenada por fecha
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 required: [festivo, fecha]
 *                 properties:
 *                   festivo: { type: string, example: Año nuevo }
 *                   fecha: { type: string, format: date, example: 2025-01-01 }
 *       400:
 *         description: Año inválido
 */
router.get(
    '/obtener/:anio',
    (solicitud, respuesta, siguiente) => festivoValidador.validarAnio(solicitud, respuesta, siguiente),
    (solicitud, respuesta) => festivoControlador.obtener(solicitud, respuesta)
);

/**
 * @swagger
 * /api/festivos/{id}:
 *   get:
 *     summary: Obtiene una regla de festivo por id
 *     tags: [Festivos CRUD]
 *     parameters:
 *       - $ref: '#/components/parameters/FestivoId'
 *     responses:
 *       200:
 *         description: Festivo encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Festivo' }
 *       404: { description: Festivo no encontrado }
 *   put:
 *     summary: Reemplaza una regla de festivo
 *     tags: [Festivos CRUD]
 *     parameters:
 *       - $ref: '#/components/parameters/FestivoId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/FestivoEntrada' }
 *     responses:
 *       200:
 *         description: Festivo actualizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Festivo' }
 *       400: { description: Datos inválidos }
 *       404: { description: Festivo no encontrado }
 *   delete:
 *     summary: Elimina una regla de festivo
 *     tags: [Festivos CRUD]
 *     parameters:
 *       - $ref: '#/components/parameters/FestivoId'
 *     responses:
 *       200: { description: Festivo eliminado }
 *       404: { description: Festivo no encontrado }
 */
router.get(
    '/:id',
    (solicitud, respuesta, siguiente) => festivoValidador.validarId(solicitud, respuesta, siguiente),
    (solicitud, respuesta) => festivoControlador.obtenerPorId(solicitud, respuesta)
);
router.put(
    '/:id',
    (solicitud, respuesta, siguiente) => festivoValidador.validarId(solicitud, respuesta, siguiente),
    (solicitud, respuesta, siguiente) => festivoValidador.validarCuerpo(solicitud, respuesta, siguiente),
    (solicitud, respuesta) => festivoControlador.actualizar(solicitud, respuesta)
);
router.delete(
    '/:id',
    (solicitud, respuesta, siguiente) => festivoValidador.validarId(solicitud, respuesta, siguiente),
    (solicitud, respuesta) => festivoControlador.eliminar(solicitud, respuesta)
);

module.exports = router;

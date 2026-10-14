const express = require('express');
const festivoValidador = require('../validadores/festivo.validador');
const festivoControlador = require('../controladores/festivo.controlador');

const router = express.Router();

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

module.exports = router;

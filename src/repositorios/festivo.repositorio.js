const conexionBD = require('../config/db');
const { crearFestivo } = require('../modelos/festivo.modelo');

class FestivoRepositorio {
    constructor() {
        this.nombreColeccion = 'tipos';
    }

    get coleccion() {
        return conexionBD.obtenerBD().collection(this.nombreColeccion);
    }

    async obtenerTodos() {
        const documentos = await this.coleccion.aggregate([
            { $unwind: '$festivos' },
            {
                $project: {
                    _id: 0,
                    id: '$festivos.id',
                    tipo: '$id',
                    dia: { $ifNull: ['$festivos.dia', 0] },
                    mes: { $ifNull: ['$festivos.mes', 0] },
                    nombre: '$festivos.nombre',
                    diasPascua: { $ifNull: ['$festivos.diasPascua', 0] }
                }
            },
            { $sort: { id: 1 } }
        ]).toArray();

        return documentos.map(crearFestivo);
    }

    async obtenerPorId(id) {
        const documentos = await this.coleccion.aggregate([
            { $match: { 'festivos.id': id } },
            { $unwind: '$festivos' },
            { $match: { 'festivos.id': id } },
            {
                $project: {
                    _id: 0,
                    id: '$festivos.id',
                    tipo: '$id',
                    dia: { $ifNull: ['$festivos.dia', 0] },
                    mes: { $ifNull: ['$festivos.mes', 0] },
                    nombre: '$festivos.nombre',
                    diasPascua: { $ifNull: ['$festivos.diasPascua', 0] }
                }
            }
        ]).next();

        return documentos ? crearFestivo(documentos) : null;
    }

    async obtenerSiguienteId() {
        const resultado = await this.coleccion.aggregate([
            { $unwind: '$festivos' },
            { $group: { _id: null, maximo: { $max: '$festivos.id' } } }
        ]).next();

        return Number(resultado?.maximo || 0) + 1;
    }

    async crear(datos) {
        const id = await this.obtenerSiguienteId();
        const festivo = crearFestivo({ ...datos, id });
        const resultado = await this.coleccion.updateOne(
            { id: festivo.tipo },
            { $push: { festivos: festivo } }
        );

        if (resultado.matchedCount === 0) {
            throw new Error(`No existe el tipo de festivo ${festivo.tipo}.`);
        }

        return festivo;
    }

    async actualizar(id, datos) {
        const actual = await this.obtenerPorId(id);
        if (!actual) {
            return null;
        }

        const actualizado = crearFestivo({ ...datos, id });
        if (actual.tipo === actualizado.tipo) {
            await this.coleccion.updateOne(
                { id: actual.tipo, 'festivos.id': id },
                { $set: { 'festivos.$': actualizado } }
            );
            return actualizado;
        }

        const tipoDestino = await this.coleccion.findOne({ id: actualizado.tipo }, { projection: { _id: 1 } });
        if (!tipoDestino) {
            throw new Error(`No existe el tipo de festivo ${actualizado.tipo}.`);
        }

        await this.coleccion.updateOne(
            { id: actual.tipo },
            { $pull: { festivos: { id } } }
        );

        try {
            await this.coleccion.updateOne(
                { id: actualizado.tipo },
                { $push: { festivos: actualizado } }
            );
            return actualizado;
        } catch (error) {
            await this.coleccion.updateOne(
                { id: actual.tipo },
                { $push: { festivos: actual } }
            );
            throw error;
        }
    }

    async eliminar(id) {
        const actual = await this.obtenerPorId(id);
        if (!actual) {
            return null;
        }

        await this.coleccion.updateOne(
            { id: actual.tipo },
            { $pull: { festivos: { id } } }
        );
        return actual;
    }
}

module.exports = new FestivoRepositorio();

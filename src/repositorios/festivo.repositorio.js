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
                    tipo: '$id',
                    dia: { $ifNull: ['$festivos.dia', 0] },
                    mes: { $ifNull: ['$festivos.mes', 0] },
                    nombre: '$festivos.nombre',
                    diasPascua: { $ifNull: ['$festivos.diasPascua', 0] }
                }
            }
        ]).toArray();

        return documentos.map(crearFestivo);
    }
}

module.exports = new FestivoRepositorio();

require('dotenv').config();

const conexionBD = require('../src/config/db');

const tipos = [
    {
        id: 1,
        tipo: 'Fijo',
        modoCalculo: 'No se puede variar',
        festivos: [
            { dia: 1, mes: 1, nombre: 'Año nuevo' },
            { dia: 1, mes: 5, nombre: 'Día del Trabajo' },
            { dia: 20, mes: 7, nombre: 'Independencia Colombia' },
            { dia: 7, mes: 8, nombre: 'Batalla de Boyacá' },
            { dia: 8, mes: 12, nombre: 'Inmaculada Concepción' },
            { dia: 25, mes: 12, nombre: 'Navidad' }
        ]
    },
    {
        id: 2,
        tipo: 'Ley de Puente festivo',
        modoCalculo: 'Se traslada la fecha al siguiente lunes',
        festivos: [
            { dia: 6, mes: 1, nombre: 'Santos Reyes' },
            { dia: 19, mes: 3, nombre: 'San José' },
            { dia: 29, mes: 6, nombre: 'San Pedro y San Pablo' },
            { dia: 15, mes: 8, nombre: 'Asunción de la Virgen' },
            { dia: 12, mes: 10, nombre: 'Día de la Raza' },
            { dia: 1, mes: 11, nombre: 'Todos los santos' },
            { dia: 11, mes: 11, nombre: 'Independencia de Cartagena' }
        ]
    },
    {
        id: 3,
        tipo: 'Basado en el domingo de Pascua',
        modoCalculo: 'Se suma la cantidad de días indicada al domingo de Pascua',
        festivos: [
            { dia: 0, mes: 0, nombre: 'Jueves Santo', diasPascua: -3 },
            { dia: 0, mes: 0, nombre: 'Viernes Santo', diasPascua: -2 },
            { dia: 0, mes: 0, nombre: 'Domingo de Pascua', diasPascua: 0 }
        ]
    },
    {
        id: 4,
        tipo: 'Pascua y Ley de Puente festivo',
        modoCalculo: 'Se suma a Pascua y se traslada al siguiente lunes',
        festivos: [
            { dia: 0, mes: 0, nombre: 'Ascensión del Señor', diasPascua: 40 },
            { dia: 0, mes: 0, nombre: 'Corpus Christi', diasPascua: 61 },
            { dia: 0, mes: 0, nombre: 'Sagrado Corazón de Jesús', diasPascua: 68 }
        ]
    }
];

async function ejecutarSeed() {
    try {
        const baseDatos = await conexionBD.conectar();
        const coleccion = baseDatos.collection('tipos');

        await coleccion.bulkWrite(
            tipos.map((tipo) => ({
                updateOne: {
                    filter: { id: tipo.id },
                    update: { $set: tipo },
                    upsert: true
                }
            }))
        );
        await coleccion.createIndex({ id: 1 }, { unique: true, name: 'ix_tipos_id' });

        console.log('Datos de festivos cargados correctamente.');
    } finally {
        await conexionBD.cerrar();
    }
}

ejecutarSeed().catch((error) => {
    console.error('Error cargando los festivos:', error);
    process.exitCode = 1;
});

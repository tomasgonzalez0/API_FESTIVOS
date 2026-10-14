const { MongoClient } = require('mongodb');

class ConexionBD {
    constructor() {
        this.cliente = null;
        this.baseDatos = null;
    }

    async conectar() {
        if (this.baseDatos) {
            return this.baseDatos;
        }

        const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
        const nombreBD = process.env.DB_NAME || 'festivos';

        this.cliente = new MongoClient(uri);
        await this.cliente.connect();
        this.baseDatos = this.cliente.db(nombreBD);
        console.log(`Conexión establecida con MongoDB: ${nombreBD}`);

        return this.baseDatos;
    }

    obtenerBD() {
        if (!this.baseDatos) {
            throw new Error('La conexión con MongoDB no ha sido inicializada.');
        }

        return this.baseDatos;
    }

    async cerrar() {
        if (this.cliente) {
            await this.cliente.close();
        }

        this.cliente = null;
        this.baseDatos = null;
    }
}

module.exports = new ConexionBD();

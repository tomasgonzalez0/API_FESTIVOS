const { FestivoServicio } = require('../src/servicios/festivo.servicio');

const reglas = [
    { tipo: 1, dia: 20, mes: 7, nombre: 'Independencia Colombia', diasPascua: 0 },
    { tipo: 2, dia: 6, mes: 1, nombre: 'Santos Reyes', diasPascua: 0 },
    { tipo: 2, dia: 29, mes: 6, nombre: 'San Pedro y San Pablo', diasPascua: 0 },
    { tipo: 3, dia: 0, mes: 0, nombre: 'Domingo de Pascua', diasPascua: 0 },
    { tipo: 4, dia: 0, mes: 0, nombre: 'Corpus Christi', diasPascua: 61 },
    { tipo: 4, dia: 0, mes: 0, nombre: 'Sagrado Corazón de Jesús', diasPascua: 68 }
];

function crearServicio() {
    return new FestivoServicio({
        obtenerTodos: jest.fn().mockResolvedValue(reglas),
        obtenerPorId: jest.fn(),
        crear: jest.fn(),
        actualizar: jest.fn(),
        eliminar: jest.fn()
    });
}

describe('Servicio de festivos', () => {
    test('calcula y ordena los festivos de 2024', async () => {
        const resultado = await crearServicio().obtenerPorAnio(2024);

        expect(resultado).toContainEqual({ festivo: 'Santos Reyes', fecha: '2024-01-08' });
        expect(resultado).toContainEqual({ festivo: 'Domingo de Pascua', fecha: '2024-03-31' });
        expect(resultado).toContainEqual({ festivo: 'Corpus Christi', fecha: '2024-06-03' });
        expect(resultado).toContainEqual({ festivo: 'Sagrado Corazón de Jesús', fecha: '2024-06-10' });
        expect(resultado.map(({ fecha }) => fecha)).toEqual(
            [...resultado.map(({ fecha }) => fecha)].sort()
        );
    });

    test('mantiene un festivo de tipo fijo aunque caiga domingo', async () => {
        const resultado = await crearServicio().obtenerPorAnio(2025);
        expect(resultado).toContainEqual({
            festivo: 'Independencia Colombia',
            fecha: '2025-07-20'
        });
    });

    test('calcula los traslados esperados de 2025', async () => {
        const resultado = await crearServicio().obtenerPorAnio(2025);

        expect(resultado).toContainEqual({ festivo: 'Santos Reyes', fecha: '2025-01-06' });
        expect(resultado).toContainEqual({ festivo: 'Corpus Christi', fecha: '2025-06-23' });
        expect(resultado).toContainEqual({
            festivo: 'Sagrado Corazón de Jesús',
            fecha: '2025-06-30'
        });
    });

    test('conserva festivos distintos que coinciden en una fecha', async () => {
        const resultado = await crearServicio().obtenerPorAnio(2025);
        const nombres = resultado
            .filter(({ fecha }) => fecha === '2025-06-30')
            .map(({ festivo }) => festivo);

        expect(nombres).toEqual(expect.arrayContaining([
            'San Pedro y San Pablo',
            'Sagrado Corazón de Jesús'
        ]));
    });

    test('verifica fechas festivas y no festivas', async () => {
        const servicio = crearServicio();
        await expect(servicio.verificar(2024, 7, 20)).resolves.toBe(true);
        await expect(servicio.verificar(2024, 7, 21)).resolves.toBe(false);
    });

    test('rechaza tipos de cálculo desconocidos', () => {
        const servicio = crearServicio();
        expect(() => servicio.calcularFecha({ tipo: 99 }, 2025, new Date())).toThrow(
            'Tipo de festivo no soportado: 99'
        );
    });

    test('delega las operaciones CRUD al repositorio', async () => {
        const repositorio = {
            obtenerTodos: jest.fn().mockResolvedValue(reglas),
            obtenerPorId: jest.fn().mockResolvedValue(reglas[0]),
            obtenerPorNombre: jest.fn().mockResolvedValue([reglas[0]]),
            crear: jest.fn().mockResolvedValue({ id: 404, ...reglas[0] }),
            actualizar: jest.fn().mockResolvedValue({ id: 404, ...reglas[1] }),
            eliminar: jest.fn().mockResolvedValue({ id: 404, ...reglas[1] })
        };
        const servicio = new FestivoServicio(repositorio);

        await expect(servicio.listar()).resolves.toBe(reglas);
        await expect(servicio.obtenerPorId(103)).resolves.toBe(reglas[0]);
        await expect(servicio.obtenerPorNombre('Independencia')).resolves.toEqual([reglas[0]]);
        await expect(servicio.crear(reglas[0])).resolves.toEqual({ id: 404, ...reglas[0] });
        await expect(servicio.actualizar(404, reglas[1])).resolves.toEqual({ id: 404, ...reglas[1] });
        await expect(servicio.eliminar(404)).resolves.toEqual({ id: 404, ...reglas[1] });

        expect(repositorio.obtenerPorId).toHaveBeenCalledWith(103);
        expect(repositorio.obtenerPorNombre).toHaveBeenCalledWith('Independencia');
        expect(repositorio.crear).toHaveBeenCalledWith(reglas[0]);
        expect(repositorio.actualizar).toHaveBeenCalledWith(404, reglas[1]);
        expect(repositorio.eliminar).toHaveBeenCalledWith(404);
    });
});

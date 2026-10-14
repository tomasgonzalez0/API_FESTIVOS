const {
    crearFechaUTC,
    obtenerDomingoDeRamos,
    agregarDias,
    obtenerDomingoDePascua,
    siguienteLunes,
    formatearFechaISO,
    esFechaValida
} = require('../src/utilidades/fechas');

describe('Utilidades de fechas', () => {
    test.each([
        [2024, '2024-03-24'],
        [2026, '2026-03-29']
    ])('calcula el Domingo de Ramos de %i', (anio, esperado) => {
        expect(formatearFechaISO(obtenerDomingoDeRamos(anio))).toBe(esperado);
    });

    test.each([
        [2024, '2024-03-31'],
        [2025, '2025-04-20'],
        [2026, '2026-04-05']
    ])('calcula el Domingo de Pascua de %i', (anio, esperado) => {
        expect(formatearFechaISO(obtenerDomingoDePascua(anio))).toBe(esperado);
    });

    test('agregarDias acepta negativos y no modifica la fecha original', () => {
        const original = crearFechaUTC(2025, 4, 20);
        const resultado = agregarDias(original, -3);

        expect(formatearFechaISO(resultado)).toBe('2025-04-17');
        expect(formatearFechaISO(original)).toBe('2025-04-20');
    });

    test('siguienteLunes no mueve una fecha que ya es lunes', () => {
        const lunes = crearFechaUTC(2025, 1, 6);
        expect(formatearFechaISO(siguienteLunes(lunes))).toBe('2025-01-06');
    });

    test('siguienteLunes traslada cualquier otro día', () => {
        const sabado = crearFechaUTC(2024, 1, 6);
        expect(formatearFechaISO(siguienteLunes(sabado))).toBe('2024-01-08');
    });

    test.each([
        [2024, 2, 29, true],
        [2025, 2, 29, false],
        [2025, 2, 30, false],
        [2026, 13, 1, false]
    ])('valida la fecha %i/%i/%i', (anio, mes, dia, esperado) => {
        expect(esFechaValida(anio, mes, dia)).toBe(esperado);
    });
});

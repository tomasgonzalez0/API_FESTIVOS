# API Festivos

API REST desarrollada con Node.js, Express y MongoDB para calcular los días
festivos de un año y verificar si una fecha determinada es festiva.

## Arquitectura

La aplicación respeta el siguiente flujo por capas:

```text
Cliente -> index.js -> Rutas -> Validador -> Controlador
        -> Servicio -> Repositorio -> MongoDB
```

- Las rutas solo conectan middlewares y controladores.
- Los validadores comprueban parámetros y fechas reales.
- Los controladores construyen las respuestas HTTP.
- El servicio aplica las cuatro reglas de cálculo.
- El repositorio es el único componente que conoce MongoDB.

La colección `tipos` conserva el esquema entregado por el profesor: cada documento
representa uno de los cuatro modos de cálculo e incluye un arreglo `festivos`. El
repositorio transforma esos arreglos en un modelo plano antes de entregarlos al
servicio.

## Requisitos

- Node.js 20 o superior.
- MongoDB 7 o superior disponible localmente o mediante una URI remota.

## Instalación

```bash
git clone https://github.com/tomasgonzalez0/API_FESTIVOS.git
cd API_FESTIVOS
npm install
```

Copia `.env.example` como `.env` y ajusta los valores:

```env
PORT=3030
MONGODB_URI=mongodb://127.0.0.1:27017
DB_NAME=festivos
```

Carga o actualiza idempotentemente los festivos de ejemplo:

```bash
npm run seed
```

Inicia la API:

```bash
npm start
```

- API: `http://localhost:3030`
- Swagger UI: `http://localhost:3030/api-docs`

## Endpoints

### Verificar una fecha

```bash
curl http://localhost:3030/api/festivos/verificar/2024/7/20
```

Responde como texto plano con `Es Festivo`, `No es festivo` o, para una fecha
imposible, `Fecha No válida`.

### Obtener los festivos de un año

```bash
curl http://localhost:3030/api/festivos/obtener/2025
```

Responde una lista JSON ordenada ascendentemente:

```json
[
  {
    "festivo": "Año nuevo",
    "fecha": "2025-01-01"
  }
]
```

## Pruebas

```bash
npm test
```

Las pruebas cubren años bisiestos, fechas inválidas, cálculo de Domingo de Ramos y
Pascua, traslados al lunes y las reglas de los cuatro tipos de festivo.

# 02 · Arquitectura del taller

Antes de escribir código conviene entender el mapa: dos servicios, dos puertos,
una sola puerta HTTP y un juez automático.

## Visión general

```text
+-----------------------------+          Fetch (api.js)          +---------------------------+
| Frontend · React 19 + Vite  |  ----------------------------->  | Backend · Django 6 + DRF  |
| Panel de Arenas (:5173)     |  GET /api/estado/ y retos        | API REST (:8000)          |
+-----------------------------+  <-----------------------------  |      |                    |
            |                          JSON (o bloqueo CORS)      |      v                    |
            v                                                     | PostgreSQL 18 (la bóveda) |
  localStorage: misiones aprobadas                                  +---------------------------+
```

- El **frontend** no contiene lógica de negocio: es el tablero que reta,
  verifica y aprueba.
- El **backend** empieza casi vacío a propósito: solo trae la batería de
  diagnóstico. El estudiante construye modelo, serializer, vistas y rutas.
- **PostgreSQL** es la bóveda. SQLite está prohibido (la batería lo detecta).

## Carpeta Backend

```text
Backend/
├── .env                 ← credenciales reales (NO sube a git)
├── .env.example         ← plantilla a copiar en el Mini 1
├── requirements.txt     ← Django 6, DRF, cors-headers, psycopg, Faker, dotenv
├── generar_datos.py     ← inyector masivo de contratos (instructores)
├── manage.py
├── config/              ← proyecto Django (settings, urls raíz)
│   ├── settings.py      ← lee el .env; bloque TODO (RETO 9) y (RETO 14)
│   └── urls.py          ← monta /admin/ y /api/ (app contratos)
└── contratos/           ← la única app
    ├── models.py        ← TODO (RETO 2): el modelo Contrato
    ├── serializers.py   ← TODO (RETO 4): el ContratoSerializer
    ├── views.py         ← batería (lista) + TODO (RETO 5, 11-15)
    ├── urls.py          ← rutas: estado/ activa; resto con los retos
    └── admin.py         ← TODO (RETO 3): registro del modelo
```

## Carpeta Frontend

```text
Frontend/
├── vite.config.js       ← Vite 8 en el puerto 5173
└── src/
    ├── api.js           ← LA ÚNICA puerta HTTP hacia Django
    ├── estadoMisiones.js← tablero de progreso (localStorage)
    ├── App.jsx          ← hub de arenas: acordeón, candados, Modo instructor
    ├── MisionMarco.jsx  ← marco visual de cada misión (título, estado, teoría)
    ├── Cronometro.jsx   ← cronómetro de milisegundos para los retos de velocidad
    ├── dia1/ ... dia3/  ← 15 componentes: uno por misión
    └── index.css / App.css
```

### La única puerta: `src/api.js`

Todas las misiones hablan con el backend **solo** a través de `api.js`. Ese
mismo archivo clasifica los posibles errores y los convierte en pistas legibles
para un aprendiz:

- `API_URL = 'http://127.0.0.1:8000/api'` — Django en el 8000, React en el
  5173: son dos orígenes distintos, y eso da origen al reto del Portero.
- `peticion(ruta, opciones)` — devuelve `{ respuesta, ms }` con el tiempo de
  viaje medido. Solo lanza cuando la petición **nunca cruzó el puerto**
  (servidor apagado, URL mal escrita o CORS bloqueando): lanza `FallaApi`
  tipo `'cors'`.
- `pedirOExplotar(...)` — exige un HTTP 2xx válida y cuerpo JSON; cualquier
  otro caso lanza una `FallaApi` con la pista (`PISTAS_HTTP`).
- Para los retos, un código HTTP "malo" puede ser la **victoria** (por ejemplo
  el 400 del Escudo): por eso las misiones no usan `pedirOExplotar`
  indiscriminadamente, sino que deciden con la respuesta cruda.

### El tablero: `src/estadoMisiones.js`

- `MISIONES` define las 15 misiones (número, día, alias `Mini n` y título).
- El progreso vive en `localStorage` (clave `taller-secop-misiones-aprobadas`)
  como una lista de números. Sin backend ni cuentas: el progreso viaja con el
  navegador del estudiante.
- El **Modo instructor** (clave `taller-secop-modo-instructor`) desbloquea
  todas las misiones para ensayar la clase.
- Los días futuros se bloquean hasta completar los anteriores.

### La batería de diagnóstico: `GET /api/estado/`

`EstadoJardinView` en `Backend/contratos/views.py` es el **juez del taller**:
el estudiante no la borra ni la modifica. Devuelve banderas que las misiones
de React traducen a Aprobado / Aún-no:

| Bandera | Qué verifica | Misión asociada |
|---|---|---|
| `base_datos` | El motor de `DATABASES` responde | Mini 1 |
| `motor_bueno` | Es PostgreSQL y no SQLite | Mini 1 |
| `tabla_contratos` | Existe la tabla `contratos_contrato` | Mini 2 |
| `contratos_registrados` | Cuántos registros hay | Mini 3 y 15 |
| `modelo_en_admin` | El modelo está registrado en /admin/ | Mini 3 |

Esta vista además lleva su propio **andamio CORS** (autoriza solo esta ruta
para los orígenes del 5173) para que el Mini 1 funcione antes de abrir el
CORS completo. Abrir CORS de toda la API es el RETO 9: cuando se conecte
`corsheaders` en `settings.py`, ese middleware toma el mando y sobrescribe
esta cabecera (nunca se duplica).

## Flujo de una misión

```text
1. El panel muestra la instrucción TODO (RETO n) y la teoría de MisionMarco.
2. El estudiante trabaja en el archivo indicado (models.py, views.py, src/...).
3. El estudiante pulsa el botón de verificación de la misión.
4. api.js lanza la petición a la ruta correspondiente.
5. La misión compara la respuesta con lo que el reto espera
   (200, 404, 400, bloqueo CORS, tiempo, conteo de registros...).
6. Si cumple, se aprueba en localStorage y avanza la puerta del siguiente mini.
```

## Convenciones del código

| Marca | Significado |
|---|---|
| `TODO (RETO n)` | Lugar exacto donde el estudiante escribe su solución. Las instrucciones completas están comentadas ahí mismo. |
| `⏸ INSTRUCTORES (Steven/Yesid)` | Bloque con la explicación teórica que se da **antes** de soltar el teclado y la demo que se proyecta. |
| Andamio (scaffolding) | Piezas ya activas que sostienen el taller (batería de diagnóstico, router declarado de antemano). No se tocan. |

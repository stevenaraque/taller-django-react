# Taller Django + React — Plataforma de Arenas (SECOP II)

Taller intensivo Full-Stack de 3 días (18 horas) para estudiantes de desarrollo de
software (SENA ADSO). A través de 15 mini-tareas se aprende **Django REST Framework**
(backend), **React + Vite** (frontend) y **PostgreSQL 18**, resolviendo retos reales
sobre el dataset **SECOP II — Contratos Electrónicos** de la compra pública colombiana.

El enfoque no es un CRUD tradicional: es una plataforma de **Arenas de Alto Rendimiento
y Big Data**. La plantilla entrega la aplicación **incompleta a propósito**: el estudiante
construye el modelo, el serializer, la vista, CORS, inyección masiva, agregaciones,
búsqueda, paginación y borrado, mientras el panel React **verifica y aprueba** cada
misión automáticamente.

## Requisitos previos

| Herramienta | Versión mínima |
|---|---|
| Python | 3.14+ |
| Node.js + npm | Node 20.19+ / 22.12+ — Vite 8 no corre con Node 18 |
| Git | última versión reciente |
| PostgreSQL | 18+ |

## Puesta en marcha — backend

```bash
cd Backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt

copy .env.example .env       # luego editar con datos reales de Postgres
python manage.py migrate
python manage.py runserver   # http://localhost:8000
```

La conexión a PostgreSQL vive exclusivamente en el archivo `.env` (leído con `python-dotenv`).
Si falta alguna variable, el arranque se detiene con instrucciones. **Nunca** se escriben
credenciales en `settings.py` ni se suben al repositorio.

## Puesta en marcha — frontend

```bash
cd Frontend
npm install
npm run dev                   # http://localhost:5173
```

El panel muestra las **3 arenas** y el acordeón de misiones. Los días futuros quedan
bloqueados hasta completar los anteriores. El botón **Modo instructor** desbloquea
todo para ensayar la clase.

## Dataset masivo (Big Data)

```bash
python generar_datos.py          # 50.000 contratos con Faker + bulk_create
python generar_datos.py 10000    # tanda más pequeña
```

## Las 15 misiones

**Día 1 — El Velocista (backend):** La Bóveda, El Arquitecto, El Jefe Maestro, El
Escudo (HTTP 400) y El Velocista (API 200 vs 404).

**Día 2 — El Portero (frontend + CORS):** El Camaleón, El Albañil, El Impulso (el fetch
falla intencionalmente con razón), El Portero (diagnóstico del preflight OPTIONS) y El
Render.

**Día 3 — Pentatlón Big Data:** La Avalancha (bulk_create), El Analista (aggregate +
annotate), La Aguja en el Pajar (SearchFilter), El Regulador (paginación) y El Limpiador
(delete masivo).

Cada misión incluye un bloque **⏸ INSTRUCTORES (Steven/Yesid)**: la explicación teórica
que corresponde dar antes de que el estudiante ejecute el reto. En el código, el
estudiante escribe en los lugares marcados como `TODO (RETO n)`.

## Endpoints del taller

| Ruta | Reto | Descripción |
|---|---|---|
| `GET /api/estado/` | lista activa | Batería de diagnóstico usada por las misiones |
| `GET /api/contratos/` | Mini 5 | ModelViewSet + Router (CRUD completo) |
| `POST /api/contratos/inyeccion/` | Mini 11 | Inyección masiva con `bulk_create` |
| `GET /api/contratos/estadisticas/` | Mini 12 | Métricas con `aggregate` y `annotate` |
| `GET /api/contratos/?search=` | Mini 13 | Búsqueda con `SearchFilter` |
| — | Mini 14 | Paginación global en `settings.py` |
| `DELETE /api/contratos/limpieza/` | Mini 15 | Borrado masivo con `QuerySet.delete()` |

## Estructura del proyecto

```text
taller-django-react/
├── Backend/          ← API REST (Django REST Framework)
├── Frontend/         ← Panel de arenas (React 19 + Vite)
├── README.md
├── resumen-taller.html
└── LICENSE
```

Ver carpetas `Backend/` y `Frontend/` para el detalle de archivos por misión.

## Documentación

Guías paso a paso para desarrollar el proyecto en [`docs/`](./docs/README.md):

1. [Inicio rápido](./docs/01-inicio-rapido.md) — requisitos e instalación completa.
2. [Arquitectura](./docs/02-arquitectura.md) — cómo encaja Django, React y el tablero.
3. [Día 1 · El Velocista](./docs/03-dia1-el-velocista.md) — misiones 1 a 5.
4. [Día 2 · El Portero](./docs/04-dia2-el-portero.md) — misiones 6 a 10.
5. [Día 3 · Pentatlón Big Data](./docs/05-dia3-pentatlon-big-data.md) — misiones 11 a 15.
6. [Dataset y datos masivos](./docs/06-dataset-y-datos-masivos.md) — generar datos SECOP II.
7. [Solución de problemas](./docs/07-solucion-de-problemas.md) — diagnóstico rápido.

## Instructores

- La plantilla trae **solo la batería de diagnóstico** lista. Todo lo demás es reto del
  estudiante (criterio de rechazo: cero respuestas mágicas).
- El tablero aprueba **solo** cuando backend/front responde lo esperado.
- `generar_datos.py` es herramienta de los instructores, no un reto.

## Licencia

Código liberado bajo licencia [MIT](./LICENSE).

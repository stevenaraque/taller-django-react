# AGENTS.md — Contexto para agentes de IA (y humanos recién llegados)

Guía de contexto del repo `taller-django-react`. Un agente que lea esto debe
poder trabajar en el proyecto sin reconstruir el mapa desde cero.
Documentación completa del taller para personas: [`docs/README.md`](docs/README.md).

## Qué es este proyecto

Taller intensivo Full-Stack de **3 días (18 horas)** para estudiantes de
desarrollo de software (SENA ADSO). A través de **15 mini-tareas** se aprende
Django REST Framework, React + Vite y PostgreSQL 18, resolviendo retos sobre
el dataset **SECOP II — Contratos Electrónicos** de la compra pública
colombiana.

**Clave: la plantilla está incompleta a propósito.** El estudiante construye el
modelo, el serializer, las vistas y las rutas; el panel React verifica y
aprueba cada misión automáticamente.

## Stack

| Capa | Tecnología |
|---|---|
| Backend | Django 6.1 + Django REST Framework 3.18 (venv, `requirements.txt`) |
| Base de datos | PostgreSQL 18 — **SQLite está prohibido** (lo detecta la batería de diagnóstico) |
| Frontend | React 19 + Vite 8 (requiere Node 20.19+ / 22.12+) |
| Config | `python-dotenv`: credenciales SOLO en `Backend/.env` (nunca en código ni en git) |
| Datos | `Faker` + `bulk_create` para ~50.000 contratos |

## Mapa del repo

```text
Backend/
  config/settings.py     Lee .env; bloques TODO (RETO 9) CORS y (RETO 14) paginación
  config/urls.py         Monta /admin/ y /api/
  contratos/             Única app: models.py (RETO 2), serializers.py (RETO 4),
                         views.py (RETO 5 y 11-15), urls.py, admin.py (RETO 3)
  generar_datos.py       Inyector masivo de contratos (herramienta de instructores)
Frontend/
  src/api.js             ÚNICA puerta HTTP hacia Django; clasifica errores en FallaApi
  src/estadoMisiones.js  Tablero en localStorage (misiones aprobadas + modo instructor)
  src/App.jsx            Hub: 3 arenas, acordeón, candados por día
  src/MisionMarco.jsx    Marco de misión: teoría, estado, botón de aprobación manual
  src/dia1..dia3/        15 componentes, uno por misión
docs/                    Guías para desarrollar: inicio rápido, arquitectura, día 1-3, dataset, troubleshooting
```

## Reglas duras del taller (no negociables)

1. **NO completar los `TODO (RETO n)` salvo pedido explícito del usuario.**
   Es un ejercicio educativo con "cero respuestas mágicas": la solución la
   escribe el estudiante. Un agente solo teoriza, da pistas y explica.
2. **NO tocar `EstadoJardinView`** en `Backend/contratos/views.py` ni su
   andamio CORS: es el juez automático del taller (banderas en `/api/estado/`).
3. **NO cambiar motor a SQLite**, ni renombrar la tabla `contratos_contrato`.
4. **NO escribir credenciales** en `settings.py` ni subir `.env`.
5. Documentación y comentarios en **español, sin emojis** (conf. historial de
   commits). Tono directo y didáctico del proyecto.
6. Cada misión tiene su teoría de instructor en el bloque
   `⏸ INSTRUCTORES (Steven/Yesid)` del archivo correspondiente: Es la fuente
   de verdad pedagógica. Respetarla, no borrarla.

## Flujo del taller (para decisiones de coherencia)

- Panel React (:5173) → `fetch` por `api.js` → API Django (:8000) → PostgreSQL.
- `GET /api/estado/` devuelve: `base_datos`, `motor_bueno`,
  `tabla_contratos`, `contratos_registrados`, `modelo_en_admin`.
- Misiones auto-aprobadas por el panel: Mini 1-5, 8, 9, 11-15.
- Retos de escritura (visto del instructor, botón «Lo apliqué en clase»):
  Mini 6, 7 y 10.
- Los días se desbloquean en cadena; el Modo instructor los abre todos
  (clave `taller-secop-modo-instructor` en localStorage).

## Endpoints

| Ruta | Reto | Qué hace |
|---|---|---|
| `GET /api/estado/` | (lista activa) | Batería de diagnóstico del tablero |
| `GET /api/contratos/` | RETO 5 | ModelViewSet + Router (CRUD completo) |
| `POST /api/contratos/inyeccion/` | RETO 11 | Inyección masiva `bulk_create` |
| `GET /api/contratos/estadisticas/` | RETO 12 | `aggregate` + `annotate` |
| `GET /api/contratos/?search=` | RETO 13 | `SearchFilter` |
| Paginación global | RETO 14 | `PageNumberPagination`, `PAGE_SIZE` 50 |
| `DELETE /api/contratos/limpieza/` | RETO 15 | Borrado masivo `QuerySet.delete()` |

## Comandos

```bash
# Backend (cd Backend, venv activado)
pip install -r requirements.txt
copy .env.example .env      # llenar SECRET_KEY, DEBUG, DB_NAME/USER/PASSWORD/HOST/PORT
python manage.py migrate
python manage.py runserver  # :8000

# Frontend (cd Frontend)
npm install
npm run dev                 # :5173

# Datos masivos (instructores; exige RETO 2 migrado)
python generar_datos.py          # 50.000 registros
python generar_datos.py 10000    # tanda menor
```

## Trampas conocidas (probar esto primero al depurar)

- Cambios en `settings.py` (RETOS 9 y 14) **exigen reiniciar el runserver**.
- `generar_datos.py` genera ids deterministas (`SECOP-II-2026-...` con semillas
  fijas) y no ignora conflictos: **una segunda corrida falla por unique**.
  Vaciar la tabla antes (RETO 15) para repetir.
- Con paginación activa, el frontend debe leer el listado en `results`.
- `fetch` solo lanza cuando la petición nunca cruzó el puerto: eso es CORS
  apagado (Mini 8 celebra ese fallo a propósito; se arregla en RETO 9).
- El progreso vive en localStorage del navegador; cambiar de navegador lo
  reinicia (usar Modo instructor para ensayar).

## Estilo de commits (historial del repo)

Prefijo por área + español conciso, sin emojis: `Docs: ...`, `Frontend: ...`,
`Backend: ...`. Rama principal: `main`, remoto `origin` (GitHub).

# Taller Django + React — Plataforma de Arenas SECOP II

Taller intensivo Full-Stack de **3 días · 18 horas** para estudiantes de desarrollo
de software (SENA ADSO). Los estudiantes aprenden **Django REST Framework**
(backend), **React + Vite** (frontend) y **PostgreSQL 18** a través de
**15 mini-tareas gamificadas** sobre un dataset REAL: el
**SECOP II — Contratos Electrónicos** de la compra pública colombiana.

El enfoque NO es un CRUD tradicional: es una plataforma de **Arenas de Alto
Rendimiento y Big Data**. La plantilla entrega una app **incompleta a propósito**:
el estudiante construye las piezas (modelo, serializer, vistas, CORS, bulk_create,
aggregate, SearchFilter, paginación) y el panel React **verifica y aprueba cada
misión automáticamente**.

| Arena | Día | Qué se juega |
|---|---|---|
| 🏃 **El Velocista** | 1 | Django + PostgreSQL: la Bóveda, el modelo SECOP II, el Admin, el Escudo (HTTP 400) y la API cronometrada (200 vs 404) |
| 🚪 **El Portero** | 2 | React + CORS: primer componente, `useState`, el fetch que FALLA con razón, el preflight OPTIONS y el render del JSON |
| 🏅 **Pentatlón Big Data** | 3 | Alto rendimiento: `bulk_create` (50k registros), `aggregate`/`annotate`, `SearchFilter`, paginación global y borrado masivo |

---

## 📋 Requisitos previos

| Herramienta | Versión mínima | Verificar con |
|---|---|---|
| Python | 3.14+ | `python --version` |
| Node.js + npm | Node 18+ / npm 11+ | `node --version && npm --version` |
| Git | cualquier versión reciente | `git --version` |
| PostgreSQL | **18+** | servicio `postgresql-x64-18` |

## ⬇️ Descargar el proyecto

```bash
git clone https://github.com/stevenaraque/taller-django-react.git
cd taller-django-react
```

## 🖥️ Backend (Django, puerto 8000)

Abre una terminal dentro de `Backend/`:

```bash
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS / Linux

pip install -r requirements.txt

# Mini 1 · La Bóveda: crea tu .env a partir de la plantilla
copy .env.example .env       # luego ABRE .env y llena tus datos reales

# Crea la base de datos (una sola vez)
psql -U postgres -c "CREATE DATABASE taller_django_react;"
```

Y arranca el backend:

```bash
python manage.py migrate     # (Mini 1)
python manage.py runserver   # http://localhost:8000
```

> **Regla del taller (Mini 1)**: la conexión a PostgreSQL vive **exclusivamente**
> en el archivo `.env` (lea por `python-dotenv`). Si falta alguna variable,
> el arranque se detiene con instrucciones en español. **Nunca** edites
> credenciales en `settings.py` ni las subas a git: `.env` está en `.gitignore`.

## 🌐 Frontend (React + Vite, puerto 5173)

Segunda terminal dentro de `Frontend/`:

```bash
npm install
npm run dev
```

Abre <http://localhost:5173>: verás el panel con las **3 arenas** y el
**acordeón de misiones**. Cada misión se aprueba cuando tu backend/front
responde lo esperado; los días futuros quedan bloqueados hasta completar
los anteriores. El botón **Modo instructor** desbloquea todo para ensayar
la clase.

## 💾 Datos masivos (dataset SECOP II de prueba)

Antes del Día 3 los instructores llenan la bóveda con ~50.000 contratos:

```bash
python generar_datos.py          # 50.000 registros (Faker + bulk_create)
python generar_datos.py 10000    # tanda más pequeña
```

El Mini 11 (**La Avalancha**) repite el mismo patrón **desde la API**: el
estudiante programa `InyeccionMasivaView` con `bulk_create(batch_size)`.

## 📡 Endpoints del taller

| Ruta | Reto | Descripción |
|---|---|---|
| `GET /api/estado/` | — (viene lista) | Batería de diagnóstico que las misiones consultan |
| `GET/POST/PATCH/PUT/DELETE /api/contratos/` | Mini 5 | ModelViewSet + Router (todo el CRUD) |
| `POST /api/contratos/inyeccion/` | Mini 11 | Inyección masiva con `bulk_create` |
| `GET /api/contratos/estadisticas/` | Mini 12 | Métricas `aggregate` + `annotate` |
| `GET /api/contratos/?search=` | Mini 13 | `SearchFilter` del DRF |
| (paginación global) | Mini 14 | `REST_FRAMEWORK` en settings.py |
| `DELETE /api/contratos/limpieza/` | Mini 15 | Borrado masivo con `delete()` |

> Antes del Mini 5 la única ruta activa es `/api/estado/`: es intencional
> (criterio "cero respuestas mágicas"). El estudiante escribe el resto.

## 🗂️ Estructura del proyecto

```text
taller-django-react/
├── Backend/                     ← API REST (Django REST Framework)
│   ├── config/
│   │   ├── settings.py          ← dotenv, PostgreSQL, CORS (RETO 9), paginación (RETO 14)
│   │   └── urls.py              ← monta /admin/ y /api/
│   ├── contratos/               ← la app del taller (SECOP II)
│   │   ├── models.py            ← TODO (RETO 2): el modelo Contrato
│   │   ├── admin.py             ← TODO (RETO 3): registro en el panel
│   │   ├── serializers.py       ← TODO (RETO 4): el escudo HTTP 400
│   │   ├── views.py             ← RETO 5 + los retos Big Data 11..15
│   │   ├── urls.py              ← router (RETO 5) y rutas de los retos
│   │   └── migrations/          ← vacía: nace en el RETO 2
│   ├── generar_datos.py         ← 50k contratos Faker (herramienta docente)
│   ├── .env.example             ← plantilla de credenciales (sin secretos)
│   └── requirements.txt
└── Frontend/                    ← panel de arenas (React 19 + Vite)
    └── src/
        ├── App.jsx              ← hub: 3 arenas + acordeón + candados
        ├── api.js               ← API_URL + errores HTTP elegantes
        ├── estadoMisiones.js    ← tablero localStorage + modo instructor
        ├── MisionMarco.jsx      ← marco visual de cada misión
        ├── Cronometro.jsx       ← reloj del Velocista
        ├── dia1/                ← Mini1_Boveda … Mini5_Velocista
        ├── dia2/                ← Mini6_Camaleon … Mini10_Render
        └── dia3/                ← Mini11_Avalancha … Mini15_Limpiador
```

## 🗺️ Los 15 mini-retos

**DÍA 1 — El Velocista (Backend Django & Postgres)**

1. **La Bóveda** — conectar Django a PostgreSQL vía `.env` (abandonar SQLite).
2. **El Arquitecto** — crear el modelo `Contrato` (SECOP II) y migrar.
3. **El Jefe Maestro** — registrar el modelo en `admin.py` y crear un contrato desde el panel visual.
4. **El Escudo** — configurar el `ModelSerializer` y demostrar el rechazo (HTTP 400).
5. **El Velocista** — activar el `ModelViewSet` + Router y probar 200 vs 404.

**DÍA 2 — El Portero (Frontend React & CORS)**

6. **El Camaleón** — primer componente en React (limpiar el boilerplate).
7. **El Albañil** — estado básico con `useState`.
8. **El Impulso** — primer fetch que FALLA intencionalmente (CORS).
9. **El Portero** — diagnosticar el preflight (OPTIONS) y autorizar el origen.
10. **El Render** — lograr la conexión y renderizar el JSON.

**DÍA 3 — Pentatlón Big Data (Alto Rendimiento)**

11. **La Avalancha** — inyectar miles de registros con `bulk_create`.
12. **El Analista** — métricas con `aggregate` y `annotate` del ORM.
13. **La Aguja en el Pajar** — búsqueda instantánea con `SearchFilter`.
14. **El Regulador** — paginación global para no colapsar el frontend.
15. **El Limpiador** — borrado masivo eficiente con `QuerySet.delete()`.

Cada misión lleva en su panel un bloque **⏸ INSTRUCTORES (Steven/Yesid)**:
la explicación teórica que corresponde dar ANTES de soltar el teclado.
En el código fuente, el estudiante escribe donde marque `TODO (RETO n)`.

## 👩‍🏫 Nota para instructores

* La plantilla trae **solo la batería de diagnóstico** lista: todo lo demás
  se construye en el taller (criterio de rechazo "cero respuestas mágicas").
* El tablero aprueba **solo** cuando el backend/front responde lo esperado.
* `generar_datos.py` es herramienta de ustedes, no un reto del estudiante.
* Ninguna credencial vive en el repositorio: el `.env.example` trae solo
  marcadores "TODO" y el `.env` real lo genera cada máquina (git lo ignora).

## 📄 Licencia

Código liberado bajo licencia [MIT](./LICENSE).

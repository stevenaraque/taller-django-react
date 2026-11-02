# Taller Django + React

Taller intensivo Full-Stack de **3 días · 18 horas**: los estudiantes aprenden **Django REST Framework** (backend), **React + Vite** (frontend) y **PostgreSQL** a través de **15 mini-tareas gamificadas** y 3 arenas de reto.

El producto: un **panel multi-módulos**. La plantilla no entrega una app para llenar de tareas — entrega **arenas que miden a los estudiantes**: el ⏱️ **Velocista** (la consulta más rápida), el 🚪 **Portero** (primera consola limpia de errores CORS) y el 🏅 **Pentatlón CRUD** (cinco verbos HTTP contra el reloj). El CRUD de tareas es el entrenamiento; competir con los módulos es el deporte.

---

## 📋 Requisitos previos

Necesitas tener instalado antes del taller:

| Herramienta | Versión mínima | Verificar con |
|---|---|---|
| Python | 3.14+ | `python --version` |
| Node.js + npm | Node 18+ / npm 11+ | `node --version && npm --version` |
| Git | cualquier versión reciente | `git --version` |
| PostgreSQL | 18+ | `psql --version` o el servicio `postgresql-x64-18` |

Si alguno de esos comandos falla, descarga e instala lo que falte antes del taller:
- **Python** → <https://www.python.org/downloads/> (marca "Add Python to PATH" en Windows)
- **Node.js** → <https://nodejs.org> (incluye npm)
- **Git** → <https://git-scm.com/downloads>

## ⬇️ Cómo descargar el proyecto

**Opción A — con git (recomendado):**

```bash
git clone https://github.com/stevenaraque/taller-django-react.git
cd taller-django-react
```

**Opción B — sin git (descarga directa):**

En esta página de GitHub, oprime el botón verde **`<> Code` → `Download ZIP`**, descomprime el archivo en la carpeta que prefieras y abre una terminal dentro de esa carpeta. Todo lo que sigue funciona igual en ambas opciones.

## 🖥️ Cómo correr el Backend

Abre una terminal **dentro de la carpeta `Backend/`** del proyecto y ejecuta:

```bash
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS / Linux

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

El proyecto usa **Django 6.x + PostgreSQL** y funciona con Python 3.14+. Si la terminal deja de reconocer `python`, revisa que el venv siga activo (verás `(venv)` al inicio de la línea; para activarlo de nuevo: `venv\Scripts\activate`).

**Antes del primer `migrate`** crea la base de datos (solo una vez):

```bash
psql -U postgres -c "CREATE DATABASE taller_django_react;"
```

La conexión (nombre de BD, usuario y contraseña) se lee desde variables de entorno opcionales `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST` y `DB_PORT` — si no las defines, usa los valores locales por defecto. Si todo salió bien, Django está corriendo en <http://localhost:8000> (sin la app de tareas todavía — la construyes tú en el taller 😉).

## 🌐 Cómo correr el Frontend

Abre una **segunda terminal** — asumiendo de nuevo que estás en la raíz del proyecto — e ingresa a la carpeta `Frontend/`:

```bash
cd Frontend
npm install
npm run dev
```

Después abre tu navegador en <http://localhost:5173>.

- Si aparece el **Panel de módulos** con su cronómetro — perfecto. Las arenas se juegan en el taller.
- Recuerda que el **Backend** también debe estar corriendo en su propia terminal, porque el panel mide las consultas contra él.

## 🗂️ Estructura del proyecto

```text
taller-django-react/
├── Backend/                  ← API REST con Django REST Framework
│   ├── config/               ← configuración global del proyecto
│   │   ├── settings.py       ← ajustes (aquí entra CORS en el taller)
│   │   └── urls.py           ← rutas de la API (aquí entra la app `tareas`)
│   ├── manage.py             ← utilería de Django (migrate, runserver, ...)
│   ├── requirements.txt      ← dependencias del backend
│   └── venv/                 ← entorno virtual (NO se sube a git)
└── Frontend/                 ← Panel de módulos con React + Vite
    ├── src/                  ← aquí viven los componentes React
    │   ├── App.jsx           ← el hub: alterna entre las arenas del taller
    │   ├── modulos/          ← las arenas (cada una mide algo distinto)
    │   │   ├── api.js        ← URL base + verificador de respuestas
    │   │   ├── Velocista.jsx ← mide los ms del GET al backend
    │   │   ├── Portero.jsx   ← detecta el bloqueo de CORS en el navegador
    │   │   └── Pentatlon.jsx ← POST + GET + PATCH + PUT + DELETE contra reloj
    │   ├── Cronometro.jsx    ← reloj compartido de "El Velocista"
    │   ├── main.jsx          ← punto de entrada
    │   └── index.css / App.css
    ├── public/               ← archivos estáticos (favicon, iconos)
    ├── index.html            ← página HTML contenedora
    ├── package.json          ← dependencias del frontend
    └── vite.config.js        ← configuración de Vite
```

## 🗺️ Ruta del taller

Los 3 días siguen esta progresión (cada día termina con la app avanzando un nivel):

- **Día 1 — Backend** 🐍: creas la app `tareas` con el modelo `Tarea`, su serializer y las vistas de la API con Django REST Framework. Arena en juego desde ya: el Velocista necesita tu `GET` respondiendo.
- **Día 2 — Frontend** ⚛️: conectas React con el backend usando `fetch`, configuras **CORS** (la arena del Portero) y trabajas el estado con `useState` y el formulario de creación (`POST`).
- **Día 3 — Interactividad** ✨: estado dinámico para completar tareas, y eliminado (`DELETE`), edición (`PUT` / `PATCH`), filtro por estado. Capítulo deportivo: corren el **Pentatlón CRUD** contra el reloj en el panel. **Reto Final**: pulir los estilos para el premio mayor.

## 👩‍🏫 Nota para instructores / estudiantes

Este repositorio es la **Plantilla Base** del taller: Django configurado con PostgreSQL, el panel multi-módulos funcionando y CORS listo. La CRUD fina (completar, editar, filtrar, estilos) y las arenas nuevas **se construyen durante el taller, paso a paso, con las 15 mini-tareas**.

### ¿Y después del taller?

Cuando termines las 15 mini-tareas, puedes seguir con:
1. Autenticación (login con JWT en la API).
2. Desplegar el backend y el frontend a internet.
3. Agregar tu propio modelo (otra idea de app) reutilizando lo aprendido.

## 📄 Licencia

El código está liberado bajo la licencia [MIT](./LICENSE) — úsalo libremente.

## Qué contiene esta plantilla (actualizado)

Además del esqueleto descrito arriba, la plantilla ya trae funcionando:

- **Panel multi-módulos** en el frontend: `App.jsx` alterna entre las 3 arenas.
- **Arena 🏃 Velocista** (`modulos/Velocista.jsx` + `Cronometro.jsx`): mide los ms del `GET` y anota cada intento del grupo.
- **Arena 🚪 Portero** (`modulos/Portero.jsx`): detecta el bloqueo de CORS y muestra qué configurar — los instructores apagan el CORS y el primero en dejar la consola limpia gana.
- **Arena 🏅 Pentatlón CRUD** (`modulos/Pentatlon.jsx`): corre los 5 verbos (`POST`, `GET`, `PATCH`, `PUT`, `DELETE`) seguidos y guarda la mejor ronda.
- **Backend `tareas`**: modelo `Tarea` (titulo, descripcion, completada, creada), migraciones en PostgreSQL, serializer, `ViewSet` con router DRF bajo `api/tareas/` y registro en el admin.
- La CRUD de tareas **no es la meta del taller**: es el material de entrenamiento que alimenta el Pentatlón.
- El reto de la sesión 3 (completar, eliminar, editar, filtrar y estilos) queda intencionalmente SIN implementar: es para que lo construyan los estudiantes.

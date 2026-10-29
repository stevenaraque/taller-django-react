# Taller Django + React

Taller intensivo Full-Stack de **3 días · 18 horas**: crea tu primera aplicación completa con **Django REST Framework** (backend) y **React + Vite** (frontend), en **15 mini-tareas gamificadas**.

El producto final: una app de lista de tareas (crear, ver, marcar como completada, editar y borrar) conectada de verdad — un frontend React consumiendo una API REST hecha por ti.

---

## 📋 Requisitos previos

Necesitas tener instalado antes del taller:

| Herramienta | Versión mínima | Verificar con |
|---|---|---|
| Python | 3.14+ | `python --version` |
| Node.js + npm | Node 18+ / npm 11+ | `node --version && npm --version` |
| Git | cualquier versión reciente | `git --version` |

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

El proyecto usa **Django 6.x** y funciona con Python 3.14+. Si la terminal deja de reconocer `python`, revisa que el venv siga activo (verás `(venv)` al inicio de la línea; para activarlo de nuevo: `venv\Scripts\activate`).

Si todo salió bien, Django está corriendo en <http://localhost:8000> (sin la app de tareas todavía — la construyes tú en el taller 😉).

## 🌐 Cómo correr el Frontend

Abre una **segunda terminal** — asumiendo de nuevo que estás en la raíz del proyecto — e ingresa a la carpeta `Frontend/`:

```bash
cd Frontend
npm install
npm run dev
```

Después abre tu navegador en <http://localhost:5173>.

- Si aparece un "Hola, soy Steven" o algo parecido — perfecto. Lo demás se construye en el taller.
- Recuerda que el **Backend** también debe estar corriendo en su propia terminal, porque hablan entre sí durante el taller.

## 🗂️ Estructura del proyecto

```text
taller-django-react/
├── Backend/                  ← API REST con Django REST Framework
│   ├── config/               ← configuración global del proyecto
│   │   ├── settings.py       ← ajustes (aquí entra CORS en el taller)
│   │   └── urls.py           ← rutas de la API (aquí entra la app `tareas`)
│   ├── db.sqlite3            ← base de datos local (se crea con migrate)
│   ├── manage.py             ← utilería de Django (migrate, runserver, ...)
│   ├── requirements.txt      ← dependencias del backend
│   └── venv/                 ← entorno virtual (NO se sube a git)
└── Frontend/                 ← SPA con React + Vite
    ├── src/                  ← aquí viven los componentes React
    │   ├── App.jsx           ← componente raíz (el que modificarás)
    │   ├── main.jsx          ← punto de entrada
    │   └── index.css / App.css
    ├── public/               ← archivos estáticos (favicon, iconos)
    ├── index.html            ← página HTML contenedora
    ├── package.json          ← dependencias del frontend
    └── vite.config.js        ← configuración de Vite
```

## 🗺️ Ruta del taller

Los 3 días siguen esta progresión (cada día termina con la app avanzando un nivel):

- **Día 1 — Backend** 🐍: creas la app `tareas` con el modelo `Tarea`, su serializer y las vistas `GET` / `POST` de la API con Django REST Framework.
- **Día 2 — Frontend** ⚛️: conectas React con el backend usando `fetch`, configuras CORS, trabajas el estado con `useState` y construyes el formulario para crear tareas (`POST`).
- **Día 3 — Interactividad** ✨: estado dinámico para marcar tareas como completadas, y eliminado (`DELETE`), edición (`PUT` / `PATCH`), filtro por estado, y **Reto Final**: pulir los estilos para que la app quede lista para presumir.

## 👩‍🏫 Nota para instructores / estudiantes

Este repositorio es la **Plantilla Base** del taller: contiene el esqueleto del proyecto (Django configurado + React funcionando + CORS listo), **pero no incluye la app `tareas` ni sus serializers** — esas piezas son las que construyen los estudiantes durante el taller, paso a paso con las 15 mini-tareas.

### ¿Y después del taller?

Cuando termines las 15 mini-tareas, puedes seguir con:
1. Autenticación (login con JWT en la API).
2. Desplegar el backend y el frontend a internet.
3. Agregar tu propio modelo (otra idea de app) reutilizando lo aprendido.

## 📄 Licencia

El código está liberado bajo la licencia [MIT](./LICENSE) — úsalo libremente.

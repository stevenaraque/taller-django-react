# 01 · Inicio rápido

Guía de instalación completa para poder ejecutar el proyecto antes del
Día 1. Si ya corrió el `runserver` y el panel arrancó, salte a
[Arquitectura](02-arquitectura.md).

## Requisitos

| Herramienta | Versión mínima | Para qué se usa |
|---|---|---|
| Python | 3.14+ | Backend (Django 6 + DRF) |
| Node.js + npm | Node 20.19+ / 22.12+ — Vite 8 no corre con Node 18 | Frontend (React 19 + Vite 8) |
| Git | reciente | Clonar y versionar |
| PostgreSQL | 18+ | La "bóveda" (base de datos obligatoria) |

## Paso 0 · PostgreSQL

El taller **no usa SQLite** (es el criterio de rechazo #1: la batería de
diagnóstico verifica que el motor sea PostgreSQL).

1. Instale PostgreSQL 18 y deje el servicio corriendo.
2. Cree una base de datos propia del taller, por ejemplo `taller_django_react`.
3. Tenga a la mano usuario y contraseña locales (normalmente `postgres`).

## Paso 1 · Backend

```bash
cd Backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
```

> Notas: en Linux/macOS el activate es `source venv/bin/activate`.
> Si PowerShell bloquea `activate` por políticas de ejecución, ejecute
> primero `Set-ExecutionPolicy -Scope Process RemoteSigned`.

## Paso 2 · El `.env` (Mini 1 · La Bóveda)

Las credenciales **viven exclusivamente** en `Backend/.env` (cargadas con
`python-dotenv`). `settings.py` no contiene ningún dato de conexión y si falta
una variable el arranque se detiene con instrucciones en la terminal, no con un
traceback.

```bash
copy .env.example .env   # Windows
# o: cp .env.example .env
```

Edite `Backend/.env` con sus datos reales:

| Variable | Qué poner |
|---|---|
| `SECRET_KEY` | Llave de Django. Genere una nueva en la terminal: `python manage.py shell -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"` |
| `DEBUG` | `True` en desarrollo local, `False` en producción |
| `DB_NAME` | Nombre de la base de datos creada en el Paso 0 |
| `DB_USER` | Usuario de PostgreSQL (normalmente `postgres`) |
| `DB_PASSWORD` | Su clave local; **nunca se sube al repositorio** |
| `DB_HOST` | `localhost` |
| `DB_PORT` | `5432` por defecto |

## Paso 3 · Migrar y arrancar

```bash
python manage.py migrate
python manage.py runserver    # http://127.0.0.1:8000
```

Al arrancar debe levantarse sin errores. La ruta
`http://127.0.0.1:8000/api/estado/` responde la batería de diagnóstico.
Con el backend corriendo y PostgreSQL conectado, el Mini 1 se aprueba
solo desde el panel.

> En la plantilla fresca la única vista activa es esa batería: el resto de
> rutas se encienden con los RETOS 5 y 11-15 (ver [Día 1](03-dia1-el-velocista.md)
> y [Día 3](05-dia3-pentatlon-big-data.md)).

## Paso 4 · Frontend

En otra terminal:

```bash
cd Frontend
npm install
npm run dev    # http://localhost:5173
```

El panel muestra las 3 arenas con el acordeón de misiones. Los días futuros
quedan bloqueados hasta completar los anteriores; el botón **Modo instructor**
desbloquea todo para ensayar la clase.

## Paso 5 · Datos masivos (herramienta de instructores)

```bash
cd Backend
python generar_datos.py          # 50.000 contratos con Faker + bulk_create
python generar_datos.py 10000    # tanda más pequeña
```

Requiere el RETO 2 terminado (el modelo `Contrato` migrado). Detalle completo
en [Dataset y datos masivos](06-dataset-y-datos-masivos.md).

## Verificación final

| Chequeo | Resultado esperado |
|---|---|
| `http://127.0.0.1:8000/api/estado/` | JSON con las banderas iniciales: `false` en las de diagnóstico y el conteo de contratos en `0` |
| `http://localhost:5173` | Panel de arena con Mini 1 desbloqueado y aprobable |
| Terminal del backend | Sin errores de conexión ni variables faltantes |

Con los tres verdes, el proyecto está listo para el
[Día 1 · El Velocista](03-dia1-el-velocista.md).

# Inicio rápido

Sigue estos pasos una vez para preparar tu equipo. Después podrás iniciar el
backend y el frontend con los comandos de la sección «Arrancar cada día».

## 1. Instala los programas necesarios

- [Python 3.14](https://www.python.org/downloads/)
- [Node.js 20.19+ o 22.12+](https://nodejs.org/)
- [PostgreSQL 18](https://www.postgresql.org/download/) y
  [pgAdmin](https://www.pgadmin.org/download/)
- [Git](https://git-scm.com/downloads)

Comprueba que Python y Node funcionan:

```powershell
python --version
node --version
npm --version
```

## 2. Crea la base de datos

La base de datos es donde PostgreSQL guarda los contratos.

1. Abre pgAdmin y conéctate a PostgreSQL con tu usuario.
2. En el panel izquierdo, haz clic derecho en **Databases**.
3. Elige **Create > Database**.
4. Escribe `taller_django_react` y guarda.

Usaremos ese nombre en el paso siguiente.

## 3. Prepara Django

Abre PowerShell en la carpeta del proyecto y ejecuta:

```powershell
cd Backend
python -m venv venv
.\venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
Copy-Item .env.example .env
```

El entorno virtual (`venv`) mantiene las librerías de este proyecto separadas
de las de otros proyectos. Si PowerShell bloquea la activación, ejecuta esto
en la misma terminal y vuelve a intentarlo:

```powershell
Set-ExecutionPolicy -Scope Process RemoteSigned
```

## 4. Completa `Backend/.env`

Abre `.env` y reemplaza los valores de ejemplo:

- `SECRET_KEY`: clave privada de Django. Para generar una, ejecuta desde
  `Backend/` con el entorno virtual activo:

  ```powershell
  python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
  ```

- `DEBUG=True`: modo de desarrollo local.
- `DB_NAME=taller_django_react`: nombre de la base que creaste.
- `DB_USER` y `DB_PASSWORD`: usuario y clave de PostgreSQL.
- `DB_HOST=localhost` y `DB_PORT=5432`: valores locales habituales.

No compartas ni subas `.env`: contiene tu clave de base de datos.

`settings.py` carga este archivo y le entrega los valores a Django. Más detalle
en [Conexión a PostgreSQL](02-arquitectura.md#conexión-a-postgresql).

## 5. Prepara la base e inicia Django

Desde `Backend/`, con `venv` activo:

```powershell
python manage.py check
python manage.py migrate
python manage.py runserver
```

`check` busca errores de configuración. `migrate` crea las tablas internas de
Django y la tabla `contratos_contrato` del modelo.

Deja esta terminal abierta. Django debe mostrar que está escuchando en el
puerto 8000. Compruébalo en <http://127.0.0.1:8000/api/estado/>.

## 6. Prepara y arranca React

Abre una segunda terminal en la carpeta del proyecto:

```powershell
cd Frontend
npm install
npm run dev
```

`npm install` solo hace falta la primera vez o cuando cambian las dependencias.
Deja la terminal abierta y visita <http://localhost:5173>.

## 7. Comprueba el inicio

- Django responde en `http://127.0.0.1:8000/api/estado/`.
- React muestra el taller en `http://localhost:5173`.
- El Mini 1 se aprueba cuando PostgreSQL está conectado.
- `tabla_contratos` debe aparecer en `true` después de ejecutar `migrate`.

## Documentación oficial

- [Entornos virtuales de Python](https://docs.python.org/3/library/venv.html)
- [Instalación de Django](https://docs.djangoproject.com/en/6.1/intro/install/)
- [Guía de Vite](https://vite.dev/guide/)
- [Tutorial de PostgreSQL](https://www.postgresql.org/docs/current/tutorial.html)

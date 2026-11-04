# Día 1: El Velocista

Hoy prepararás PostgreSQL y construirás las primeras partes de la API. Trabaja
en orden: los retos usan lo que hiciste antes.

## Mini 1: La Bóveda

**Archivo:** `Backend/.env`

1. Copia `.env.example` como `.env`.
2. Escribe los datos de tu PostgreSQL y genera una `SECRET_KEY` nueva. La guía
   está en [Inicio rápido](01-inicio-rapido.md).
3. En `Backend/`, activa `venv` y ejecuta:

   ```powershell
   python manage.py migrate
   python manage.py runserver
   ```

**Comprueba:** el panel debe confirmar que la base responde y que el motor es
PostgreSQL.

**Si necesitas ayuda:** [configuración de Django](https://docs.djangoproject.com/en/6.1/topics/settings/)
y [documentación de PostgreSQL](https://www.postgresql.org/docs/current/tutorial.html).

## Mini 2: El Arquitecto

**Archivo:** `Backend/contratos/models.py`

1. Crea el modelo `Contrato` con los campos indicados en
   [Dataset y datos masivos](06-dataset-y-datos-masivos.md).
2. Agrega `__str__()` para que cada contrato tenga un nombre legible.
3. Crea y aplica la migración:

   ```powershell
   python manage.py makemigrations contratos
   python manage.py migrate
   ```

**Comprueba:** `GET /api/estado/` debe mostrar `tabla_contratos: true`. No
cambies el nombre de la tabla `contratos_contrato`.

**Documentación:** [modelos](https://docs.djangoproject.com/en/6.1/topics/db/models/),
[campos](https://docs.djangoproject.com/en/6.1/ref/models/fields/) y
[migraciones](https://docs.djangoproject.com/en/6.1/topics/migrations/).

## Mini 3: El Jefe Maestro

**Archivo:** `Backend/contratos/admin.py`

1. Importa `admin` de Django y el modelo `Contrato`.
2. Registra el modelo para que aparezca en el sitio de administración.
3. Crea un usuario administrador:

   ```powershell
   python manage.py createsuperuser
   ```

4. Abre <http://127.0.0.1:8000/admin/> e inicia sesión.
5. Crea un contrato de prueba.

**Comprueba:** el panel debe mostrar `modelo_en_admin: true` y al menos un
contrato.

**Documentación:** [Django Admin](https://docs.djangoproject.com/en/6.1/ref/contrib/admin/).

## Mini 4: El Escudo

**Archivo:** `Backend/contratos/serializers.py`

Crea un `ModelSerializer` para `Contrato`. Un serializer convierte los objetos
de Django a JSON y valida el JSON que recibe la API.

**Comprueba:** el panel envía un valor incorrecto para `valor_total`. Django
debe responder HTTP 400 con información del error. Si la ruta responde 404,
completa primero el Mini 5 y vuelve a intentarlo.

**Documentación:** [ModelSerializer de DRF](https://www.django-rest-framework.org/api-guide/serializers/#modelserializer).

## Mini 5: El Velocista

**Archivos:** `Backend/contratos/views.py` y `Backend/contratos/urls.py`

1. Crea un `ModelViewSet` para `Contrato`.
2. Regístralo en el `DefaultRouter` que ya está creado.
3. Conecta las rutas del router en `urls.py`.

**Comprueba:**

- `GET /api/contratos/` responde HTTP 200.
- `GET /api/contratos/999999/` responde HTTP 404.

**Documentación:** [ViewSets](https://www.django-rest-framework.org/api-guide/viewsets/)
y [routers](https://www.django-rest-framework.org/api-guide/routers/).

## Antes de pasar al Día 2

El Día 2 se abre cuando estén aprobados los Minis 1, 2 y 3. Los Minis 4 y 5
necesitan CORS, que se configura en el Mini 9. Vuelve a ellos después de
completar el Mini 9.

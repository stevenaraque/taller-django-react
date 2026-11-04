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

1. Registra el modelo `Contrato` con un `ModelAdmin` propio y configura:

   - `list_display`: al menos `id_contrato`, `entidad_compradora`,
     `estado`, `valor_total` y `fecha_firma`.
   - `search_fields`: para buscar por identificador, entidad o descripción.
   - `list_filter`: para filtrar por `estado`.

2. Crea tu usuario administrador:

   ```powershell
   python manage.py createsuperuser
   ```

3. Abre <http://127.0.0.1:8000/admin/>, entra y usa la lista que configuraste
   para crear un contrato de prueba.

Con los datos reales de SECOP II cargados, el Admin deja de ser una vista:
queda como la mesa de trabajo para encontrar y revisar contratos por estado,
entidad y valor.

**Comprueba:** el panel debe mostrar `modelo_en_admin: true` y al menos un
contrato.

**Documentación:** [Django Admin](https://docs.djangoproject.com/en/6.1/ref/contrib/admin/) y
[opciones de ModelAdmin](https://docs.djangoproject.com/en/6.1/ref/contrib/admin/#modeladmin-options).

## Mini 4: El Escudo

**Archivo:** `Backend/contratos/serializers.py`

1. Crea un `ModelSerializer` para `Contrato`. Un serializer convierte los
   objetos de Django a JSON y valida el JSON que recibe la API.
2. Escudo extra: en el `Meta`, usa `extra_kwargs` para que `valor_total`
   sea `min_value = 0`. Ningún contrato negativo debería entrar a la base.

En el panel están los dos ataques: un JSON malformado y un contrato completo
pero con `valor_total` negativo.

**Comprueba:** los dos ataques deben rebotar con HTTP 400 e información del
error. Si la ruta responde 404, completa primero el Mini 5 y vuelve a
intentarlo.

**Documentación:** [ModelSerializer de DRF](https://www.django-rest-framework.org/api-guide/serializers/#modelserializer)
y [validadores de campo](https://www.django-rest-framework.org/api-guide/validators/).

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

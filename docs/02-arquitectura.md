# Cómo funciona el proyecto

El proyecto tiene tres partes:

1. **React** muestra el panel en el navegador (`localhost:5173`).
2. **Django** recibe las peticiones y responde desde la API (`localhost:8000`).
3. **PostgreSQL** guarda los contratos.

Cuando pulsas «Verificar», React pide datos a Django. Django consulta
PostgreSQL y devuelve una respuesta JSON. El panel compara esa respuesta con lo
que espera el reto.

- **API:** rutas que React puede consultar en Django.
- **JSON:** formato de texto que usan para intercambiar datos.
- **GET:** pedir datos. **POST:** enviar datos. **DELETE:** borrar datos.

```text
Navegador (React :5173) -> Django (:8000) -> PostgreSQL
Navegador (React :5173) <- JSON       <- Django
```

## Qué contiene cada carpeta

```text
Backend/
  .env                    Datos locales de la base y la clave de Django
  config/settings.py      Configuración de Django y conexión a PostgreSQL
  config/urls.py          Rutas principales: Admin y API
  contratos/              Modelos, serializer, vistas, rutas y comandos de contratos

Frontend/src/
  app/                    Une las partes principales del panel
  features/arenas/        Navegación de los tres días
  features/misiones/      Las 15 misiones y su marco común
  features/progreso/      Aprobaciones guardadas en el navegador
  shared/                 Peticiones HTTP, cronómetro y estilos
```

La carpeta `features` agrupa el código por lo que hace. Por ejemplo, los
componentes de una misión del Día 1 están en
`Frontend/src/features/misiones/dia1/`.

## Cómo se conecta PostgreSQL

`Backend/.env` guarda el nombre de la base, el usuario, la contraseña, el host
y el puerto. `python-dotenv` lee ese archivo. Después, `settings.py` asigna
cada valor a la opción que Django necesita:

```python
load_dotenv(BASE_DIR / '.env')

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ['DB_NAME'],
        'USER': os.environ['DB_USER'],
        'PASSWORD': os.environ['DB_PASSWORD'],
        'HOST': os.environ['DB_HOST'],
        'PORT': os.environ['DB_PORT'],
    },
}
```

Por ejemplo, `DB_NAME` es el nombre escrito en `.env`; Django lo recibe como
`NAME`. Django usa esta configuración al ejecutar migraciones y consultas.
Nunca escribas la contraseña dentro de `settings.py`.

## Cómo viaja una petición

1. Una misión llama a `Frontend/src/shared/api.js`.
2. Ese archivo usa `fetch` para comunicarse con Django.
3. Django ejecuta la vista asociada a la ruta.
4. La vista puede consultar PostgreSQL y devuelve JSON.
5. La misión revisa el resultado y muestra si el reto se cumplió.

`peticion()` devuelve la respuesta HTTP y el tiempo que tardó. Se usa cuando
un código como 400 o 404 puede ser parte del reto. `pedirOExplotar()` trata
cualquier respuesta que no sea 2xx como error.

## La ruta de diagnóstico

`GET /api/estado/` llama a `EstadoJardinView` en
`Backend/contratos/views.py`. Esa vista es el verificador del taller. Indica:

| Dato | Qué comprueba | Reto |
|---|---|---|
| `base_datos` | PostgreSQL responde | Mini 1 |
| `motor_bueno` | El motor es PostgreSQL | Mini 1 |
| `tabla_contratos` | Existe `contratos_contrato` | Mini 2 |
| `contratos_registrados` | Cuántos contratos hay | Minis 3 y 15 |
| `modelo_en_admin` | Contrato aparece en Django Admin | Mini 3 |

No cambies ni borres `EstadoJardinView` ni su permiso CORS. El reto de CORS
completo está en el Mini 9.

## Cómo avanza una misión

1. Abre un día y elige una misión.
2. Lee la instrucción y trabaja en el archivo que se indica.
3. Pulsa el botón de verificación.
4. Si la respuesta coincide con lo esperado, el panel aprueba la misión. En los
   Minis 6, 7, 10 y 12, el panel también prueba el componente o la gráfica que
   completaste.

Las aprobaciones se guardan en `localStorage`, dentro del navegador. No se
guardan en PostgreSQL.

## Para aprender más

- [Modelos en Django](https://docs.djangoproject.com/en/6.1/topics/db/models/)
- [Migraciones en Django](https://docs.djangoproject.com/en/6.1/topics/migrations/)
- [Serializers de DRF](https://www.django-rest-framework.org/api-guide/serializers/)
- [ViewSets de DRF](https://www.django-rest-framework.org/api-guide/viewsets/)
- [Fetch en el navegador](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)

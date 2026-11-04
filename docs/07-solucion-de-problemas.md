# Solución de problemas

Revisa estas causas comunes. Si el problema continúa, copia el error que aparece
en la terminal de Django y busca el Mini relacionado en las guías.

## Django y PostgreSQL

| Error o síntoma | Qué revisar |
|---|---|
| `KeyError: 'SECRET_KEY'` | Agrega `SECRET_KEY` a `Backend/.env`. |
| `KeyError: 'DB_NAME'` u otra clave `DB_...` | Agrega esa variable a `Backend/.env` y vuelve a iniciar Django. |
| Django no conecta a PostgreSQL | Comprueba que el servicio PostgreSQL esté activo. Revisa `DB_HOST`, `DB_PORT`, `DB_USER` y `DB_PASSWORD`. |
| La base de datos no existe | Comprueba `DB_NAME` o créala con pgAdmin. |
| `base_datos` aparece en `false` | Django no logró conectarse. Revisa el servicio y `.env`. |
| `motor_bueno` aparece en `false` | El taller requiere PostgreSQL. No cambies el motor a SQLite. |
| `tabla_contratos` aparece en `false` | Completa el Mini 2 y ejecuta `makemigrations contratos` y `migrate`. |
| Un cambio de `settings.py` no aparece | Detén `runserver` con Ctrl+C y vuelve a iniciarlo. |

## React no llega a Django

| Error o síntoma | Qué revisar |
|---|---|
| El panel no recibe respuesta | Comprueba que Django esté activo en el puerto 8000. |
| Error CORS durante el Mini 8 | Es el resultado esperado de ese reto. |
| Error CORS durante otros retos | Completa el Mini 9 y reinicia Django. Autoriza ambos orígenes: `localhost:5173` y `127.0.0.1:5173`. |
| HTTP 404 en una ruta de un reto | Esa vista o ruta todavía no está implementada. Revisa la guía del Mini. |
| HTTP 400 durante el Mini 4 | Es correcto: el serializer debe rechazar el JSON de prueba. |
| HTTP 405 | La ruta existe, pero no acepta ese método. Comprueba si el reto pide GET, POST o DELETE. |
| HTTP 500 | Lee el último error de la terminal de Django. Ahí aparece la línea que falló. |

## Retos de React

| Error o síntoma | Qué revisar |
|---|---|
| El contador no cambia en pantalla | Usa `setState` para cambiar el estado; cambiar una variable normal no redibuja el componente. |
| La lista queda vacía después del Mini 14 | Con paginación, la lista está en `datos.results`. |
| React muestra un aviso sobre `key` | En el `map()`, usa `contrato.id_contrato` como `key`. |

## Retos del Día 3

| Error o síntoma | Qué revisar |
|---|---|
| El generador dice que no existe la tabla | Completa y migra el Mini 2. |
| El generador falla por una clave duplicada | Ya existe una carga anterior. No lo repitas hasta limpiar los datos de prueba con el Mini 15. |
| Las estadísticas están vacías | Carga datos de prueba y comprueba que la API devuelva `metricas`, `por_estado` y `por_dia`. |
| La gráfica del Mini 12 sigue vacía | Es el reto: conecta los conteos de `informe.por_estado` con el prop `datos` de `GraficaEstados`. |
| La búsqueda no filtra | En el Mini 13, configura `SearchFilter` y los campos buscables en `ContratoViewSet`. |
| El listado trae todos los contratos | Completa el Mini 14 y reinicia Django. Con paginación, React debe leer `results`. |
| El Mini 15 da error | Revisa la vista DELETE y su ruta. Úsala solo con datos de prueba: borra toda la tabla. |

## Progreso del panel

El progreso se guarda en `localStorage`, dentro del navegador. No se guarda en
PostgreSQL. Cambiar de navegador o borrar los datos del sitio reinicia el
tablero. El botón **Reiniciar progreso** borra las aprobaciones de este
navegador.

## Para aprender más

- [Errores de Django](https://docs.djangoproject.com/en/6.1/ref/exceptions/)
- [Serializers de DRF](https://www.django-rest-framework.org/api-guide/serializers/)
- [CORS en MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

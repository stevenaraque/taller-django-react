# 07 · Solución de problemas

Tabla de diagnóstico rápido por síntoma, con la misión y el archivo donde vive
cada ajuste. Antes de todo: verifique que ambos servicios estén vivos
(backend en el 8000, frontend en el 5173) y mire las pistas del panel
`api.js` y de la terminal de Django — tanto el panel como el taller convierten
los errores en pistas a propósito.

## Arriba: síntomas y diagnósticos

### El backend no arranca

| Síntoma | Causa probable | Dónde |
|---|---|---|
| "Falta la variable X en el archivo Backend/.env" | `.env` no creado o incompleto | Mini 1: copie `.env.example` a `.env` y llene las variables |
| No conecta a la base de datos (`base_datos: false`) | Servicio de PostgreSQL apagado, clave mal, puerto distinto | `.env` (DB_HOST, DB_PORT), servicio de Postgres |
| `motor_bueno: false` con base viva | `DATABASES` apuntando a SQLite | El taller prohíbe SQLite; el motor debe ser `django.db.backends.postgresql` (settings.py no lo cambia usted: revise que el `.env` cargó) |
| Mensaje de migración no aplicada | RETO 1 o 2 incompleto | `python manage.py migrate` (y `makemigrations contratos` en el RETO 2) |
| El programa arranca pero la llave es el placeholder | `SECRET_KEY` sigue siendo `TODO_GENERA_UNA_CLAVE_SECRETA`: el arranque solo valida que exista, no que cambie, pero una llave conocida anula la seguridad | Mini 1: genere una propia con el comando comentado en `.env.example` |

### El panel no se comunica con el backend

| Síntoma | Causa probable | Dónde |
|---|---|---|
| "La petición no cruzó el puerto" (tipo `cors`) | runserver apagado, URL mal o CORS cerrado | Verificar 8000 vivo; si estamos en Mini 8 ES el fallo esperado; para pasarlo, RETO 9 |
| Error de CORS en F12 solo en `/api/contratos/` | RETO 9 no aplicado o `runserver` no reiniciado | `Backend/config/settings.py`: `INSTALLED_APPS` + `MIDDLEWARE` (antes de CommonMiddleware) + `CORS_ALLOWED_ORIGINS` |
| OPTIONS falla pero GET manual en el 8000 funciona | Origen del panel no autorizado | Agregar `http://localhost:5173` y `http://127.0.0.1:5173` |
| La petición llega a una ruta que no existe (404 crudo) | Rutas del RETO 5 / 11-15 no encendidas | `Backend/contratos/urls.py` y el bloque correspondiente en `views.py` |

### Respuestas HTTP "malas" que son victoria

| Código | Qué significó | Qué hacer |
|---|---|---|
| HTTP 400 bien formado | El serializer rechazó datos malformados | Es la **victoria** del Mini 4; si persiste en un flujo normal, revise qué campo no cumple |
| HTTP 405 | Verbo HTTP no permitido en esa ruta | Rutas/comments quizá sin montar (RETO 5) o verbo distinto al de la ficha |
| HTTP 404 | Recurso o ruta inexistente | Normal en `999999` del Mini 5; si llega en el listado, revise el include del router |
| HTTP 500 | Excepción en la vista | Ver la terminal de Django: el traceback completo vive ahí |

### Errores del Día 2 (React)

| Síntoma | Causa probable | Dónde |
|---|---|---|
| Cambia el valor pero no la pantalla | No se llamó al `setState` | Mini 7: el ciclo es clic → setState → re-render |
| El `map()` no renderiza nada con paginación activa | El JSON regulado trae los datos en `results` | RETO 10 + Mini 14: usar `datos.results` |
| `key` warning en React | Key inestable en el `map` | Usar `contrato.id_contrato` (única por diseño) |

### Errores del Día 3 (Big Data)

| Síntoma | Causa probable | Dónde |
|---|---|---|
| `generar_datos.py` se detiene avisando que falta la tabla | RETO 2 sin migrar | Migrar primero; el script no crea la tabla por usted |
| Estadísticas llegan vacías | El dataset aún no se inyectó | Correr `python generar_datos.py` antes del Día 3 |
| `InyeccionMasivaView` devuelve 500 | Excepción dentro del bulk_create (tipos, Decimal, unique) | Ficha del RETO 11 en `views.py`; la terminal de Django dice la línea |
| La búsqueda del Mini 13 no filtra | Falta `filter_backends` o `search_fields` | RETO 13: las dos variables de clase del `ContratoViewSet` |
| El listado aplasta el navegador | RETO 14 sin aplicar | Descomentar `REST_FRAMEWORK` en `settings.py` y reiniciar runserver |
| El Limpiador devuelve 500 | `delete()` con bucles o ruta sin montar | RETO 15: una sola llamada `Contrato.objects.all().delete()` |

## Progreso perdido en el panel

El progreso vive en `localStorage` del navegador (no en el backend):

- Clave de misiones: `taller-secop-misiones-aprobadas` (lista de números).
- Clave del Modo instructor: `taller-secop-modo-instructor`.

Si se cambia de navegador o de computador, el tablero arranca en cero: para
ensayar use el botón **Modo instructor**, que desbloquea todo sin trucos.

## Recordatorio de arranque diario

1. Terminal 1 (backend): `cd Backend`, venv activado, `python manage.py runserver`.
2. Terminal 2 (frontend): `cd Frontend`, `npm run dev`.
3. Si el código cambia en `settings.py` (RETOS 9 y 14), **reinicie el
   runserver**: los cambios de settings no aplican solos.

Y cuando el panel señale una pista que no se entiende, consulte
[Arquitectura](02-arquitectura.md): la sección de `api.js` explica cada tipo de
`FallaApi` y dónde rompió la cadena fetch → respuesta.

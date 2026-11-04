# Día 3: Pentatlón Big Data

Hoy practicarás cinco tareas con muchos contratos. Antes de empezar, confirma
que el Mini 2 está hecho y que existe la tabla `contratos_contrato`. El Mini 12
necesita al menos un contrato para comprobar la gráfica.

Para descargar contratos reales, sigue [Datos de SECOP II](06-dataset-y-datos-masivos.md).
El importador omite los identificadores que ya existen en la base.

## Mini 11: La Avalancha

**Archivos:** `Backend/contratos/views.py` y `Backend/contratos/urls.py`.

Tu trabajo es escribir `InyeccionMasivaView` con este comportamiento:

1. `cantidad` debe ser un entero entre 1 y 50000; si no, responde `400`.
2. Pide filas al dataset con `consultar_pagina(limite, desplazamiento)`, la
   función que viene lista en `fuente_secop.py`. Usa `TAMANO_PAGINA` como
   tamaño de página y ve avanzando `desplazamiento` hasta reunir `cantidad`
   contratos nuevos o hasta que la API no entregue más filas.
3. Convierte cada fila con `fila_a_contrato(fila)`. Si devuelve `None`, la fila
   es inválida y se omite.
4. Comprueba con la base qué `id_contrato` ya existen para no repetirlos y
   guarda los nuevos con `bulk_create()` usando `batch_size=1000` y
   `ignore_conflicts=True`.
5. Mide el tiempo con `time.perf_counter()`, calcula `por_segundo` y responde
   con `creados`, `recibidos`, `omitidos`, `total`, `ms` y `por_segundo`.
6. Registra la ruta `contratos/inyeccion/` en `urls.py`.

Escribe la lógica en una función `descargar_contratos(cantidad)` en el mismo
`views.py` y deja que la vista solo valide y la llame: así funcionan igual el
panel y el comando `python manage.py descargar_secop`, que importa esa
función.

**Comprueba:** pulsa **Descargar contratos**. Primera vez, descarga algo
pequeño (por ejemplo 100). El panel muestra cuántas filas recibió la API,
cuántos contratos nuevos entraron y cuántos hay en PostgreSQL.

El comando `python manage.py descargar_secop` (para cargar datos fuera del
panel) usa el mismo módulo de ayuda que este reto. Puedes escribir la vista
primero y copiarte de tu propia solución, o al revés.

**Documentación:** [`bulk_create()` en Django](https://docs.djangoproject.com/en/6.1/ref/models/querysets/#bulk-create).

## Mini 12: El Analista

**Archivos:** `Backend/contratos/views.py`, `Backend/contratos/urls.py` y
`Frontend/src/features/misiones/dia3/Mini12_Analista.jsx`.

1. Crea `EstadisticasView` y conéctala a `GET /api/contratos/estadisticas/`.
2. Usa `aggregate()` para calcular el conteo, la suma, el promedio y el máximo
   de `valor_total`.
3. Usa `annotate()` para agrupar contratos por estado y por fecha.
4. Conecta los datos de `por_estado` con la gráfica vacía de la misión. La
   gráfica recibe una lista de filas con `estado` y `contratos` en el prop
   `datos`; si `por_estado` es un objeto, conviértelo a esa lista.

La respuesta del backend debe contener:

- `metricas`: `total_contratos`, `suma_valor_total`,
  `promedio_valor_total` y `maximo_valor_total`.
- `por_estado`: cada estado con `contratos` (conteo) y `suma` (valor total).
- `por_dia`: cada fecha con el conteo de contratos firmados ese día.

**Comprueba:** pulsa **Pedir el informe del analista** y luego **Verificar la
gráfica**. El panel compara los estados y conteos de la gráfica con
`por_estado`.

**Documentación:** [agregaciones en Django](https://docs.djangoproject.com/en/6.1/topics/db/aggregation/)
y [gráficas Recharts](https://recharts.github.io/en-US/guide/).

## Mini 13: La Aguja en el Pajar

**Archivo:** `Backend/contratos/views.py`, en `ContratoViewSet`.

Configura las tres herramientas de filtrado del ViewSet:

1. `filter_backends` con `SearchFilter` y `OrderingFilter`.
2. `search_fields`: `id_contrato`, `entidad_compradora` y `descripcion`.
3. Un filtro propio por estado: en `get_queryset()`, si llega el parámetro
   `?estado=`, filtra con `estado__iexact=estado`. Así el usuario puede pedir,
   por ejemplo, solo los contratos `Cerrado`.
4. `ordering_fields`: `valor_total` y `fecha_firma`, para que
   `?ordering=-valor_total` ordene de mayor a menor.

**Comprueba:** pulsa **Cazar la aguja**. El panel hace tres pruebas seguidas:
la búsqueda, un `?estado=` que debe devolver solo contratos de ese estado y un
`?ordering=-valor_total` que debe quedar ordenado de mayor a menor.

**Documentación:** [búsqueda de DRF](https://www.django-rest-framework.org/api-guide/filtering/#searchfilter),
[get_queryset](https://www.django-rest-framework.org/api-guide/generic-views/#overriding-queryset-methods)
y [OrderingFilter](https://www.django-rest-framework.org/api-guide/filtering/#orderingfilter).

## Mini 14: El Regulador

**Archivos:** `Backend/contratos/paginacion.py` y `Backend/config/settings.py`.

1. Crea `contratos/paginacion.py` con una clase que herede de
   `PageNumberPagination`, con `page_size = 50` y
   `page_size_query_param = 'page_size'`. Así el cliente puede pedir páginas
   más pequeñas con `?page_size=5`.
2. Apunta `DEFAULT_PAGINATION_CLASS` en `settings.py` a tu clase y reinicia
   `runserver`.

**Comprueba:** el panel revisa el objeto con `count`, `next`, `previous` y
`results`, y luego verifica que `?page_size=5` realmente recorte la página a
cinco filas.

**Documentación:** [paginación de DRF](https://www.django-rest-framework.org/api-guide/pagination/).

## Mini 15: El Limpiador

**Archivos:** `Backend/contratos/views.py` y `Backend/contratos/urls.py`.

Crea una vista DELETE con dos comportamientos:

1. Si llega sin `{"confirmar": true}` en el cuerpo, responde `400` y **no
   borra nada**. Borrar todos los contratos es una acción que se pide antes.
2. Con la confirmación, borra con `QuerySet.delete()` y responde con
   `eliminados` (el conteo) y `ms`.

**Comprueba:** el panel primero lanza un DELETE sin confirmación y exige 400;
luego lanza el DELETE confirmado y cuenta los contratos antes y después.

**Atención:** esta vista borra todos los contratos, reales o de prueba. Úsala
solo con la base del taller.

**Documentación:** [`delete()` en Django](https://docs.djangoproject.com/en/6.1/ref/models/querysets/#delete).

## Cierre

Revisa que las 15 misiones estén aprobadas. Si vas a repetir la carga, primero
borra los datos de prueba con el Mini 15.

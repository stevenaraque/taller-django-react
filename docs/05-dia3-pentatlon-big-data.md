# Día 3: Pentatlón Big Data

Hoy practicarás cinco tareas con muchos contratos. Antes de empezar, confirma
que el Mini 2 está hecho y que existe la tabla `contratos_contrato`. El Mini 12
necesita al menos un contrato para comprobar la gráfica.

Para cargar datos de prueba, sigue [Datos de prueba](06-dataset-y-datos-masivos.md).
No ejecutes el generador dos veces sobre los mismos datos: sus identificadores
se repiten.

## Mini 11: La Avalancha

**Archivos:** `Backend/contratos/views.py` y `Backend/contratos/urls.py`.

Crea `InyeccionMasivaView`. Debe recibir `cantidad`, crear contratos con
`bulk_create()` por lotes y responder con `creados`, `ms` y `por_segundo`.

**Comprueba:** el panel envía un POST a `/api/contratos/inyeccion/`. Prueba
primero con una cantidad pequeña.

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

Activa `SearchFilter` y configura la búsqueda en `id_contrato`,
`entidad_compradora` y `descripcion`.

**Comprueba:** busca, por ejemplo, `Ministerio` en
`GET /api/contratos/?search=Ministerio`.

**Documentación:** [búsqueda de DRF](https://www.django-rest-framework.org/api-guide/filtering/#searchfilter).

## Mini 14: El Regulador

**Archivo:** `Backend/config/settings.py`.

Configura la paginación global con `PageNumberPagination` y un tamaño de página
de 50. Después reinicia `runserver`.

**Comprueba:** el listado cambia de una lista a un objeto con `count`, `next`,
`previous` y `results`. En React, los contratos quedan dentro de `results`.

**Documentación:** [paginación de DRF](https://www.django-rest-framework.org/api-guide/pagination/).

## Mini 15: El Limpiador

**Archivos:** `Backend/contratos/views.py` y `Backend/contratos/urls.py`.

Crea una vista DELETE que borre los contratos de prueba con una llamada a
`QuerySet.delete()`. El panel pide confirmar antes de enviar la petición.

**Atención:** esta acción borra todos los contratos de esa tabla. Úsala solo
con datos de prueba.

**Comprueba:** el panel cuenta los contratos antes y después. Tras el borrado,
el conteo debe ser cero.

**Documentación:** [`delete()` en Django](https://docs.djangoproject.com/en/6.1/ref/models/querysets/#delete).

## Cierre

Revisa que las 15 misiones estén aprobadas. Si vas a repetir la carga, primero
borra los datos de prueba con el Mini 15.

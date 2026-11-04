# 05 · Día 3 — Pentatlón Big Data (misiones 11 a 15)

El cierre del taller es una arena de alto rendimiento: cinco asaltos contra
50.000 contratos reales del SECOP II. El concepto que une el día: **menos viajes
al motor, más trabajo en una sola sentencia**. Cada misión cronometra los
milisegundos: la velocidad es la métrica.

Antes de comenzar, prepare el dataset con `python generar_datos.py`
(herramienta de instructores; ver
[Dataset y datos masivos](06-dataset-y-datos-masivos.md)). Requiere el RETO 2
(migrado) y una vez cargados los datos, el resto del día va volando.

---

## Mini 11 · La Avalancha (RETO 11) — Asalto 1

**Archivos:** `Backend/contratos/views.py` + `Backend/contratos/urls.py`

**Teoría:** una ida al motor por **lote** de mil filas, no una ida por fila.
Un `save()` por registro son 50.000 idas y vueltas a la bóveda;
`bulk_create` las colapsa en lotes (`batch_size=1000`).

**Lo que se construye** (ficha comentada en `views.py`): la vista
`InyeccionMasivaView` para `POST /api/contratos/inyeccion/` que recibe
`{"cantidad": N}` y responde `{creados, ms, por_segundo}` — la tabla y la
velocidad que pinta el panel.

**Pasos orientativos:**

1. Cronometre con `time.perf_counter()` antes y después.
2. Construya las instancias `Contrato(...)` en Python (implícitamente coherentes:
   `id_contrato` único, entidad, `DecimalField` en `valor_total`, estado y
   fecha de firma) a lo grande.
3. Una sola llamada `bulk_create(lista, batch_size=1000)`.
4. Responda con `creados`, `ms` y `por_segundo`.

**Cómo se aprueba:** el panel envía el POST; con `respuesta.ok` y
`creados > 0` el asalto queda aprobado y se pintan los ms y los
registros/segundo. Compare los números contra el `save()` uno por uno de la
teoría: sería hacer 50.000 idas al motor.

**Retorno al dataset:** si la tabla quedó con basura de pruebas, el
[El Limpiador (Mini 15)](#mini-15--el-limpiador-reto-15--asalto-5) es su
asalto de cierre; no borre a mano por Admin.

---

## Mini 12 · El Analista (RETO 12) — Asalto 2

**Archivos:** `Backend/contratos/views.py` + `Backend/contratos/urls.py`

**Teoría:** el ORM calcula en la bóveda, no en Python. Primero se proyecta la
query SQL equivalente (larga) y después las **dos herramientas cortas** del ORM:

- `aggregate()`: en una sola query pide la suma global, promedio, máximo y
  conteo (`Sum`, `Avg`, `Max`, `Count`) sobre `valor_total`.
- `annotate()`: después agrupa: contratos por estado con
  `values('estado').annotate(...)` y por `fecha_firma` (para el gráfico del panel).

**Lo que se construye:** `EstadisticasView` para
`GET /api/contratos/estadisticas/` que responde `{metricas, por_estado,
por_dia}` con un dictado legible.

**Por qué brilla:** el dataset es real (50 mil contratos de la compra pública
colombiana) y los milisegundos no mienten: las métricas salen en una ida
por Postgres, no con bucles en Python.

---

## Mini 13 · La Aguja en el Pajar (RETO 13) — Asalto 3

**Archivo:** `Backend/contratos/views.py` (la del RETO 5, misma clase)

**Teoría:** búsqueda instantánea sobre 50 mil registros **sin una línea de
SQL** y sin tocar el frontend. El `SearchFilter` del DRF arma el `ILIKE`
contra los campos declarados y Postgres responde.

**Lo que se construye:** dos variables de clase en el `ContratoViewSet`
del RETO 5 (ficha comentada en el bloque RETO 13):

- `filter_backends = [SearchFilter]`
- `search_fields = ['id_contrato', 'entidad_compradora', 'descripcion']`

**Cómo se aprueba:** el panel busca una palabra (por ejemplo "Ministerio") en
`GET /api/contratos/?search=<palabra>` y compara el tiempo y el conteo contra
el GET completo: la aguja debe dejar ambos muy por debajo.

**Pistas:**

- El SearchFilter busca en los campos declarados que tengan el prefijo
  por defecto (`^` = empieza con). Sin prefijo el match es total.
- No toque el frontend: el consumo ya existe (`?search=`).

---

## Mini 14 · El Regulador (RETO 14)

**Archivo:** `Backend/config/settings.py`

**Teoría:** 50.000 filas en un JSON aplastan la red **y** el navegador.
La paginación se configura **una vez y aplica a toda la API** (la de todos los
viewsets, incluido el del RETO 5).

**Lo que se construye:** descomentar el bloque `REST_FRAMEWORK` al final de
`settings.py` (ficha comentada ahí):

- `DEFAULT_PAGINATION_CLASS = 'rest_framework.pagination.PageNumberPagination'`
- `PAGE_SIZE = 50`

**Cómo se aprueba:** el panel compara la respuesta antes/después: crudo
(lista) vs regulado (`{count, next, previous, results}`). Aprueba al ver el
caudal regulado por primera vez. Reinicie el runserver para aplicar settings.

**Pistas:**

- Con la paginación activa, el `map()` del RETO 10 debe mirar
  `datos.results` (y el listado ya no es el crudo sino el dict regulado).
- El enrutamiento ya entiende: `?page=2` de las respuestas reguladas llega al
  panel como siempre con `next`/`previous`.

---

## Mini 15 · El Limpiador (RETO 15) — Asalto 5

**Archivos:** `Backend/contratos/views.py` + `Backend/contratos/urls.py`

**Teoría:** el cierre del Pentatlón: un `delete()` en el QuerySet depura la
tabla completa en **una sola sentencia DELETE** en Postgres — muy distinto de
50.000 DELETE uno por uno (otra vez el tema del día: menos viajes, más
trabajo por consulta).

**Lo que se construye:** `LimpiezaMasivaView` para
`DELETE /api/contratos/limpieza/` que cronometra la sentencia, ejecuta la
borrada en una sola llamada y responde `{eliminados, ms}`.

**Cómo se aprueba:** el panel mide el número de registros **antes** y
**después** del borrado (vía la batería `/api/estado/`) y cronometra la
sentencia. Con la tabla limpia y los ms medidos, los 15 minis quedan aprobados
y el taller completo llega a la meta.

**Pistas:**

- `Contrato.objects.all().delete()` — una sola llamada, no bucles.
- El panel ya sabe cuántos registros había: el conteo sale de la batería.

---

## Puertas de cierre del taller

- Las misiones del panel deben quedar todas en verde (o el instructor termina
  con el Modo instructor activado para ensayar).
- El conteo de `/api/estado/` vuelve a 0 tras el Limpiador: la tabla queda
  lista para repetir el taller desde cero con una avalancha nueva.
- Para llevar el proyecto más allá del taller, la recomendación es recorrer
  [Arquitectura](02-arquitectura.md) y leer los bloques
  `⏸ INSTRUCTORES (Steven/Yesid)` de cada archivo: cada uno explica el porqué
  del pedazo que lo rodea.

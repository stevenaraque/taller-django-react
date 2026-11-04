# 03 · Día 1 — El Velocista (misiones 1 a 5)

El primer día construye el esqueleto del backend: la bóveda de credenciales,
el modelo, el Admin, el serializer y el CRUD completo con un `ModelViewSet`.
Todo se verifica desde el panel en el 5173; la teoría previa de cada misión
también vive en el componente `Frontend/src/dia1/MiniN_*.jsx`.

Convención: las instrucciones exactas de cada reto están comentadas en el
archivo fuente correspondiente (bloque `TODO (RETO n)`). Esta guía explica el
porqué y las pistas; la solución la escribe el estudiante.

---

## Mini 1 · La Bóveda (RETO 1)

**Archivo:** `Backend/.env` (copia de `Backend/.env.example`)

**Teoría:** variables de entorno y secretos. La clave de PostgreSQL nunca vive
en el código: subirla a un repositorio es regalársela a todos. `settings.py`
carga `.env` con `python-dotenv` y detiene el arranque con instrucciones si
falta alguna variable.

**Pasos:**

1. Copie `.env.example` a `.env` (ver [Inicio rápido](01-inicio-rapido.md)).
2. Llene `SECRET_KEY`, `DEBUG`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`,
   `DB_HOST`, `DB_PORT` con datos reales.
3. `python manage.py migrate` y `python manage.py runserver`.

**Cómo se aprueba:** el panel consulta `GET /api/estado/`; con
`base_datos: true` y `motor_bueno: true` (PostgreSQL vivo, no SQLite) el Mini 1
queda aprobado solo.

**Pistas:**

- El comando para generar `SECRET_KEY` está comentado dentro de `.env.example`.
- Si el arranque se detiene con "Falta la variable X", es el diseño del taller:
  complete esa variable y vuelva a intentar.

---

## Mini 2 · El Arquitecto (RETO 2)

**Archivo:** `Backend/contratos/models.py`

**Teoría:** un modelo Django es la especificación de una tabla. Antes de
escribir una línea observe una fila real del dataset SECOP II y piense en cada
campo como "qué guardo aquí y cuánta memoria gasta": `CharField`, `TextField`,
`DecimalField`, `DateField`.

**Lo que se construye** (especificación completa comentada en `models.py`):
el modelo `Contrato` con `id_contrato` (único, nunca se repite en el dataset),
`entidad_compradora`, `descripcion`, `valor_total` (campo clave del RETO 12),
`estado` (campo clave del annotate y del SearchFilter) y `fecha_firma`
(campo clave para agrupar métricas por período).

**Pasos:**

1. Escriba el modelo siguiendo la especificación comentada en `models.py`,
   incluido `def __str__` con un rótulo legible.
2. Migre: `python manage.py makemigrations contratos` y `python manage.py migrate`.

**Cómo se aprueba:** la batería busca por **nombre de tabla**:
`contratos_contrato` debe existir en PostgreSQL. No renombre la tabla.

**Pistas:**

- `unique=True` en `id_contrato` cumple la regla "nunca se repite en el dataset".
- Sin migración no hay tabla y el resto del taller no arranca: migre
  antes de continuar.

---

## Mini 3 · El Jefe Maestro (RETO 3)

**Archivo:** `Backend/contratos/admin.py`

**Teoría:** el Admin de Django es una interfaz lista para administrar los
modelos, pero cada modelo debe **registrarse** para aparecer. Aquí se crea el
primer contrato a mano, sin una línea de API.

**Pasos:**

1. Registre el modelo en `admin.py` (las dos líneas exactas están comentadas ahí).
2. Cree un superusuario: `python manage.py createsuperuser`.
3. Entre a `http://127.0.0.1:8000/admin/` y cree un (1) contrato con datos reales.

**Cómo se aprueba:** la batería verifica tres banderas a la vez: la tabla
existe (`tabla_contratos`), el modelo está registrado (`modelo_en_admin:
true`) y hay al menos un contrato (`contratos_registrados >= 1`; el conteo
sale de la tabla, por eso se ve el registro aunque venga del Admin y no de la
API).

---

## Mini 4 · El Escudo (RETO 4)

**Archivo:** `Backend/contratos/serializers.py`

**Teoría:** Django no confía en el exterior. El serializer es el guardia de la
puerta: recibe JSON, lo revisa campo por campo y si algo no cumple responde
**HTTP 400** sin que la basura toque los modelos ni la base de datos. El mismo
serializer sirve para leer (filas → JSON), escribir (JSON → filas validadas) y
rechazar (400 bien formado).

**Pasos:** declare el `ModelSerializer` con los campos del modelo (la ficha
exacta está comentada en `serializers.py`).

**Cómo se aprueba:** el panel lanza UN JSON malformado a propósito (por ejemplo
`valor_total = "hola"`). Se aprueba solo con un HTTP 400 bien formado
(con su dictado de errores). Hasta que exista la ruta del RETO 5, la prueba
queda "sin ruta": el propio panel lo explica.

**Pistas:**

- `fields = '__all__'` deja pasar todos los campos del modelo.
- El 400 debe explicarse: DRF devuelve el detalle por campo; el escudo no
  escupe silencios.

---

## Mini 5 · El Velocista (RETO 5)

**Archivos:** `Backend/contratos/views.py` y `Backend/contratos/urls.py`

**Teoría:** un `ModelViewSet` más un `DefaultRouter` responden **todos los
verbos HTTP** del CRUD con muy pocas líneas contra `ContratoSerializer`.
Esta es la clase que también retomará el RETO 13 (SearchFilter).

**Pasos** (fichas comentadas en `views.py` y `urls.py`):

1. Declare `ContratoViewSet` con `queryset` ordenado (sugerencia comentada:
   por `-fecha_firma`) y `serializer_class`.
2. En `urls.py` registre el viewset en el router (ya declarado) y active la
   inclusión de las rutas del router.

**Cómo se aprueba:** el panel cronometra el GET contra la colección
(`/api/contratos/` → HTTP 200 con la lista) y contra un contrato inexistente
(`/api/contratos/999999/` → HTTP 404). Aprueba con el 200; el 404 es la
segunda lectura de la ficha.

**Pistas:**

- El router ya está declarado en `contratos/urls.py`: solo hay que llenarlo y
  encender `include(router.urls)`.
- Con la ruta viva, el Mini 4 queda desbloqueado de su "sin ruta": pruebe
  también el chequeo del Escudo.

---

## Puertas de cierre del día

- `GET /api/estado/` debe mostrar todas las banderas del Día 1 en verde
  (con al menos un contrato registrado).
- De `/admin/` se puede crear más contratos a mano si la clase quiere
  comparar el Admin contra la API.
- Con el Mini 5 aprobado se desbloquea el
  [Día 2 · El Portero](04-dia2-el-portero.md).

"""
Models de la app `contratos`.

DIA 1 - Mini 2 · "El Arquitecto"
El proyecto NO trae el modelo escrito: el estudiante lo construye aqui,
paso a paso, con la especificacion del dataset real SECOP II (Colombia).
"""

# ==============================================================================
# TODO (RETO 2) - Mini 2 · El Arquitecto: construir el modelo `Contrato`
# ==============================================================================
#
# ⏸ INSTRUCTORES (Steven/Yesid): antes de que el estudiante escriba una
#    linea, proyecta una fila REAL de SECOP II y explique cada tipo de
#    campo (CharField, TextField, DecimalField, DateField) como "que
#    guardo aqui, y cuanta memoria gasta". Cuando esten listos, sueltan
#    el teclado y el estudiante construye el almacen.
#
# Crea el modelo `Contrato` con esta estructura simplificada pero
# realista del dataset SECOP II de contratos electronicos:
#
#   id_contrato         CharField(max_length=60, unique=True)
#                       numero del contrato; NUNCA se repite en el dataset.
#   entidad_compradora  CharField(max_length=180)
#                       quien compra: ministerio, alcaldia, universidad...
#   descripcion         TextField(blank=True)
#                       el texto libre del objeto a contratar.
#   valor_total         DecimalField(max_digits=16, decimal_places=2)
#                       CAMPO CLAVE del RETO 12 (Sum, Avg, Max en Postgres).
#   estado              CharField(max_length=20, default='Activo')
#                       valores reales: 'Activo', 'Terminado', 'Suspendido'.
#                       CAMPO CLAVE del annotate y del SearchFilter.
#   fecha_firma         DateField()
#                       CAMPO CLAVE para agrupar metricas por periodo.
#
# Reglas del modelo:
#   * Agrega `def __str__(self)` y devuelve un rotulo legible por humanos.
#   * class Meta con la tabla plain no es OBLIGACION: Postgres la nombra
#     `contratos_contrato` y es ELLA la que consulta la bateria de
#     diagnostico /api/estado/ - no la renombres.
#
# Cuando el modelo este listo, MIGRALO antes de seguir (sin migracion no
# hay tabla y el resto del taller queda en pies de barro):
#     python manage.py makemigrations contratos
#     python manage.py migrate
#
# Resultado esperado: la tabla `contratos_contrato` vive en PostgreSQL
# (el Mini 1 abrio la bóveda; este reto construyo el almacen).
# ==============================================================================

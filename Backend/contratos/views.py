"""
Vistas de la app `contratos`.

DIA 1 - Mini 5 · "El Velocista"  -> ModelViewSet + Router (RETO 5)
DIA 3 - Pentatlon Big Data       -> bulk_create, aggregate, SearchFilter,
                                    paginacion y borrado masivo (RETOS 11-15)

Las vistas de los retos NO estan implementadas: el estudiante las escribe
donde esta el TODO (RETO n). Solo la bateria de diagnostico
`EstadoJardinView` viene activa, porque las misiones del panel React la
consultan para verificar el avance dia por dia.
"""
from django.apps import apps
from django.db import connection
from rest_framework.response import Response
from rest_framework.views import APIView


# ==============================================================================
# Bateria de diagnostico (VIENE LISTA: no es un reto).
#
# GET /api/estado/ responde banderas "on/off" que las misiones de React
# traducen a Aprobado/Aun-no. Es el tablero que los instructores
# (Steven/Yesid) proyectan para mostrar el avance en vivo:
#
#   base_datos             -> ¿el motor de DATABASES responde? (Mini 1·Boveda)
#   motor_bueno            -> ¿es PostgreSQL y no SQLite?     (Mini 1)
#   tabla_contratos        -> ¿ya existe la tabla del modelo? (Mini 2)
#   contratos_registrados  -> ¿cuantos registros hay guardados? (Mini 3 y 15)
#   modelo_en_admin        -> ¿el modelo ya aparece en el Admin? (Mini 3)
# ==============================================================================
class EstadoJardinView(APIView):
    """
    Bateria de diagnostico del taller. La usan las misiones de React
    para aprobar los minis automaticamente cuando el backend responde
    lo que cada misión espera.
    """

    # El estudiante NO borra ni modifica esta vista: es el juez del taller.
    #
    # ⏸ INSTRUCTORES (Steven/Yesid): ANDAMIO DEL TALLER. El panel React
    #    (:5173) lee esta batería DESDE EL NAVEGADOR y la política de
    #    mismo origen la bloquea si la respuesta no se autoriza. Este
    #    andamio abre la puerta SOLO para esta vista. Abrir el CORS de
    #    TODA la API sigue siendo el RETO 9 (Mini 9 · El Portero): cuando
    #    el estudiante conecte corsheaders en settings.py, ese middleware
    #    manda (esta cabecera se sobreescribe, nunca se duplica).
    def _con_andamio_cors(self, request, datos):
        respuesta = Response(datos)
        origen = request.headers.get('Origin', '')
        if origen in ('http://localhost:5173', 'http://127.0.0.1:5173'):
            respuesta['Access-Control-Allow-Origin'] = origen
            respuesta['Access-Control-Allow-Methods'] = 'GET, OPTIONS'
            respuesta['Vary'] = 'Origin'
        return respuesta

    def get(self, request):
        # 1. La Boveda: ¿el motor configurado en DATABASES esta vivo?
        try:
            connection.ensure_connection()
            base_datos_ok = True
        except Exception:
            base_datos_ok = False

        motor = connection.settings_dict.get('ENGINE', '')
        motor_bueno = base_datos_ok and 'postgresql' in motor

        # 2. El Almacen: ¿ya migro el modelo Contrato? Se mira por el
        #    NOMBRE de la tabla (Mini 2 genera `contratos_contrato`),
        #    sin importar el modelo (que todavia no existe en esta etapa).
        tabla_contratos = False
        total_contratos = 0
        nombre_tabla = 'contratos_contrato'

        tablas_de_postgres = connection.introspection.table_names()
        if nombre_tabla in tablas_de_postgres:
            tabla_contratos = True
            with connection.cursor() as cursor:
                cursor.execute(f'SELECT COUNT(*) FROM "{nombre_tabla}"')
                total_contratos = cursor.fetchone()[0]

        # 3. El Jefe Maestro: ¿el estudiante ya registro el modelo en el
        #    Admin (RETO 3)? Si nunca hay modelo, el cambia es innecesario.
        modelo_en_admin = False
        if any(
            modelo._meta.app_label == 'contratos'
            for modelo in apps.get_app_config('contratos').get_models()
        ):
            from django.contrib import admin  # importacion local a proposito
            modelo_en_admin = any(
                _referencia_modelo(modelo) == 'contratos.contrato'
                for modelo in admin.site._registry
            )

        return self._con_andamio_cors(request, {
            'base_datos': base_datos_ok,
            'motor_bueno': motor_bueno,
            'tabla_contratos': tabla_contratos,
            'contratos_registrados': total_contratos,
            'modelo_en_admin': modelo_en_admin,
        })


def _referencia_modelo(modelo):
    """Devuelve 'app.Modelo' para comparar el registro del Admin."""
    return f'{modelo._meta.app_label}.{modelo._meta.model_name}'


# ==============================================================================
# TODO (RETO 5) - Mini 5 · El Velocista: encender el ModelViewSet + Router
# ==============================================================================
#
# ⏸ INSTRUCTORES (Steven/Yesid): esta es la clase que resuelve TODOS los
#    verbos HTTP con 3 lineas. Antes de que el estudiante escriba,
#    proyecta esta demo: abre el navegador en /api/contratos/ y ejecuta
#    el mismo GET con el Velocista cronometrando los ms (200 vs 404).
#
# PASO 1 · La vista (escribe aqui mismo, junto de estos comentarios):
#
#   from rest_framework import viewsets
#   from .models import Contrato
#   from .serializers import ContratoSerializer
#
#   class ContratoViewSet(viewsets.ModelViewSet):
#       "Una sola clase responde TODOS los verbos del SetRobo."
#       queryset = Contrato.objects.all().order_by('-fecha_firma')
#       serializer_class = ContratoSerializer
#
# PASO 2 · Las rutas (en.urls.py de esta app):
#
#   from django.urls import path, include
#   from rest_framework.routers import DefaultRouter
#   from .views import ContratoViewSet
#
#   router = DefaultRouter()
#   router.register(r'contratos', ContratoViewSet, basename='contrato')
#   urlpatterns = [path('', include(router.urls))]
#
# Chequeo del Velocista (mision 1.5 del panel React):
#   * GET /api/contratos/        -> HTTP 200 con la lista (cronometrada)
#   * GET /api/contratos/999999/ -> HTTP 404 ("no existe")
#
# RETO 13 toca ESTA MISMA clase: ahi se conecta el SearchFilter.
# ==============================================================================


# ==============================================================================
# TODO (RETO 11) - Mini 11 · La Avalancha: bulk_create (inyeccion masiva)
# ==============================================================================
#
# ⏸ INSTRUCTORES (Steven/Yesid): el concepto de HOY es "una ida y vuelta
#    por N registros". Un save() por fila de parto son 50.000 idas al
#    motor; bulk_create hace UN viaje por LOTE de mil. Enseñalo con los
#    ms que muestra la misión del panel.
#
# Vista para completar (la ruta ya esta esperando en urls.py):
#
#   class InyeccionMasivaView(APIView):
#       """
#       POST /api/contratos/inyeccion/
#       Recibe {"cantidad": 5000} y responde cuantos se fabricaron
#       y en cuantos milisegundos (tabla y velocidad).
#       """
#       def post(self, request):
#           cantidad = int(request.data.get('cantidad', 1000))
#
#           # TODO (RETO 11):
#           #   1. Fecha actual (time.perf_counter) para medir.
#           #   2. BUILDS de instancias Contrato(...) en Python con datos
#           #      coherentes (id_contrato UNICO y con numero, entidad,
#           #      valor_total con Decimal, estado y fecha_firma).
#           #   3. Contrato.objects.bulk_create(lista, batch_size=1000)
#           #      en una sola pegada a la Boveda.
#           #   4. Response({creados, ms, por_segundo}).
#           raise NotImplementedError('RETO 11: escribe aqui el bulk_create')
# ==============================================================================


# ==============================================================================
# TODO (RETO 12) - Mini 12 · El Analista: aggregate y annotate del ORM
# ==============================================================================
#
# ⏸ INSTRUCTORES (Steven/Yesid): este es el RETO donde el stack brilla.
#    Proyecta primero la query SQL equivalente (larga) y despues las
#    DOS lineas del ORM (corta). El dataset es REAL: 50k contratos
#    del SECOP II, y los milisegundos no mienten.
#
# Vista para completar (ruta: /api/contratos/estadisticas/):
#
#   class EstadisticasView(APIView):
#       """
#       GET /api/contratos/estadisticas/
#       Devuelve las metricas agregadas de TODO el dataset:
#       - Suma, promedio, maximo y conteo de valor_total (aggregate).
#       - Conteo de contratos por estado y por dia (annotate).
#       """
#       def get(self, request):
#           # TODO (RETO 12):
#           #   1. aggregate(): en UNA sola query pide Sum + Avg + Max
#           #      sobre valor_total y Count de los contratos.
#           #   2. annotate(): contratos agrupados por estado con
#           #      values('estado').annotate(suma=Sum('valor_total'))
#           #      y por fecha_firma (para el grafico del panel).
#           #   3. Response({metricas, por_estado, por_dia}).
#           raise NotImplementedError('RETO 12: escribe aqui aggregate/annotate')
# ==============================================================================


# ==============================================================================
# TODO (RETO 13) - Mini 13 · La Aguja en el Pajar: SearchFilter del DRF
# ==============================================================================
#
# ⏸ INSTRUCTORES (Steven/Yesid): busqueda INSTANTANEA sobre 50k registros
#    sin una linea de SQL y sin tocar el frontend. Proyecta el ILIKE
#    que Django arma solito y haz la demo en vivo con el panel.
#
# En el ContratoViewSet del RETO 5, AGREGA las dos variables de la clase:
#
#   from rest_framework.filters import SearchFilter
#
#   class ContratoViewSet(viewsets.ModelViewSet):
#       queryset = ...
#       serializer_class = ...
#       filter_backends = [SearchFilter]
#       search_fields = ['id_contrato', 'entidad_compradora', 'descripcion']
#
# Uso (la misión 3.3 lo comprueba con el panel):
#   GET /api/contratos/?search=<palabra>  -> solo los contratos que matcheen
# ==============================================================================


# ==============================================================================
# TODO (RETO 14) - Mini 14 · El Regulador: paginacion GLOBAL en settings.py
# ==============================================================================
#
# ⏸ INSTRUCTORES (Steven/Yesid): 50.000 filas EN UN JSON aplastan el
#    navegador Y el frontend. La paginacion se configura UNA VEZ y
#    aplica a TODA la API. Descomenta el bloque que espera en settings.py:
#
#   REST_FRAMEWORK = {
#       'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
#       'PAGE_SIZE': 50,
#   }
#
# Con eso GET /api/contratos/ responde {count, next, previous, results}
# en vez de exprimir toda la tabla, y la misión 3.4 queda verde.
# ==============================================================================


# ==============================================================================
# TODO (RETO 15) - Mini 15 · El Limpiador: borrado masivo QuerySet.delete()
# ==============================================================================
#
# ⏸ INSTRUCTORES (Steven/Yesid): cierre del Pentatlon. Un delete() en
#    el QuerySet depura la tabla COMPLETA en una sola sentencia DELETE
#    (muy distinto de 50.000 DELETE uno por uno). Proyecta el tiempo.
#
# Vista para completar (ruta: /api/contratos/limpieza/):
#
#   class LimpiezaMasivaView(APIView):
#       """
#       DELETE /api/contratos/limpieza/
#       Borra TODO el dataset de prueba en UNA sola sentencia y responde
#       cuantos registros quedaron fuera de Postgres (y en cuantos ms).
#       """
#       def delete(self, request):
#           # TODO (RETO 15):
#           #   1. Cronometra con time.perf_counter().
#           #   2. Contrato.objects.all().delete()  (una sola llamada).
#           #   3. Response({eliminados, ms}).
#           raise NotImplementedError('RETO 15: escribe aqui el delete masivo')
# ==============================================================================

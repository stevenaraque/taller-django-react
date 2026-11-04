"""Vistas de la API de contratos."""
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

    # El estudiante NO modifica esta vista: es el juez del taller.
    # El CORS global de toda la API es el RETO 9; este andamio solo
    # autoriza ESTA respuesta hacia el origen 5173.
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


# TODO (RETO 5) - Crear ContratoViewSet y conectarlo al router.


# TODO (RETO 11) - Crear la vista de inyección masiva con bulk_create.


# TODO (RETO 12) - Crear la vista de estadísticas con aggregate y annotate.


# TODO (RETO 13) - Agregar SearchFilter al ContratoViewSet.


# TODO (RETO 14) - Activar la paginación global en settings.py.


# TODO (RETO 15) - Crear la vista de borrado masivo.

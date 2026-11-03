"""
Rutas de la API para la app `contratos`. Montadas en config/urls.py
bajo el prefijo /api/.

Al inicio SOLO esta activa la bateria de diagnostico (no es un reto).
El estudiante enciende el resto de rutas con los RETOS 5 y 11..15.
"""
from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import EstadoJardinView

# El router existe desde ya para que el RETO 5 solo tenga que llenarlo
# (ver el bloque TODO (RETO 5) en views.py).
router = DefaultRouter()

urlpatterns = [
    # Bateria de diagnostico del taller (tablero de las misiones React).
    path('estado/', EstadoJardinView.as_view(), name='estado-taller'),

    # TODO (RETO 5): descomenta y enciende el router del ModelViewSet:
    #    path('', include(router.urls)),
    #    (y en views.py registra: router.register(r'contratos', ContratoViewSet))

    # TODO (RETO 11): ruta de la inyeccion masiva:
    #    path('contratos/inyeccion/', InyeccionMasivaView.as_view()),

    # TODO (RETO 12): ruta de las metricas agregadas:
    #    path('contratos/estadisticas/', EstadisticasView.as_view()),

    # TODO (RETO 15): ruta del borrado masivo:
    #    path('contratos/limpieza/', LimpiezaMasivaView.as_view()),
]

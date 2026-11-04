from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import EstadoJardinView

router = DefaultRouter()

urlpatterns = [
    path('estado/', EstadoJardinView.as_view(), name='estado-taller'),

    # TODO (RETO 5) - Montar las rutas del router.

    # TODO (RETO 11) - Agregar la ruta de inyección masiva.

    # TODO (RETO 12) - Agregar la ruta de estadísticas.

    # TODO (RETO 15) - Agregar la ruta de borrado masivo.
]

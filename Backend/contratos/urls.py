from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    ContratoViewSet,
    EstadisticasView,
    EstadoJardinView,
    InyeccionMasivaView,
    LimpiezaMasivaView,
)

router = DefaultRouter()
router.register('contratos', ContratoViewSet, basename='contrato')

urlpatterns = [
    path('estado/', EstadoJardinView.as_view(), name='estado-taller'),
    path(
        'contratos/inyeccion/',
        InyeccionMasivaView.as_view(),
        name='contratos-inyeccion',
    ),
    path(
        'contratos/estadisticas/',
        EstadisticasView.as_view(),
        name='contratos-estadisticas',
    ),
    path(
        'contratos/limpieza/',
        LimpiezaMasivaView.as_view(),
        name='contratos-limpieza',
    ),
    *router.urls,
]

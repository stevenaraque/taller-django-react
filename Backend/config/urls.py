"""
URL configuration del taller (raíz). Monta el Admin de Django y la
API de contratos que los estudiantes construyen durante los 3 días.

DIA 3 - Mini 13 · La Aguja en el Pajar: el SearchFilter se configura
DENTRO del ContratoViewSet (Backend/contratos/views.py.
"""
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    # Panel administrativo (Mini 3: aqui nace el primer contrato a mano).
    path('admin/', admin.site.urls),

    # API del taller: todas las rutas de la app `contratos`.
    path('api/', include('contratos.urls')),
]

from rest_framework import viewsets
from .models import Tarea
from .serializers import TareaSerializer


class TareaViewSet(viewsets.ModelViewSet):
    """
    CRUD completo de tareas en una sola clase:
    GET /api/tareas/        -> lista
    POST /api/tareas/       -> crea
    GET /api/tareas/{id}/   -> detalle
    PUT/PATCH /api/tareas/{id}/ -> actualiza
    DELETE /api/tareas/{id}/    -> elimina
    """
    queryset = Tarea.objects.all().order_by('-creada')
    serializer_class = TareaSerializer

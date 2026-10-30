from django.contrib import admin
from .models import Tarea


class TareaAdmin(admin.ModelAdmin):
    list_display = ('id', 'titulo', 'completada', 'creada')


admin.site.register(Tarea, TareaAdmin)

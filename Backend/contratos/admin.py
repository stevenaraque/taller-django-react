from django.contrib import admin
from .models import Contrato


@admin.register(Contrato)
class ContratoAdmin(admin.ModelAdmin):
    list_display = (
        'id_contrato',
        'entidad_compradora',
        'estado',
        'valor_total',
        'fecha_firma',
    )
    search_fields = ('id_contrato', 'entidad_compradora', 'descripcion')
    list_filter = ('estado', 'fecha_firma')

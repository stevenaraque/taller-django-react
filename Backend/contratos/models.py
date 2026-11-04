from django.db import models


class Contrato(models.Model):
    id_contrato = models.CharField(max_length=60, unique=True)
    entidad_compradora = models.CharField(max_length=180)
    descripcion = models.TextField(blank=True)
    valor_total = models.DecimalField(max_digits=16, decimal_places=2)
    estado = models.CharField(max_length=20, default='Activo')
    fecha_firma = models.DateField()

    class Meta:
        ordering = ['id_contrato']

    def __str__(self):
        return self.id_contrato

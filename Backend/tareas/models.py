from django.db import models

class Tarea(models.Model):
    titulo = models.CharField(max_length=200)
    completada = models.BooleanField(default=False)
    creada = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.titulo
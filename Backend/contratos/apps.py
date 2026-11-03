from django.apps import AppConfig


class ContratosConfig(AppConfig):
    # Nombre tecnico de la app. 'contratos' es el nombre que usan
    # INSTALLED_APPS en settings.py y las migraciones al crear la tabla.
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'contratos'
    verbose_name = 'Contratos SECOP II'

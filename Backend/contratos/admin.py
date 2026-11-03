"""
Admin de la app `contratos`.

DIA 1 - Mini 3 · "El Jefe Maestro"
Django Admin es un panel de gestion AUTO-GENERADO: eso ya lo aprendo
el estudiante al acercar el modelo. Con register() el modelo aparece
en la interfaz visual sin escribir HTML (la suite gratuita de Django).
"""

# ==============================================================================
# TODO (RETO 3) - Mini 3 · El Jefe Maestro: registrar el modelo en Admin
# ==============================================================================
#
# ⏸ INSTRUCTORES (Steven/Yesid): ejecuta esto DESPUES de superusername
#    (python manage.py createsuperuser). El Admin NO pide codigo del
#    estudiante: solo una linea de register. La clase vale LO MISMO que
#    la suite COMPLETA - es la demo mas determinante delDia 1.
#
# Para que el modelo creado en RETO 2 aparezca en el panel visual:
#
#   1. Importa el modelo:
#          from .models import Contrato
#   2. Registralo para que salga en el panel visual del Admin:
#          admin.site.register(Contrato)
#
# Despues:
#   * crea un superusuario y entra a http://127.0.0.1:8000/admin/
#   * crea UN contrato manualmente desde la interfaz (Jefe Maestro)
#   * refresca la misión 1.3 en el panel React: la batería debe mostrar
#     contratos_registrados = 1 y modelo_en_admin = true.
#
# El registro manual importa: lo usaran para tener un contrato "de
# verdad" en el Admin antes de la avalancha del RETO 11.
# ==============================================================================

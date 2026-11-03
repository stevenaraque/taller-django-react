"""
Serializers de la app `contratos`.

DIA 1 - Mini 4 · "El Escudo"
El serializer es el GUARDIA de la puerta: recoge JSON, lo revisa campo
por campo, y SI ALGO no cumple, suelta un HTTP 400 sin que la basura
toque los modelos ni la base de datos.
"""

# ==============================================================================
# TODO (RETO 4) — Mini 4 · El Escudo: construir el ModelSerializer
# ==============================================================================
#
# ⏸ INSTRUCTORES (Steven/Yesid): este es el punto PERFECTO para introducir
#    el concepto "Django no confía en el exterior". Proyecta un JSON
#    malformado (sin id_contrato, con valor_total = "hola") y explica
#    como el serializer lo filtra ANTES de la base de datos.
#
# Escribe aquí el contrato para el modelo del RETO 2:
#
#   1. Importa lo Mnemónico:
#          from rest_framework import serializers
#          from .models import Contrato
#   2. Declara el ModelSerializer y listo los campos:
#          class ContratoSerializer(serializers.ModelSerializer):
#              class Meta:
#                  model = Contrato
#                  fields = '__all__'
#
# El serializer es el MISMO para:
#    * LEER       -> convierte filas de Postgres en JSON (los GET).
#    * ESCRIBIR   -> convierte JSON de React en filas validadas (los POST).
#    * RECHAZAR   -> si un campo falta o tipo no entra, responde HTTP 400.
#
# Chequeo del escudo (misión 1.4 en el panel React):
#    POST /api/contratos/  con {"valor_total": "hola"}  ->  HTTP 400 bien
#    formado. El badge del Mini 4 se pintara verde cuando sea asi.
# ==============================================================================

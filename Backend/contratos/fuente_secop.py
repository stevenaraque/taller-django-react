"""Ayudas para leer el dataset público de SECOP II (datos.gov.co).

Este módulo viene listo: pide filas a la API y convierte cada fila en un
objeto Contrato. El estudiante usa estas dos funciones en el Mini 11.
"""

import json
import os
from datetime import date
from decimal import Decimal, InvalidOperation
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from .models import Contrato

URL_API = 'https://www.datos.gov.co/resource/jbjy-vk9h.json'
TAMANO_PAGINA = 5000

CAMPOS = ','.join([
    'id_contrato',
    'nombre_entidad',
    'objeto_del_contrato',
    'descripcion_del_proceso',
    'valor_del_contrato',
    'estado_contrato',
    'fecha_de_firma',
])


def consultar_pagina(limite, desplazamiento):
    """Pide hasta `limite` filas al dataset, desde la posición `desplazamiento`."""

    parametros = {
        '$select': CAMPOS,
        '$where': (
            'id_contrato IS NOT NULL AND nombre_entidad IS NOT NULL AND '
            'valor_del_contrato IS NOT NULL AND fecha_de_firma IS NOT NULL'
        ),
        '$order': 'id_contrato',
        '$limit': limite,
        '$offset': desplazamiento,
    }
    direccion = f'{URL_API}?{urlencode(parametros)}'
    encabezados = {
        'Accept': 'application/json',
        'User-Agent': 'taller-django-react/1.0',
    }
    token = os.getenv('SOCRATA_APP_TOKEN')
    if token:
        encabezados['X-App-Token'] = token

    solicitud = Request(direccion, headers=encabezados)
    with urlopen(solicitud, timeout=60) as respuesta:
        filas = json.loads(respuesta.read().decode('utf-8'))

    if not isinstance(filas, list):
        raise ValueError('La API de SECOP II no devolvió una lista de contratos.')

    return filas


def fila_a_contrato(fila):
    """Convierte una fila del dataset en Contrato; None si la fila es inválida."""

    id_contrato = str(fila.get('id_contrato') or '').strip()
    entidad = str(fila.get('nombre_entidad') or '').strip()
    if not id_contrato or len(id_contrato) > 60 or not entidad:
        return None

    try:
        valor_total = Decimal(str(fila['valor_del_contrato'])).quantize(
            Decimal('0.01'),
        )
        fecha_firma = date.fromisoformat(str(fila['fecha_de_firma'])[:10])
    except (InvalidOperation, KeyError, TypeError, ValueError):
        return None

    if not valor_total.is_finite() or abs(valor_total) >= Decimal('100000000000000'):
        return None

    descripcion = (
        fila.get('objeto_del_contrato')
        or fila.get('descripcion_del_proceso')
        or ''
    )

    return Contrato(
        id_contrato=id_contrato,
        entidad_compradora=entidad[:180],
        descripcion=str(descripcion).strip(),
        valor_total=valor_total,
        estado=str(fila.get('estado_contrato') or 'Sin estado').strip()[:20],
        fecha_firma=fecha_firma,
    )

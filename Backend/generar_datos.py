"""Genera contratos SECOP II de prueba. Ejecutar desde Backend/."""
import os
import random
import sys
import time
from datetime import date
from decimal import Decimal
from math import ceil

import django
from django.apps import apps
from django.db import connection
from faker import Faker

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

LOTE = 5000
ESTADOS = ['Activo', 'Terminado', 'Suspendido']
DIA_FIRMA_INICIO = date(2019, 1, 1)
DIA_FIRMA_FIN = date(2026, 12, 31)

ENTIDADES = [
    'Ministerio de Tecnologías y Comunicaciones',
    'Ministerio de Salud y Protección Social',
    'Ministerio de Transporte',
    'Alcaldía Mayor de Bogotá D.C.',
    'Alcaldía de Medellín',
    'Gobernación de Antioquia',
    'Gobernación del Valle del Cauca',
    'Universidad Nacional de Colombia',
    'Universidad Pedagógica y Tecnológica de Colombia',
    'Instituto Colombiano de Bienestar Familiar',
    'Ejército Nacional de Colombia',
    'Fondo Nacional de Vialidad',
    'Instituto de Desarrollo Urbano - IDU',
    'Servicio de Administración Tributaria de Bogotá',
    'Colciencias - Departamento Administrativo',
    'Superintendencia de Servicios Públicos',
    'Empresa de Acueducto y Alcantarillado de Bogotá',
    'TransMilenio S.A.',
    'Aeronáutica Civil de Colombia',
    'Dirección Nacional de Estupefacientes',
]


def fabricar_contrato(faker, numero):
    """Fabrica UN diccionario de contrato con el formato del modelo."""
    return {
        'id_contrato': f'SECOP-II-2026-{numero:07d}',
        'entidad_compradora': faker.random_element(ENTIDADES),
        'descripcion': faker.sentence(nb_words=14).rstrip('.'),
        'valor_total': Decimal(random.randint(1_500_000, 65_000_000_000)),
        'estado': faker.random_element(ESTADOS),
        'fecha_firma': faker.date_between(DIA_FIRMA_INICIO, DIA_FIRMA_FIN),
    }


def generar(cantidad):
    if cantidad < 1:
        sys.exit('La cantidad debe ser mayor que cero.')

    if not tabla_contratos_existe():
        sys.exit(
            'No existe la tabla contratos_contrato. Ejecuta primero:\n'
            'python manage.py makemigrations contratos\n'
            'python manage.py migrate'
        )
    Contrato = apps.get_model('contratos', 'Contrato')

    faker = Faker('es_CO')
    Faker.seed(1057)
    random.seed(1057)

    print(f'Fabricando {cantidad} contratos SECOP II de prueba...')
    inicio = time.perf_counter()
    registros = [
        fabricar_contrato(faker, numero)
        for numero in range(cantidad)
    ]

    fin_creacion = time.perf_counter()
    Contrato.objects.bulk_create(
        [Contrato(**datos) for datos in registros],
        batch_size=LOTE,
    )
    duracion = time.perf_counter() - fin_creacion

    lotes = ceil(cantidad / LOTE)
    print(f'Crear objetos: {(fin_creacion - inicio) * 1000:,.0f} ms')
    print(f'Guardar en PostgreSQL: {duracion * 1000:,.0f} ms')
    print(f'Lotes: {lotes} de hasta {LOTE} registros')
    print(f'Total en la base de datos: {Contrato.objects.count():,}')


def tabla_contratos_existe():
    """Indica si la tabla de contratos existe."""
    return 'contratos_contrato' in connection.introspection.table_names()


if __name__ == '__main__':
    try:
        cantidad_solicitada = int(sys.argv[1]) if len(sys.argv) > 1 else 50_000
    except ValueError:
        sys.exit('Uso: python generar_datos.py [cantidad]  (50.000 por defecto)')
    generar(cantidad_solicitada)

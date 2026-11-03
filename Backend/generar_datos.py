"""
generar_datos.py - Inyector masivo de contratos SECOP II de prueba.

HERRAMIENTA DE INSTRUCTORES (no es un reto del estudiante): prepara la
base de datos con ~50.000 contratos verosímiles para que las arenas del
Día 3 (big data) duren segundos y el salto sea INMEDIATO.

Requisito: el RETO 2 ya migró el modelo Contrato. El script avisa y se
detiene con un mensaje claro si la tabla todavía no existe.

Uso (dentro de Backend/, venv activado):
    python generar_datos.py              # 50.000 registros (por defecto)
    python generar_datos.py 10000        # una tanda de 10.000
"""
import os
import random
import sys
import time
from datetime import date
from decimal import Decimal

# Configura Django ANTES de importar modelos, igual que manage.py.
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
django.setup()

import django.db.utils  # disponible por si se necesita capturar fallo del motor
from django.apps import apps
from django.db import connection

# Faker: librería estándar para fabricar datos verosímiles en masa.
from faker import Faker

LOTE = 5000          # batch_size del bulk_create (5.000 por lote)
ESTADOS = ['Activo', 'Terminado', 'Suspendido']
DIA_FIRMA_INICIO = date(2019, 1, 1)
DIA_FIRMA_FIN = date(2026, 12, 31)

# Entidades reales del ecosistema de compra pública colombiana.
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
        'valor_total': Decimal(str(random.randint(1_500_000, 65_000_000_000))),
        'estado': faker.random_element(ESTADOS),
        'fecha_firma': faker.date_between(DIA_FIRMA_INICIO, DIA_FIRMA_FIN),
    }


def generar(cantidad):
    # Retardo didáctico: la tabla del RETO 2 debe existir antes.
    if not tabla_contratos_existe():
        sys.exit(
            '\nX La tabla `contratos_contrato` no existe todavía.\n'
            '  Primero completa el RETO 2 (Mini 2 · El Arquitecto):\n'
            '      python manage.py makemigrations contratos\n'
            '      python manage.py migrate\n'
        )
    Contrato = apps.get_model('contratos', 'Contrato')

    faker = Faker('es_CO')
    Faker.seed(1057)
    random.seed(1057)

    print(f'\n> Fabricando {cantidad} contratos SECOP II de prueba...')
    inicio = time.perf_counter()
    registros = [fabricar_contrato(faker, contador) for contador in range(cantidad)]

    # bulk_create: UN viaje a Postgres por lote, no uno por fila.
    # Este es el asalto que el ESTUDIANTE programa en la interfaz del
    # RETO 11; aqui los instructores ya lo corren esprintado.
    con_reloj = time.perf_counter()
    Contrato.objects.bulk_create(
        [Contrato(**datos) for datos in registros],
        batch_size=LOTE,
        ignore_conflicts=False,
    )
    duracion = time.perf_counter() - con_reloj

    print(f'> Construir objetos Python : {(con_reloj - inicio) * 1000:,.0f} ms')
    print(f'> bulk_create (Postgres)  : {duracion * 1000:,.0f} ms')
    print(f'> Viajes por lote         : {cantidad // LOTE + 1} lotes de {LOTE}')
    print(f'> Total en base de datos  : {Contrato.objects.count():,}\n')


def tabla_contratos_existe():
    """True si la tabla del RETO 2 ya fue creada por migrate."""
    return 'contratos_contrato' in connection.introspection.table_names()


if __name__ == '__main__':
    try:
        cantidad_solicitada = int(sys.argv[1]) if len(sys.argv) > 1 else 50_000
    except ValueError:
        sys.exit('Uso: python generar_datos.py [cantidad]  (50.000 por defecto)')
    generar(cantidad_solicitada)

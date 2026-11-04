"""Comando para descarga contratos de SECOP II desde datos.gov.co."""

from urllib.error import URLError

from django.core.management.base import BaseCommand, CommandError

from contratos.views import descargar_contratos


class Command(BaseCommand):
    help = (
        'Descarga contratos reales del dataset SECOP II y los guarda '
        'en la base con bulk_create.'
    )

    def add_arguments(self, parser):
        parser.add_argument(
            'cantidad',
            nargs='?',
            type=int,
            default=5000,
            help='Cantidad de contratos a descargar (entre 1 y 50000).',
        )

    def handle(self, *args, **options):
        try:
            informe = descargar_contratos(options['cantidad'])
        except (URLError, TimeoutError, ValueError) as error:
            raise CommandError(f'No se pudo descargar de datos.gov.co: {error}')

        self.stdout.write(f'Filas recibidas desde SECOP II: {informe["recibidos"]:,}')
        self.stdout.write(f'Contratos nuevos guardados: {informe["creados"]:,}')
        self.stdout.write(f'Filas omitidas o duplicadas: {informe["omitidos"]:,}')
        self.stdout.write(f'Total de contratos en PostgreSQL: {informe["total"]:,}')
        self.stdout.write(f'Tiempo: {informe["ms"] / 1000:.1f} segundos')

from datetime import date
from decimal import Decimal
from unittest.mock import patch
from urllib.error import URLError

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .fuente_secop import fila_a_contrato
from .models import Contrato
from .views import descargar_contratos


class ContratoApiTests(APITestCase):
    def crear_contrato(
        self,
        id_contrato='SECOP-1',
        entidad='Ministerio de Prueba',
        valor=Decimal('100.00'),
        estado='Activo',
        fecha=date(2026, 1, 15),
    ):
        return Contrato.objects.create(
            id_contrato=id_contrato,
            entidad_compradora=entidad,
            descripcion='Contrato de prueba',
            valor_total=valor,
            estado=estado,
            fecha_firma=fecha,
        )

    def test_modelo_devuelve_el_identificador(self):
        contrato = self.crear_contrato()
        self.assertEqual(str(contrato), 'SECOP-1')

    def test_api_permite_crear_y_consultar_contratos(self):
        datos = {
            'id_contrato': 'SECOP-2',
            'entidad_compradora': 'Alcaldía de Prueba',
            'descripcion': 'Compra de materiales',
            'valor_total': '2500.50',
            'estado': 'Activo',
            'fecha_firma': '2026-02-10',
        }

        respuesta = self.client.post(reverse('contrato-list'), datos, format='json')

        self.assertEqual(respuesta.status_code, status.HTTP_201_CREATED)
        self.assertEqual(respuesta.data['id_contrato'], 'SECOP-2')
        self.assertEqual(Contrato.objects.count(), 1)

        detalle = self.client.get(
            reverse('contrato-detail', kwargs={'pk': respuesta.data['id']}),
        )
        self.assertEqual(detalle.status_code, status.HTTP_200_OK)
        self.assertEqual(detalle.data['entidad_compradora'], 'Alcaldía de Prueba')

    def test_api_actualiza_y_borra_un_contrato(self):
        contrato = self.crear_contrato()
        url = reverse('contrato-detail', kwargs={'pk': contrato.pk})

        actualizacion = self.client.patch(
            url,
            {'estado': 'Terminado'},
            format='json',
        )
        self.assertEqual(actualizacion.status_code, status.HTTP_200_OK)
        self.assertEqual(actualizacion.data['estado'], 'Terminado')

        borrado = self.client.delete(url)
        self.assertEqual(borrado.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Contrato.objects.count(), 0)

    def test_serializer_rechaza_un_valor_no_numerico(self):
        datos = {
            'id_contrato': 'SECOP-INVALIDO',
            'entidad_compradora': 'Alcaldía de Prueba',
            'valor_total': 'mucho',
            'estado': 'Activo',
            'fecha_firma': '2026-02-10',
        }

        respuesta = self.client.post(reverse('contrato-list'), datos, format='json')

        self.assertEqual(respuesta.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('valor_total', respuesta.data)
        self.assertEqual(Contrato.objects.count(), 0)

    def test_busqueda_filtra_por_entidad(self):
        self.crear_contrato(entidad='Ministerio de Salud')
        self.crear_contrato(
            id_contrato='SECOP-2',
            entidad='Alcaldía de Medellín',
        )

        respuesta = self.client.get(reverse('contrato-list'), {'search': 'Medellín'})

        self.assertEqual(respuesta.status_code, status.HTTP_200_OK)
        self.assertEqual(respuesta.data['count'], 1)
        self.assertEqual(respuesta.data['results'][0]['id_contrato'], 'SECOP-2')

    def test_listado_usa_paginas_de_cincuenta(self):
        Contrato.objects.bulk_create([
            Contrato(
                id_contrato=f'SECOP-{numero:03}',
                entidad_compradora='Ministerio de Prueba',
                descripcion='Contrato de prueba',
                valor_total=Decimal('100.00'),
                estado='Activo',
                fecha_firma=date(2026, 1, 15),
            )
            for numero in range(51)
        ])

        respuesta = self.client.get(reverse('contrato-list'))

        self.assertEqual(respuesta.status_code, status.HTTP_200_OK)
        self.assertEqual(respuesta.data['count'], 51)
        self.assertEqual(len(respuesta.data['results']), 50)
        self.assertIsNotNone(respuesta.data['next'])

    @patch('contratos.views.descargar_contratos')
    def test_inyeccion_masiva_descarga_y_rechaza_cantidades_invalidas(
        self,
        importar,
    ):
        url = reverse('contratos-inyeccion')
        respuesta_mala = self.client.post(url, {'cantidad': 0}, format='json')
        respuesta_no_valida = self.client.post(url, ['sin cantidad'], format='json')
        self.assertEqual(respuesta_mala.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(respuesta_no_valida.status_code, status.HTTP_400_BAD_REQUEST)

        importar.return_value = {
            'creados': 3,
            'recibidos': 3,
            'omitidos': 0,
            'total': 3,
            'ms': 20,
            'por_segundo': 150,
        }
        respuesta = self.client.post(url, {'cantidad': 3}, format='json')

        self.assertEqual(respuesta.status_code, status.HTTP_201_CREATED)
        self.assertEqual(respuesta.data['creados'], 3)
        self.assertEqual(respuesta.data['recibidos'], 3)
        importar.assert_called_once_with(3)

    @patch('contratos.views.descargar_contratos', side_effect=URLError('sin conexión'))
    def test_inyeccion_masiva_informa_si_datos_gov_no_responde(self, importar):
        respuesta = self.client.post(
            reverse('contratos-inyeccion'),
            {'cantidad': 3},
            format='json',
        )

        self.assertEqual(respuesta.status_code, status.HTTP_502_BAD_GATEWAY)
        self.assertIn('SECOP II', respuesta.data['detalle'])

    def test_fila_a_contrato_mapea_campos_del_dataset_secop(self):
        contrato = fila_a_contrato({
            'id_contrato': 'CO1.PCCNTR.123456',
            'nombre_entidad': 'Agencia de Prueba',
            'objeto_del_contrato': 'Mantenimiento de vías',
            'valor_del_contrato': '23200000',
            'estado_contrato': 'En ejecucion',
            'fecha_de_firma': '2026-09-01T17:21:57.350',
        })

        self.assertEqual(contrato.id_contrato, 'CO1.PCCNTR.123456')
        self.assertEqual(contrato.entidad_compradora, 'Agencia de Prueba')
        self.assertEqual(contrato.descripcion, 'Mantenimiento de vías')
        self.assertEqual(contrato.valor_total, Decimal('23200000.00'))
        self.assertEqual(contrato.estado, 'En ejecucion')
        self.assertEqual(contrato.fecha_firma, date(2026, 9, 1))

    @patch('contratos.views.consultar_pagina')
    def test_importador_guarda_registros_de_la_fuente(self, consultar):
        consultar.return_value = [
            {
                'id_contrato': 'CO1.PCCNTR.1',
                'nombre_entidad': 'Entidad Uno',
                'objeto_del_contrato': 'Objeto Uno',
                'valor_del_contrato': '1000',
                'estado_contrato': 'Cerrado',
                'fecha_de_firma': '2026-01-02T00:00:00.000',
            },
            {
                'id_contrato': 'CO1.PCCNTR.2',
                'nombre_entidad': 'Entidad Dos',
                'objeto_del_contrato': 'Objeto Dos',
                'valor_del_contrato': '2000',
                'estado_contrato': 'En ejecucion',
                'fecha_de_firma': '2026-01-03T00:00:00.000',
            },
        ]

        informe = descargar_contratos(2)

        self.assertEqual(informe['creados'], 2)
        self.assertEqual(informe['recibidos'], 2)
        self.assertEqual(Contrato.objects.count(), 2)
        consultar.assert_called_once_with(2, 0)

    @patch('contratos.views.consultar_pagina')
    def test_importador_omite_ids_existentes_y_sigue_a_la_pagina_siguiente(
        self,
        consultar,
    ):
        self.crear_contrato(id_contrato='CO1.PCCNTR.1')
        consultar.side_effect = [
            [{
                'id_contrato': 'CO1.PCCNTR.1',
                'nombre_entidad': 'Entidad Uno',
                'valor_del_contrato': '1000',
                'estado_contrato': 'Cerrado',
                'fecha_de_firma': '2026-01-02T00:00:00.000',
            }],
            [{
                'id_contrato': 'CO1.PCCNTR.2',
                'nombre_entidad': 'Entidad Dos',
                'valor_del_contrato': '2000',
                'estado_contrato': 'En ejecucion',
                'fecha_de_firma': '2026-01-03T00:00:00.000',
            }],
        ]

        informe = descargar_contratos(1)

        self.assertEqual(informe['creados'], 1)
        self.assertEqual(informe['omitidos'], 1)
        self.assertEqual(Contrato.objects.count(), 2)
        self.assertEqual(consultar.call_count, 2)

    def test_serializer_rechaza_valor_total_negativo(self):
        datos = {
            'id_contrato': 'SECOP-NEGATIVO',
            'entidad_compradora': 'Alcaldía de Prueba',
            'descripcion': 'Contrato con valor prohibido',
            'valor_total': Decimal('-1.00'),
            'estado': 'Activo',
            'fecha_firma': '2026-01-15',
        }

        respuesta = self.client.post(reverse('contrato-list'), datos, format='json')

        self.assertEqual(respuesta.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('valor_total', respuesta.data)

    def test_busqueda_filtro_estado_y_orden_trabajan_juntos(self):
        self.crear_contrato(valor=Decimal('100.00'))
        self.crear_contrato(
            id_contrato='SECOP-2',
            valor=Decimal('900.00'),
            estado='Terminado',
        )
        self.crear_contrato(
            id_contrato='SECOP-3',
            valor=Decimal('500.00'),
            estado='Terminado',
        )

        busqueda = self.client.get(reverse('contrato-list'), {'search': 'Prueba'})
        self.assertEqual(busqueda.status_code, status.HTTP_200_OK)
        self.assertEqual(busqueda.data['count'], 3)

        filtro = self.client.get(
            reverse('contrato-list'),
            {'estado': 'terminado'},
        )
        self.assertEqual(filtro.data['count'], 2)
        self.assertTrue(
            all(
                contrato['estado'] == 'Terminado'
                for contrato in filtro.data['results']
            ),
        )

        orden = self.client.get(
            reverse('contrato-list'),
            {'ordering': '-valor_total'},
        )
        valores = [contrato['valor_total'] for contrato in orden.data['results']]
        self.assertEqual(valores, sorted(valores, reverse=True))

    def test_estadisticas_suman_y_agrupan_contratos(self):
        self.crear_contrato(valor=Decimal('100.00'), estado='Activo')
        self.crear_contrato(
            id_contrato='SECOP-2',
            valor=Decimal('300.00'),
            estado='Activo',
        )
        self.crear_contrato(
            id_contrato='SECOP-3',
            valor=Decimal('500.00'),
            estado='Terminado',
            fecha=date(2026, 2, 1),
        )

        respuesta = self.client.get(reverse('contratos-estadisticas'))

        self.assertEqual(respuesta.status_code, status.HTTP_200_OK)
        self.assertEqual(respuesta.data['metricas']['total_contratos'], 3)
        self.assertEqual(respuesta.data['metricas']['suma_valor_total'], Decimal('900'))
        self.assertEqual(respuesta.data['metricas']['promedio_valor_total'], Decimal('300'))
        self.assertEqual(respuesta.data['metricas']['maximo_valor_total'], Decimal('500'))
        self.assertEqual(respuesta.data['por_estado']['Activo']['contratos'], 2)
        self.assertEqual(respuesta.data['por_estado']['Terminado']['contratos'], 1)
        self.assertEqual(len(respuesta.data['por_dia']), 2)

    def test_limpieza_borra_solo_con_confirmacion(self):
        self.crear_contrato()
        self.crear_contrato(id_contrato='SECOP-2')

        falta_confirmacion = self.client.delete(reverse('contratos-limpieza'))

        self.assertEqual(falta_confirmacion.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Contrato.objects.count(), 2)

        borrado = self.client.delete(
            reverse('contratos-limpieza'),
            {'confirmar': True},
            format='json',
        )

        self.assertEqual(borrado.status_code, status.HTTP_200_OK)
        self.assertEqual(borrado.data['eliminados'], 2)
        self.assertEqual(Contrato.objects.count(), 0)

    def test_bateria_de_estado_muestra_el_modelo_migrado_y_registrado(self):
        self.crear_contrato()

        respuesta = self.client.get(reverse('estado-taller'))

        self.assertTrue(respuesta.data['base_datos'])
        self.assertTrue(respuesta.data['motor_bueno'])
        self.assertTrue(respuesta.data['tabla_contratos'])
        self.assertTrue(respuesta.data['modelo_en_admin'])
        self.assertEqual(respuesta.data['contratos_registrados'], 1)

    def test_cors_permite_el_origen_local_de_react(self):
        respuesta = self.client.options(
            reverse('contrato-list'),
            HTTP_ORIGIN='http://localhost:5173',
            HTTP_ACCESS_CONTROL_REQUEST_METHOD='GET',
        )

        self.assertEqual(
            respuesta['Access-Control-Allow-Origin'],
            'http://localhost:5173',
        )

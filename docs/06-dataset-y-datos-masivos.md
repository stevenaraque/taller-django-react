# Datos de SECOP II

El proyecto descarga contratos reales de la plataforma de datos abiertos de
Colombia. El dataset contiene millones de filas; el importador consulta solo la
cantidad que necesitas y no guarda columnas personales que el taller no usa.

## Fuente y atribución

- Dataset: [SECOP II - Contratos Electrónicos](https://www.datos.gov.co/d/jbjy-vk9h)
- API: <https://www.datos.gov.co/resource/jbjy-vk9h.json>
- Identificador: `jbjy-vk9h`
- Fuente: Agencia Nacional de Contratación Pública - Colombia Compra Eficiente.
- Licencia de los datos: [Creative Commons Attribution-ShareAlike 4.0](https://creativecommons.org/licenses/by-sa/4.0/).

Al compartir copias de estos datos, conserva esta atribución y la licencia.

## Campos que guarda el taller

| Campo del modelo | Campo de SECOP II | Uso |
|---|---|---|
| `id_contrato` | `id_contrato` | Identificador único del contrato |
| `entidad_compradora` | `nombre_entidad` | Entidad que compra |
| `descripcion` | `objeto_del_contrato` o `descripcion_del_proceso` | Objeto del contrato |
| `valor_total` | `valor_del_contrato` | Valor registrado |
| `estado` | `estado_contrato` | Estado del contrato |
| `fecha_firma` | `fecha_de_firma` | Fecha de firma |

## Descargar contratos

Desde `Backend/`, con el entorno virtual activo y la base preparada, ejecuta:

```powershell
python manage.py migrate
python manage.py descargar_secop
```

Por defecto, el comando descarga 5000 contratos. Para pedir otra cantidad, usa:

```powershell
python manage.py descargar_secop 10000
```

El límite por consulta es de 5000 filas. Para cantidades mayores, el importador
avanza por páginas. Omite los identificadores que ya existen, para que puedas
ejecutarlo más de una vez sin duplicar contratos.

El Mini 11 usa estas mismas funciones de `fuente_secop.py` desde el panel. Si
el importador recibe filas que ya están en tu base, las omite y continúa con la
siguiente página: por eso puedes ejecutarlo más de una vez sin duplicar
contratos.

## Token opcional

La API permite consultas públicas limitadas sin token. Si datos.gov.co aplica un
límite, solicita un App Token y guárdalo en `Backend/.env` como
`SOCRATA_APP_TOKEN`. No lo escribas en el código ni lo subas al repositorio.

## Tamaño del dataset

El portal publica millones de contratos. El taller no descarga el dataset
completo: usa páginas de hasta 5000 filas para que la base local y el navegador
puedan trabajar con una cantidad manejable.

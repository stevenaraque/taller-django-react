# 06 · Dataset y datos masivos

Todo el taller se juega sobre un dataset grande y verosímil: ~50.000 contratos
estilo **SECOP II** (la compra pública electrónica de Colombia). Esta guía
explica el dataset, la herramienta `generar_datos.py` y cómo estar seguro de
que la avalancha está lista antes del Día 3.

## Qué es SECOP II

SECOP II es la plataforma de contratos electrónicos del Estado colombiano:
cada entidad pública (ministerios, alcaldías, gobernaciones, universidades)
publica sus contratos con número único, descripción del objeto, valor total,
estado del contrato y fecha de firma. El modelo del RETO 2
(`Contrato` en el Mini 2) es una versión simplificada pero realista de una
fila de ese dataset:

| Campo | Tipo | Papel en el taller |
|---|---|---|
| `id_contrato` | `CharField(max_length=60, unique=True)` | Identificador del contrato; nunca se repite (es la `key` del Mini 10) |
| `entidad_compradora` | `CharField(max_length=180)` | Quien compra (Ministerio, Alcaldía...) — campo del SearchFilter (RETO 13) |
| `descripcion` | `TextField(blank=True)` | Texto libre del objeto a contratar — también del SearchFilter |
| `valor_total` | `DecimalField(max_digits=16, decimal_places=2)` | Campo clave de las métricas Sum/Avg/Max (RETO 12) |
| `estado` | `CharField(max_length=20, default='Activo')` | Valores reales: `Activo`, `Terminado`, `Suspendido` — clave del annotate (RETO 12) |
| `fecha_firma` | `DateField()` | Clave para agrupar métricas por día (RETO 12) |

## La herramienta: `generar_datos.py`

**Es una herramienta de instructores, no un reto del estudiante.** El script
prepara la base con ~50.000 contratos verosímiles para que las arenas del
Día 3 duren segundos y el salto de rendimiento sea inmediato y medible.

```bash
cd Backend
# venv activado y el RETO 2 ya migrado (la tabla debe existir)
python generar_datos.py          # 50.000 registros (por defecto)
python generar_datos.py 10000    # una tanda de 10.000
```

### Cómo funciona por dentro

1. Configura Django **antes de importar** los modelos (`django.setup()`),
   igual que lo hace `manage.py` — por eso puede usarse como script suelto.
2. Detecta si la tabla `contratos_contrato` existe; si no, se detiene con un
   mensaje claro (avisa que falta el RETO 2).
3. Usa **Faker** para fabricar datos coherentes: entidades reales de la compra
   pública colombiana (Ministerios, Alcaldías de Bogotá y Medellín,
   Gobernaciones, Universidad Nacional...), estados del dataset
   (`Activo`, `Terminado`, `Suspendido`) y fechas de firma repartidas entre
   2019 y 2026.
4. Fabrica el `id_contrato` con estructura de número de contrato único.
5. Inyecta en **lotes** (`LOTE = 5000` por lote, `bulk_create`): el script ya
   practica por adelantado la lección del Mini 11.
6. Mide y reporta el tiempo total de la inyección (mismo espíritu de cronometrar
   las arenas).

## Orden recomendado

1. Terminar el **RETO 2** (modelo + migración): el script verifica la tabla.
2. Opcionalmente los RETOS 3-5 (Admin + CRUD) para inspeccionar contratos a mano.
3. Correr `python generar_datos.py` (50.000) justo antes del Día 3.
4. Aceptar los milisegundos del propio script como primera métrica del día:
   la avalancha del RETO 11 busca batir o igualar esa marca con la vista
   del estudiante.

## Si el dataset se rompe

- El script genera **siempre las mismas claves**: `id_contrato` deterministas
  (`SECOP-II-2026-0000000`...), con semillas fijas de Faker y `random`, y no
  ignora conflictos (`ignore_conflicts=False`). Por eso una segunda corrida
  sobre la tabla con datos **falla** con el `unique` del modelo. Para repetir
  la avalancha desde cero, vacíe primero la tabla — con el RETO 15 listo, el
  `DELETE /api/contratos/limpieza/` del Limpiador hace el trabajo.
- ¿Tabla con datos de prueba incoherentes? El Mini 15 (`DELETE /api/contratos/limpieza/`) es el limpiador oficial del taller: es el asalto de cierre.
- Si el motor no responde, revise primero el `.env` (Mini 1) y el servicio
  de PostgreSQL antes de tocar el script.

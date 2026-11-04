# Datos de prueba

El modelo usa campos inspirados en los contratos de SECOP II. El generador
crea **datos sintéticos con Faker**; no descarga contratos reales. Sirven para
practicar búsquedas, estadísticas y carga masiva.

## Campos del modelo

| Campo | Tipo de Django | Qué guarda |
|---|---|---|
| `id_contrato` | `CharField(max_length=60, unique=True)` | Identificador único |
| `entidad_compradora` | `CharField(max_length=180)` | Entidad que compra |
| `descripcion` | `TextField(blank=True)` | Objeto del contrato |
| `valor_total` | `DecimalField(max_digits=16, decimal_places=2)` | Valor en dinero |
| `estado` | `CharField(max_length=20, default='Activo')` | Activo, Terminado o Suspendido |
| `fecha_firma` | `DateField()` | Día en que se firmó |

Estos campos se usan para construir el modelo del [Mini 2](03-dia1-el-velocista.md),
buscar contratos y calcular estadísticas.

## Antes de generar datos

1. Completa el Mini 2.
2. Crea y aplica la migración:

   ```powershell
   python manage.py makemigrations contratos
   python manage.py migrate
   ```

3. Entra en `Backend/` con el entorno virtual activo y ejecuta:

   ```powershell
   python generar_datos.py
   ```

El comando genera 50.000 contratos. Para generar menos, indica la cantidad:

```powershell
python generar_datos.py 10000
```

## Qué hace el generador

- Comprueba que exista la tabla `contratos_contrato`.
- Crea valores de prueba en español.
- Inserta los contratos en lotes con `bulk_create()`.
- Muestra el tiempo de creación y el total de registros.

## Si necesitas repetir la carga

El generador usa los mismos identificadores cada vez. Si lo ejecutas de nuevo
sin borrar los registros anteriores, PostgreSQL rechazará los identificadores
duplicados.

Cuando el Mini 15 esté implementado, úsalo para borrar los datos de prueba
antes de volver a ejecutar el generador. **No uses el Mini 15 si la tabla
contiene datos que quieras conservar.**

**Documentación:** [Faker](https://faker.readthedocs.io/en/master/) y
[`bulk_create()` de Django](https://docs.djangoproject.com/en/6.1/ref/models/querysets/#bulk-create).

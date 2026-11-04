# Taller Django + React

Taller de tres días para aprender a crear una API con Django y una interfaz
con React. El modelo usa campos de contratos SECOP II; el generador crea datos
sintéticos para practicar.

La plantilla no es una aplicación terminada. En cada reto, el estudiante
escribe o completa una parte del código y usa el panel para comprobarla. El
panel evalúa automáticamente cada reto.

## Requisitos

- Python 3.14 o superior
- Node.js 20.19+ o 22.12+
- PostgreSQL 18

## Primera vez

Sigue la [guía de inicio](docs/01-inicio-rapido.md). Explica cómo crear la base,
configurar el archivo `.env` y arrancar Django y React.

## Arrancar después de la instalación

Abre dos terminales.

En la primera, desde la carpeta del proyecto:

```powershell
cd Backend
.\venv\Scripts\Activate.ps1
python manage.py runserver
```

En la segunda:

```powershell
cd Frontend
npm run dev
```

Abre el panel en <http://localhost:5173>. Django escucha en
<http://localhost:8000>.

## Los tres días

1. **El Velocista:** PostgreSQL y las primeras partes de la API.
2. **El Portero:** React, peticiones al backend y CORS.
3. **Pentatlón Big Data:** carga y análisis de datos, una gráfica, búsqueda,
   paginación y borrado de datos de prueba.

## Guías

Empieza por [el índice de documentación](docs/README.md). Ahí están las guías
de instalación, arquitectura, retos y solución de problemas.

## Créditos

Creado por Steven y Yesid. Licencia MIT; consulta `LICENSE`.

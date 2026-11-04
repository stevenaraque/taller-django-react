# Panel React

El panel muestra las tres arenas del taller, las 15 misiones y el avance que
queda guardado en este navegador.

## Primera vez

Desde esta carpeta, instala las dependencias:

```bash
npm install
```

## Iniciar

```bash
npm run dev
```

Abre <http://localhost:5173>. El backend de Django debe estar activo en el
puerto 8000.

## Dónde está cada cosa

- `src/app/`: conecta las partes principales del panel.
- `src/features/arenas/`: navegación entre los tres días.
- `src/features/misiones/`: misiones, marco común y gráfica vacía del Mini 12.
- `src/features/progreso/`: guarda las misiones aprobadas en `localStorage`.
- `src/shared/`: peticiones a Django, cronómetro y estilos.

La gráfica del Mini 12 usa Recharts. El estudiante conecta los datos de la API
al espacio vacío que ya muestra la gráfica.

Las guías del taller están en [`../docs/README.md`](../docs/README.md).

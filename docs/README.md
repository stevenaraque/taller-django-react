# Documentación del Taller Django + React

Guías para desarrollar el proyecto: explicar conceptos paso a paso y orientar el
avance por misión sin revelar la solución completa. El código resuelve lo demás:
cada reto trae sus instrucciones exactas en los bloques `TODO (RETO n)` de los
archivos fuente y su marco teórico para el instructor en los bloques
`⏸ INSTRUCTORES (Steven/Yesid)`.

## Orden de lectura

1. **[Inicio rápido](01-inicio-rapido.md)** — requisitos, instalación de
   PostgreSQL, backend y frontend. Lee esto antes de escribir cualquier línea.
2. **[Arquitectura](02-arquitectura.md)** — cómo encaja todo: los dos puertos,
   la única puerta HTTP del frontend, la batería de diagnóstico y el tablero
   de misiones.
3. **Día a día, en orden:**
   - [Día 1 · El Velocista](03-dia1-el-velocista.md) — misiones 1 a 5 (backend).
   - [Día 2 · El Portero](04-dia2-el-portero.md) — misiones 6 a 10 (React y CORS).
   - [Día 3 · Pentatlón Big Data](05-dia3-pentatlon-big-data.md) — misiones 11 a 15.
4. **[Dataset y datos masivos](06-dataset-y-datos-masivos.md)** — cómo funciona
   `generar_datos.py` y el dataset SECOP II.
5. **[Solución de problemas](07-solucion-de-problemas.md)** — cuando algo no
   arranca o una misión no se aprueba.

## Mapa rápido

| Si necesitas... | Ve a |
|---|---|
| Instalar y arrancar el proyecto por primera vez | [Inicio rápido](01-inicio-rapido.md) |
| Entender por qué el fetch falla o qué es `/api/estado/` | [Arquitectura](02-arquitectura.md) |
| Saber qué se pide en una misión concreta y cómo se aprueba | Guía de su día |
| Preparar 50.000 contratos para el Día 3 | [Dataset y datos masivos](06-dataset-y-datos-masivos.md) |
| Depurar un error (CORS, migración, HTTP 400...) | [Solución de problemas](07-solucion-de-problemas.md) |

## Reglas de oro del taller

- **Cero respuestas mágicas.** Estas guías teorizan, orientan y pistan; la
  solución la escribe el estudiante en los `TODO (RETO n)`.
- **PostgreSQL es obligatorio.** SQLite no pasa la batería de diagnóstico.
- **Las credenciales viven en `Backend/.env`**, nunca en `settings.py` ni en el
  repositorio.
- **La vista `EstadoJardinView` no se toca:** es el juez automático del taller.
- Cuando una misión no tiene verificación automática (Mini 6, 7 y 10 son retos
  de escritura), la aprueba el instructor a mano desde el panel.

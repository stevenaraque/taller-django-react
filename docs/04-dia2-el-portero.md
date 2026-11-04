# 04 · Día 2 — El Portero (misiones 6 a 10)

El segundo día cambia de orilla: se pasa del backend al navegador. La habilidad
del día es React (componentes, estado, render) y el diagnóstico del bloqueo
CORS: el navegador exige autorización cuando los orígenes no coinciden, y el
RETO 9 abre esa puerta con llave.

Nota importante: los Mini 6, 7 y 10 son **retos de escritura**: no hay
verificación automática. El instructor da el visto bueno en clase y marca la
misión aprobada desde su propio marco en el panel con el botón
«Lo apliqué en clase — declarar la misión aprobada» (el Modo instructor
desbloquea el camino para llegar hasta ahí al ensayar).

---

## Mini 6 · El Camaleón (RETO 6)

**Dónde:** un componente nuevo en `Frontend/src/` (reto de escritura).

**Teoría:** JSX no es HTML: es una función que devuelve el árbol de JavaScript.
Anatomía de un componente: función flecha + `return` de JSX + `export default`.

**Lo que se construye:** el primer componente `Camaleon` con un
`<h1 className="titulo-gigante">` que muestre su nombre. Aprobar solo cuando
el instructor lo proyecte en pantalla.

**Pistas:**

- En JSX el atributo `class` pasa a ser `className` (palabra reservada en JS).
- Dibuje en el tablero el árbol `App → Arenas → Mini6`: entender dónde vive el
  componente vale tanto como escribirlo.

---

## Mini 7 · El Albañil (RETO 7)

**Dónde:** otro componente propio en `Frontend/src/` (reto de escritura).

**Teoría:** el estado del componente con `useState`. El ciclo completo:
clic → `setState` → re-render. La clave del día es `const [cuenta, setCuenta] =
useState(0)`. El botón llama `setCuenta` y React re-renderiza por ti.

**Lo que se construye:** un contador con `useState` (botón que incrementa).
El panel incluye una **demo viva** (con `useState` ya funcionando) para
comparar el ciclo antes de escribir el propio.

**Pistas:**

- Si cambia el valor pero no la pantalla, el cambio no pasó por `setState`:
  React solo re-renderiza con estado nuevo.

---

## Mini 8 · El Impulso (RETO 8)

**Dónde:** demo guiada del panel con fetch supervisado por escrito: el panel
lanza el fetch y aprueba **sola** al detectar el bloqueo; a la par, el
estudiante escribe su propio primer fetch con la pizarra.

**Teoría:** la política de mismo origen. Tres piezas clave:

1. React vive en `http://localhost:5173`, Django en `http://127.0.0.1:8000`:
   son **orígenes distintos** (puerto incluido).
2. El navegador **sí envía** la petición, pero **bloquea ver la respuesta** si
   el servidor no la autoriza con cabeceras CORS.
3. `fetch` solo lanza excepción cuando la petición nunca cruzó el puerto o el
   navegador no deja verla: eso es lo que `api.js` clasifica como `FallaApi`
   tipo `'cors'`.

**El plan torcido a propósito (aquí está la gracia):** en este punto el fetch
`GET /api/contratos/` **debe fallar con razón** — el Portero (RETO 9) todavía
no abrió la puerta de toda la API. Ver el rojo en F12 y **leer el error
completo** con la clase ES la victoria: saber nombrar el problema es la
habilidad del día.

**Cómo se aprueba:** la demo del panel lanza el fetch; con el bloqueo detectado
(tipo `'cors'`) la misión queda aprobada: se celebró el fallo elegante.

**Pistas:**

- Abra F12 → Console y Network: la petición aparece pero la respuesta queda
  oculta por CORS.
- Ese error completo es exactamente lo que se elimina en el Mini 9.

---

## Mini 9 · El Portero (RETO 9)

**Archivo:** `Backend/config/settings.py`

**Teoría:** el preflight. Antes del GET "de verdad", el navegador pregunta con
**OPTIONS** (la conversación previa): ¿a quién le paso, con qué verbos y con
qué cabeceras? `corsheaders` es el middleware que contesta. El andamio CORS
de `EstadoJardinView` ya abría solo la ruta `estado/`; este reto abre la puerta
de **toda la API** y el middleware toma el mando (sobrescribe la cabecera
del andamio; nunca se duplica).

**Pasos** (las tres líneas exactas están comentadas en `settings.py`):

1. Agregar `'corsheaders'` a `INSTALLED_APPS`.
2. Agregar `'corsheaders.middleware.CorsMiddleware'` **antes** de
   `CommonMiddleware` en `MIDDLEWARE`.
3. Agregar `CORS_ALLOWED_ORIGINS` con los orígenes del 5173
   (`http://localhost:5173` y `http://127.0.0.1:5173`).
4. **Reiniciar el runserver** (los cambios de settings no aplican solos).

**Cómo se aprueba:** el panel corre el diagnóstico completo: OPTIONS (el
preflight) y GET (el permiso ya pagado). Aprueba cuando el GET responde 200
de verdad cruzando del 5173 al 8000, y la consola de F12 queda limpia.

**Pistas:**

- La app ya viene instalada en `requirements.txt` (`django-cors-headers`):
  solo falta conectarla.
- El orden del middleware importa: `CorsMiddleware` va antes de
  `CommonMiddleware`.

---

## Mini 10 · El Render (RETO 10)

**Dónde:** otro componente propio en `Frontend/src/` (reto de escritura).

**Teoría:** la conexión completa del stack: `fetch` → estado → render.
Pipeline completo: `useState` guarda el listado, `useEffect` lanza el fetch al
montar, y `map()` pinta la lista.

**Lo que se construye:** un componente que:

1. Trae el listado de `/api/contratos/` (a lo grande, con `pedirOExplotar`
   del `api.js` para tener los ms).
2. Guarda el resultado con `setContratos`.
3. Lo pinta con `contratos.map((contrato) => <li key={contrato.id_contrato}>...)`.

El panel entrega el **JSON crudo en vivo** para comparar contra lo que su
componente renderiza. Detrás está corriendo el flujo real del panel (se
re-revisa que siga vivo con CORS abierto).

**Pistas:**

- La `key` del `map` debe ser estable: `id_contrato` es única por diseño
  (RETO 2).
- Si el listado está paginado (Día 3), cuide qué llave usar para el `map`
  cuando la respuesta venga como `{count, next, previous, results}`.

---

## Puertas de cierre del día

- El fetch del 5173 al 8000 responde 200 sin errores en F12 (RETO 9).
- El estudiante ya escribió un componente completo que consume la API
  (RETO 10) y domina el ciclo estado → render.
- Con el visto del instructor en el Mini 10 se desbloquea el
  [Día 3 · Pentatlón Big Data](05-dia3-pentatlon-big-data.md).

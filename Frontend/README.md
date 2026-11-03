# Frontend — Panel de Arenas

Este frontend (React 19 + Vite) es el panel del taller. Es la **verificación visual**
del progreso: cada misión, desde el Mini 1 hasta el Mini 15, está representada por un
componente físico dentro de un acordeón por día.

## Qué hace

- Muestra las **3 arenas** (Día 1 · El Velocista, Día 2 · El Portero, Día 3 · Pentatlón
  Big Data) como acordeón de pasos.
- Cada misión se aprueba solo cuando el backend responde lo esperado (HTTP 200 válido,
  o el fallo elegante con la pista correcta para retos como el impulso).
- Los **días futuros se bloquean** hasta completar los anteriores.
- El botón **Modo instructor** desbloquea todas las misiones para ensayar.

## Archivo clave

- `src/api.js` — única puerta HTTP del frontend. Clasifica los errores
  (red / CORS / HTTP 400 / 404 / 405 / 500) y los convierte en pistas legibles.
- `src/estadoMisiones.js` — tablero de progreso en `localStorage`.
- `src/App.jsx` — hub de arenas, acordeón, candados.

## Desarrollo

```bash
npm install
npm run dev
```

El panel corre en `http://localhost:5173` y habla con el backend en `http://localhost:8000`.

# Día 2: El Portero

Hoy crearás componentes React y conectarás el navegador con Django. React está
en el puerto 5173; Django, en el 8000.

## Mini 6: El Camaleón

**Archivo:** `Frontend/src/features/misiones/dia2/Camaleon.jsx`

Completa el componente para mostrar tu nombre en un `<h1>` con la clase
`titulo-gigante`.

**Comprueba:** pulsa **Verificar el componente**. El panel comprueba el título,
la clase y que el texto ya no sea el marcador inicial.

**Documentación:** [primeros pasos con React](https://react.dev/learn).

## Mini 7: El Albañil

**Archivo:** `Frontend/src/features/misiones/dia2/Contador.jsx`

Completa el contador con `useState`. Muestra el número en un elemento con
`data-cuenta` y usa un botón con `data-aumentar` para sumarle uno.

**Comprueba:** pulsa **Verificar el contador**. El panel pulsa el botón y
comprueba que el número aumente en uno.

**Documentación:** [useState](https://react.dev/reference/react/useState)
y [responder a eventos](https://react.dev/learn/responding-to-events).

## Mini 8: El Impulso

Haz una petición `fetch` a `GET /api/contratos/`. En esta copia, CORS ya está
configurado y la respuesta debe llegar desde Django.

**Comprueba:** pulsa **Impulsar el primer fetch**. El panel aprueba la misión
cuando la petición devuelve una respuesta HTTP exitosa.

**Documentación:** [Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
y [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS).

## Mini 9: El Portero

**Archivo:** `Backend/config/settings.py`

Permite que React consulte Django desde el puerto 5173:

1. Agrega `corsheaders` a `INSTALLED_APPS`.
2. Agrega `corsheaders.middleware.CorsMiddleware` a `MIDDLEWARE`, antes de
   `CommonMiddleware`.
3. En `CORS_ALLOWED_ORIGINS`, permite:
   - `http://localhost:5173`
   - `http://127.0.0.1:5173`
4. Guarda y reinicia `runserver`.

**Comprueba:** el panel envía una petición OPTIONS y luego un GET. El GET debe
responder HTTP 200. Mira ambos en F12 > Network.

**Documentación:** [django-cors-headers](https://github.com/adamchainz/django-cors-headers)
y [CORS en MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS).

## Mini 10: El Render

**Archivo:** `Frontend/src/features/misiones/dia2/Listado.jsx`

Completa `Listado.jsx`. El componente debe:

1. Pedir `/api/contratos/` con `fetch`.
2. Guardar la respuesta con `useState`.
3. Mostrar los contratos con `map()` y una `key` única, como
    `id_contrato`.
4. Agregar a cada `<li>` el atributo `data-id-contrato` con el identificador.

Si ya completaste el Mini 14, los contratos vienen dentro de `datos.results`.

**Comprueba:** pulsa **Verificar el listado**. El panel compara los primeros
contratos de la API con los identificadores que muestra tu lista.

**Documentación:** [mostrar listas en React](https://react.dev/learn/rendering-lists)
y [useEffect](https://react.dev/reference/react/useEffect).

## Antes de pasar al Día 3

El Día 3 se abre al completar las diez primeras misiones. Si el Mini 4 o el
Mini 5 quedó pendiente, vuelve al Día 1 y compruébalo otra vez con CORS abierto.

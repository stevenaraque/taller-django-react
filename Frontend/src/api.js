// ============================================================
// api.js — la única puerta de React hacia Django.
//
// Todas las misiones hablan con el backend AQUÍ, para poder
// clasificar los errores HTTP (400, 404, CORS...) en un solo
// lugar y mostrarlos elegantes en pantalla. Diagnosticar la
// falla ES parte del taller, por eso los mensajes de error son
// pistas, no stack traces.
// ============================================================

// Django corre en el 8000 (React en 5173). Dos orígenes distintos:
// por eso existe el reto del Portero (Mini 9).
export const API_URL = 'http://127.0.0.1:8000/api'

// Falla del taller: todo lo que puede salir mal al hablar HTTP.
export class FallaApi extends Error {
  constructor(tipo, mensaje, estado = null) {
    super(mensaje)
    // tipo: 'cors' | 'red' | 'http' | 'json'
    this.tipo = tipo
    // estado: codigo HTTP crudo (o null cuando ni siquiera hubo respuesta)
    this.estado = estado
  }
}
// Diccionario elegante: codigo HTTP -> pista legible para un aprendiz.
const PISTAS_HTTP = {
  400: 'HTTP 400 · el servidor RECHAZÓ el dato: mira el serializer (El Escudo).',
  401: 'HTTP 401 · falta autenticación en la API.',
  403: 'HTTP 403 · el servidor entendió pero no autoriza.',
  404: 'HTTP 404 · el recurso NO existe: ruta mal escrita o id inexistente.',
  405: 'HTTP 405 · el verbo HTTP no está permitido en esa ruta.',
  500: 'HTTP 500 · error interno del servidor: revisa la terminal de Django.',
}

function lanzarFallaHttp(respuesta) {
  const pista = PISTAS_HTTP[respuesta.status] || `HTTP ${respuesta.status} · respuesta inesperada del servidor`
  return new FallaApi('http', pista, respuesta.status)
}

// ============================================================
// peticion(ruta, opciones)
//   -> resuelve { respuesta, ms }  con el tiempo de viaje medido.
//   -> si la red o el CORS rompen, lanza FallaApi con la pista.
// Las misiones deciden DESPUÉS si el codigo es el que esperaban
// (para un reto, un 400 puede ser la VICTORIA del escudo).
// ============================================================
export async function peticion(ruta, opciones = {}) {
  const inicio = performance.now()
  let respuesta

  try {
    respuesta = await fetch(ruta, opciones)
  } catch {
    // fetch solo lanza cuando la petición NUNCA salió del navegador:
    // servidor apagado, URL mal escrita o CORS bloqueando la
    // respuesta (el navegador no deja verla).
    throw new FallaApi(
      'cors',
      'La petición no cruzó el puerto. ¿El runserver de Django está vivo en el :8000? ¿Ya abriste la puerta CORS (Mini 9)?',
      null,
    )
  }

  return { respuesta, ms: Math.round(performance.now() - inicio) }
}

// pedirOExplotar EXIGE un codigo HTTP 200..299. Para llamadas "normales"
// donde un error HTTP ya es falla en toda regla.
export async function pedirOExplotar(ruta, opciones = {}) {
  const { respuesta, ms } = await peticion(ruta, opciones)
  if (!respuesta.ok) throw lanzarFallaHttp(respuesta)
  // Si el cuerpo no es JSON (ej: una página HTML de error), explota claro.
  let datos
  try {
    datos = await respuesta.json()
  } catch {
    throw new FallaApi('json', 'El servidor respondió algo que NO es JSON.', respuesta.status)
  }
  return { respuesta, ms, datos }
}

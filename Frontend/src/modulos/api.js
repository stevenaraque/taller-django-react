// Base de la API del taller. Django debe estar corriendo en el puerto 8000.
export const API_URL = 'http://127.0.0.1:8000/api/tareas/'

// Lanza los verbos de la API y lanza un error si la respuesta no fue buena,
// para que los modulos tengan que manejar el problema igual que el estudiante.
export async function asegurar(respuesta) {
  if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`)
  return respuesta
}

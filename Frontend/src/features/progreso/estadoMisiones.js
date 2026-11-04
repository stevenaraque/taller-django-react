export const CLAVE_TABLERO = 'taller-secop-misiones-aprobadas'
const CLAVE_REVALIDACION = 'taller-secop-misiones-revalidacion-v1'
const MISIONES_POR_REVALIDAR = [6, 7, 10, 12]

export function leerAprobadas() {
  const guardado = localStorage.getItem(CLAVE_TABLERO)
  if (!guardado) return []
  try {
    const aprobadas = JSON.parse(guardado)
    if (!Array.isArray(aprobadas)) return []

    if (localStorage.getItem(CLAVE_REVALIDACION) === 'true') return aprobadas

    const aprobadasActualizadas = aprobadas.filter((numero) => {
      return !MISIONES_POR_REVALIDAR.includes(numero)
    })
    localStorage.setItem(CLAVE_TABLERO, JSON.stringify(aprobadasActualizadas))
    localStorage.setItem(CLAVE_REVALIDACION, 'true')

    return aprobadasActualizadas
  } catch {
    return []
  }
}

export function aprobarMision(numero) {
  const aprobadas = leerAprobadas()
  if (!aprobadas.includes(numero)) {
    localStorage.setItem(CLAVE_TABLERO, JSON.stringify(aprobadas.concat(numero)))
  }
}

export function borrarTablero() {
  localStorage.removeItem(CLAVE_TABLERO)
}

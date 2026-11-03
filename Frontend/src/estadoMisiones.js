// ============================================================
// estadoMisiones.js — el tablero de misiones del taller.
//
// Guarda en localStorage el estado de cada misión (Aprobada o no)
// y el "modo instructor" (desbloquea todo para ensayar la clase).
// Sin backend, sin cuenta de usuario: el progreso viaja con el
// navegador del estudiante.
// ============================================================

export const CLAVE_TABLERO = 'taller-secop-misiones-aprobadas'
export const CLAVE_INSTRUCTOR = 'taller-secop-modo-instructor'

// Mapa de las 15 misiones: lo usa App.jsx para el panel y el candado.
export const MISIONES = [
  // DIA 1 — El Velocista (backend)
  { numero: 1, dia: 1, alias: 'Mini 1', titulo: 'La Bóveda' },
  { numero: 2, dia: 1, alias: 'Mini 2', titulo: 'El Arquitecto' },
  { numero: 3, dia: 1, alias: 'Mini 3', titulo: 'El Jefe Maestro' },
  { numero: 4, dia: 1, alias: 'Mini 4', titulo: 'El Escudo' },
  { numero: 5, dia: 1, alias: 'Mini 5', titulo: 'El Velocista' },
  // DIA 2 — El Portero (React y CORS)
  { numero: 6, dia: 2, alias: 'Mini 6', titulo: 'El Camaleón' },
  { numero: 7, dia: 2, alias: 'Mini 7', titulo: 'El Albañil' },
  { numero: 8, dia: 2, alias: 'Mini 8', titulo: 'El Impulso' },
  { numero: 9, dia: 2, alias: 'Mini 9', titulo: 'El Portero' },
  { numero: 10, dia: 2, alias: 'Mini 10', titulo: 'El Render' },
  // DIA 3 — Pentatlón Big Data (alto rendimiento)
  { numero: 11, dia: 3, alias: 'Mini 11', titulo: 'La Avalancha' },
  { numero: 12, dia: 3, alias: 'Mini 12', titulo: 'El Analista' },
  { numero: 13, dia: 3, alias: 'Mini 13', titulo: 'La Aguja en el Pajar' },
  { numero: 14, dia: 3, alias: 'Mini 14', titulo: 'El Regulador' },
  { numero: 15, dia: 3, alias: 'Mini 15', titulo: 'El Limpiador' },
]

// Las misiones aprobadas viven como una lista de numeros en localStorage.
export function leerAprobadas() {
  const guardado = localStorage.getItem(CLAVE_TABLERO)
  if (!guardado) return []
  try {
    return JSON.parse(guardado)
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

// El modo instructor desbloquea TODAS las misiones para ensayar la
// clase con la plantilla fresca (o para rematar un grupo perdido).
export function leerModoInstructor() {
  return localStorage.getItem(CLAVE_INSTRUCTOR) === 'true'
}

export function alternarModoInstructor() {
  const nuevo = !leerModoInstructor()
  localStorage.setItem(CLAVE_INSTRUCTOR, JSON.stringify(nuevo))
  return nuevo
}

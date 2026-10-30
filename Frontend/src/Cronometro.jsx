import { useState, useEffect } from 'react'

/**
 * Cronometro: muestra el tiempo (ms) que tardo la llamada a la API.
 * Aparato del reto "El Velocista". Recibe el tiempo por la prop `ms`.
 */
function Cronometro({ ms }) {
  const [transcurridos, setTranscurridos] = useState(0)

  // Cuenta los ms que van pasando mientras no llega la respuesta
  useEffect(() => {
    if (ms !== null) return
    const inicio = Date.now()
    const t = setInterval(() => {
      setTranscurridos(Date.now() - inicio)
    }, 50)
    return () => clearInterval(t)
  }, [ms])

  const tiempo = ms === null ? transcurridos : ms
  const corriendo = ms === null

  return (
    <div className="cronometro" data-corriendo={corriendo}>
      <span className="cronometro-velocista" role="img" aria-label="velocista">🏃</span>
      <span className="cronometro-numero">{tiempo}</span>
      <span className="cronometro-unidad">ms</span>
      <span className="cronometro-estado">
        {corriendo ? 'midiendo consulta...' : 'consulta completada'}
      </span>
    </div>
  )
}

export default Cronometro

import { useState, useEffect } from 'react'

/**
 * Cronometro: muestra el tiempo (ms) que tardo la llamada a la API.
 * Aparato de la arena "El Velocista". Recibe el tiempo por la prop `ms`
 * y mientras venga null cuenta en pantalla. `etiqueta` es el texto que
 * muestra cuando se detiene.
 */
function Cronometro({ ms, etiqueta = 'consulta completada' }) {
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
      <span className="cronometro-numero">{tiempo}</span>
      <span className="cronometro-unidad">ms</span>
      <span className="cronometro-estado">
        {corriendo ? 'midiendo consulta...' : etiqueta}
      </span>
    </div>
  )
}

export default Cronometro

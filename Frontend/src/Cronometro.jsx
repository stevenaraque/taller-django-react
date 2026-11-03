import { useState, useEffect } from 'react'

/**
 * Cronometro: muestra el tiempo (ms) que tardo la llamada a la API.
 * Aparato de la arena "El Velocista".
 *
 * Cuatro estados reales para no contar de mas:
 *   reposo      -> nadie corrio nada aun: listo para la arena.
 *   corriendo   -> la consulta va en vuelo: los ms suben en vivo.
 *   interrumpida-> la consulta choqué (CORS/red): congelado con su aviso.
 *   detenido    -> hubo respuesta: se muestra el ms exacto y la etiqueta.
 */
function Cronometro({ ms, etiqueta = 'consulta completada', corriendo = false, interrumpida = false }) {
  const [transcurridos, setTranscurridos] = useState(0)

  // Solo cuenta mientras la consulta esté en vuelo (corriendo). Fuera de
  // eso el aparato descansa: sin intervalos zombies contando para siempre.
  useEffect(() => {
    if (ms !== null || !corriendo) return undefined
    const inicio = Date.now()
    setTranscurridos(0)
    const t = setInterval(() => {
      setTranscurridos(Date.now() - inicio)
    }, 50)
    return () => clearInterval(t)
  }, [ms, corriendo])

  const contando = ms === null && corriendo
  const tiempo = ms === null ? transcurridos : ms

  let texto = 'listo para la arena'
  let estado = 'reposo'
  if (contando) {
    texto = 'midiendo consulta...'
    estado = 'corriendo'
  } else if (ms === null && interrumpida) {
    texto = 'consulta interrumpida (mira el aviso)'
    estado = 'interrumpida'
  } else if (ms !== null) {
    texto = etiqueta
    estado = 'detenido'
  }

  return (
    <div className="cronometro" data-corriendo={contando} data-estado={estado}>
      <span className="cronometro-numero">{tiempo}</span>
      <span className="cronometro-unidad">ms</span>
      <span className="cronometro-estado">{texto}</span>
    </div>
  )
}

export default Cronometro

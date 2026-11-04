import { useState, useEffect } from 'react'

function Cronometro({
  ms,
  etiqueta = 'consulta completada',
  corriendo = false,
  interrumpida = false,
}) {
  const [transcurridos, setTranscurridos] = useState(0)

  useEffect(() => {
    if (ms !== null || !corriendo) return undefined
    const inicio = Date.now()
    const t = setInterval(() => {
      setTranscurridos(Date.now() - inicio)
    }, 50)
    return () => {
      clearInterval(t)
      setTranscurridos(0)
    }
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

import { useRef, useState } from 'react'
import MisionMarco from '../MisionMarco'
import Contador from './Contador'

const INSTRUCCION =
  'Completa Contador.jsx con useState. El botón debe aumentar el número ' +
  'en uno cada vez que lo pulses.'

export default function Mini7Albannil({ desbloqueada, aprobada, alAprobar }) {
  const contadorRef = useRef(null)
  const [verificacion, setVerificacion] = useState(null)

  async function verificar() {
    const salida = contadorRef.current?.querySelector('[data-cuenta]')
    const boton = contadorRef.current?.querySelector('[data-aumentar]')
    const inicial = Number(salida?.textContent.trim())

    if (!salida || !boton || !Number.isFinite(inicial)) {
      setVerificacion({
        ok: false,
        mensaje: 'Agrega un número y un botón para aumentarlo.',
      })
      return
    }

    boton.click()
    await new Promise((resolver) => window.setTimeout(resolver, 0))

    const actualizado = Number(salida.textContent.trim())
    if (actualizado === inicial + 1) {
      alAprobar()
      setVerificacion({
        ok: true,
        mensaje: 'El contador aumentó en uno.',
      })
      return
    }

    setVerificacion({
      ok: false,
      mensaje: 'El botón debe aumentar el número en uno.',
    })
  }

  return (
    <MisionMarco
      alias="Mini 7"
      titulo="El Albañil"
      desbloqueada={desbloqueada}
      aprobada={aprobada}
    >
      <p className="mision-instruccion">{INSTRUCCION}</p>

      <div ref={contadorRef}>
        <Contador />
      </div>

      <button className="boton" onClick={verificar}>
        Verificar el contador
      </button>

      {verificacion && (
        <div className="aviso" data-tipo={verificacion.ok ? 'ok' : 'error'}>
          {verificacion.mensaje}
        </div>
      )}
    </MisionMarco>
  )
}

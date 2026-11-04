import { useRef, useState } from 'react'
import MisionMarco from '../MisionMarco'
import Camaleon from './Camaleon'

const INSTRUCCION =
  'Camaleon.jsx muestra un h1 con la clase titulo-gigante. Verifica el componente.'

export default function Mini6Camaleon({ desbloqueada, aprobada, alAprobar }) {
  const camaleonRef = useRef(null)
  const [verificacion, setVerificacion] = useState(null)

  function verificar() {
    const titulo = camaleonRef.current?.querySelector('h1')
    const texto = titulo?.textContent.trim() || ''
    const esMarcador = /^(escribe tu nombre aquí|todo)$/i.test(texto)

    if (titulo?.classList.contains('titulo-gigante') && texto && !esMarcador) {
      alAprobar()
      setVerificacion({
        ok: true,
        mensaje: 'El título aparece con la clase solicitada.',
      })
      return
    }

    setVerificacion({
      ok: false,
      mensaje: 'Revisa el h1, su clase y el texto con tu nombre.',
    })
  }

  return (
    <MisionMarco
      alias="Mini 6"
      titulo="El Camaleón"
      desbloqueada={desbloqueada}
      aprobada={aprobada}
    >
      <p className="mision-instruccion">{INSTRUCCION}</p>

      <div ref={camaleonRef}>
        <Camaleon />
      </div>

      <button className="boton" onClick={verificar}>
        Verificar el componente
      </button>

      {verificacion && (
        <div className="aviso" data-tipo={verificacion.ok ? 'ok' : 'error'}>
          {verificacion.mensaje}
        </div>
      )}
    </MisionMarco>
  )
}

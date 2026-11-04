import { useState } from 'react'
import MisionMarco from '../MisionMarco'
import { API_URL, peticion } from '../../../shared/api'

const INSTRUCCION =
  'Haz una petición GET a la API y comprueba que React puede recibir la ' +
  'respuesta de Django desde otro origen.'

export default function Mini8Impulso({ desbloqueada, aprobada, alAprobar }) {
  const [resultado, setResultado] = useState(null)
  const [lanzando, setLanzando] = useState(false)

  async function impulso() {
    setLanzando(true)
    setResultado(null)

    try {
      const { respuesta } = await peticion(`${API_URL}/contratos/`)
      setResultado({
        correcto: respuesta.ok,
        codigo: respuesta.status,
        detalle: respuesta.ok
          ? 'Django respondió y el navegador permitió leer la respuesta.'
          : 'Django respondió con un error HTTP.',
      })
      if (respuesta.ok) alAprobar()
    } catch (roto) {
      setResultado({
        correcto: false,
        codigo: 'sin respuesta',
        detalle: roto.message,
      })
    } finally {
      setLanzando(false)
    }
  }

  return (
    <MisionMarco
      alias="Mini 8"
      titulo="El Impulso"
      desbloqueada={desbloqueada}
      aprobada={aprobada}
    >
      <p className="mision-instruccion">{INSTRUCCION}</p>

      <div className="fila-acciones">
        <button className="boton" onClick={impulso} disabled={lanzando}>
          {lanzando ? 'Impulsando...' : 'Impulsar el primer fetch'}
        </button>
        <span className="celda-suave">
          GET /api/contratos/ desde React (:5173)
        </span>
      </div>

      {resultado && (
        <div
          className="aviso"
          data-tipo={resultado.correcto ? 'ok' : 'error'}
          style={{ marginTop: 12 }}
        >
          HTTP {resultado.codigo} · {resultado.detalle}
        </div>
      )}
    </MisionMarco>
  )
}

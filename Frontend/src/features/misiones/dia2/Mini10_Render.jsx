import { useRef, useState } from 'react'
import MisionMarco from '../MisionMarco'
import { API_URL, pedirOExplotar } from '../../../shared/api'
import Listado from './Listado'

const INSTRUCCION =
  'Listado.jsx consulta la API con fetch, usa datos.results si la respuesta ' +
  'está paginada y muestra el identificador único de cada contrato.'

export default function Mini10Render({ desbloqueada, aprobada, alAprobar }) {
  const listadoRef = useRef(null)
  const [jsonCrudo, setJsonCrudo] = useState('')
  const [falla, setFalla] = useState(null)
  const [trayendo, setTrayendo] = useState(false)
  const [verificacion, setVerificacion] = useState(null)

  async function traerJson() {
    setTrayendo(true)
    setFalla(null)
    try {
      const { datos } = await pedirOExplotar(`${API_URL}/contratos/`)
      const listado = Array.isArray(datos) ? datos : datos.results || []
      setJsonCrudo(JSON.stringify(listado, null, 2))
    } catch (laRedRota) {
      setFalla(laRedRota.message)
    } finally {
      setTrayendo(false)
    }
  }

  async function verificarListado() {
    setFalla(null)
    setVerificacion(null)

    try {
      const { datos } = await pedirOExplotar(`${API_URL}/contratos/`)
      const contratos = Array.isArray(datos) ? datos : datos.results || []
      const esperados = contratos.slice(0, 3).map((contrato) => contrato.id_contrato)
      const mostrados = Array.from(
        listadoRef.current?.querySelectorAll('[data-id-contrato]') || [],
      ).map((elemento) => elemento.dataset.idContrato)
      const listaCorrecta =
        esperados.length > 0 && esperados.every((id) => mostrados.includes(id))

      if (listaCorrecta) {
        alAprobar()
        setVerificacion({
          ok: true,
          mensaje: 'El listado muestra contratos de la API.',
        })
        return
      }

      setVerificacion({
        ok: false,
        mensaje: esperados.length
          ? 'El listado todavía no muestra los primeros contratos de la API.'
          : 'No hay contratos para comparar. Crea uno en el Mini 3 o carga datos de prueba.',
      })
    } catch (laRedRota) {
      setFalla(laRedRota.message)
    }
  }

  return (
    <MisionMarco
      alias="Mini 10"
      titulo="El Render"
      desbloqueada={desbloqueada}
      aprobada={aprobada}
    >
      <p className="mision-instruccion">{INSTRUCCION}</p>

      <div className="fila-acciones">
        <button className="boton" onClick={traerJson} disabled={trayendo}>
          {trayendo ? 'Fetch...' : 'Traer el JSON crudo'}
        </button>
        <span className="celda-suave">
          el material que tu render debe pintar (GET /api/contratos/)
        </span>
        <button className="boton" onClick={verificarListado}>
          Verificar el listado
        </button>
      </div>

      {falla && <div className="aviso" data-tipo="error" style={{ marginTop: 12 }}>{falla}</div>}

      {jsonCrudo && (
        <pre className="mision-pizarra" style={{ marginTop: 12, maxHeight: 240, overflow: 'auto' }}>
          {jsonCrudo}
        </pre>
      )}

      <div ref={listadoRef}>
        <Listado />
      </div>

      {verificacion && (
        <div className="aviso" data-tipo={verificacion.ok ? 'ok' : 'error'}>
          {verificacion.mensaje}
        </div>
      )}
    </MisionMarco>
  )
}

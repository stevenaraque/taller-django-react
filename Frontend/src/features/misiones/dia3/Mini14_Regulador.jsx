// TODO (RETO 14) - Activar la paginación global en settings.py.
import { useState } from 'react'
import MisionMarco from '../MisionMarco'
import { API_URL, pedirOExplotar } from '../../../shared/api'

const INSTRUCCION =
  'TODO (RETO 14): descomenta el bloque REST_FRAMEWORK al final de ' +
  'Backend/config/settings.py (PageNumberPagination con PAGE_SIZE 50) y ' +
  'reinicia el runserver. Después presiona "Verificar el caudal".'

export default function Mini14Regulador({ desbloqueada, aprobada, alAprobar }) {
  const [estadoCaudal, setEstadoCaudal] = useState(null)
  const [falla, setFalla] = useState(null)
  const [midiendo, setMidiendo] = useState(false)

  async function verificar() {
    if (midiendo) return
    setMidiendo(true)
    setFalla(null)

    try {
      const { datos, ms } = await pedirOExplotar(`${API_URL}/contratos/`)
      const paginado = datos && typeof datos === 'object' && !Array.isArray(datos) && 'results' in datos
      setEstadoCaudal({ paginado, datos, ms })

      if (paginado) alAprobar()
    } catch (laRedRota) {
      setFalla(laRedRota.message)
    } finally {
      setMidiendo(false)
    }
  }

  const datos = estadoCaudal?.datos
  const listado = Array.isArray(datos) ? datos : datos?.results || []

  return (
    <MisionMarco
      alias="Mini 14"
      titulo="El Regulador"
      desbloqueada={desbloqueada}
      aprobada={aprobada}
    >
      <p className="mision-instruccion">{INSTRUCCION}</p>

      <div className="fila-acciones">
        <button className="boton" onClick={verificar} disabled={midiendo}>
          {midiendo ? 'Midiendo el caudal...' : 'Verificar el caudal'}
        </button>
        <span className="celda-suave">
          GET /api/contratos/ · se espera { '{count, next, previous, results}' }
        </span>
      </div>

      {falla && <div className="aviso" data-tipo="error" style={{ marginTop: 12 }}>{falla}</div>}

      {estadoCaudal && (
        <div className="aviso" data-tipo={estadoCaudal.paginado ? 'ok' : 'error'} style={{ marginTop: 12 }}>
          {estadoCaudal.paginado
            ? `Regulado: la API responde con count y results. Página de ${listado.length} contratos · conteo global ${estadoCaudal.datos.count} · ${estadoCaudal.ms} ms.`
            : `AVISO: el listado llegó CRUDO (${estadoCaudal.datos.length} filas). Sin paginación el frontend colapsa con 50k registros.`}
        </div>
      )}
    </MisionMarco>
  )
}

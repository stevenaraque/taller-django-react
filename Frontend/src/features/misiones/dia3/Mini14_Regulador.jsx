import { useState } from 'react'
import MisionMarco from '../MisionMarco'
import { API_URL, pedirOExplotar } from '../../../shared/api'

const INSTRUCCION =
  'En Backend/contratos/paginacion.py crea una clase que herede de ' +
  'PageNumberPagination con page_size=50 y page_size_query_param="page_size". ' +
  'Apúntala en REST_FRAMEWORK (settings.py) y reinicia runserver. El panel ' +
  'comprueba el objeto {count, next, previous, results} y que ?page_size=5 ' +
  'entregue solo 5 filas.'

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
      const paginado =
        datos && typeof datos === 'object' && !Array.isArray(datos) && 'results' in datos

      // Si la base tiene al menos 6 filas, la página debe poder comprimirse a 5.
      const total = datos.count ?? 0
      let regulable = null
      if (paginado && total > 5) {
        const golpecito = await pedirOExplotar(`${API_URL}/contratos/?page_size=5`)
        const cortado = Array.isArray(golpecito.datos)
          ? golpecito.datos
          : golpecito.datos.results ?? []
        regulable = cortado.length === 5
      }

      setEstadoCaudal({ paginado, regulable, total, datos, ms })
      if (paginado && regulable !== false) alAprobar()
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
        <div
          className="aviso"
          data-tipo={estadoCaudal.paginado && estadoCaudal.regulable !== false ? 'ok' : 'error'}
          style={{ marginTop: 12 }}
        >
          {estadoCaudal.paginado
            ? estadoCaudal.regulable === false
              ? 'El listado está paginado, pero ?page_size=5 no recortó la página. Configura page_size_query_param en tu clase de paginación.'
              : `Regulado: la API responde con count y results. Página de ${listado.length} contratos · conteo global ${estadoCaudal.datos.count} · ${estadoCaudal.ms} ms.`
            : `AVISO: el listado llegó CRUDO (${estadoCaudal.datos.length} filas). Sin paginación el frontend colapsa con 50k registros.`}
        </div>
      )}
    </MisionMarco>
  )
}

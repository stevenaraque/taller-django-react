// ============================================================
// Mini14_Regulador.jsx — DÍA 3 · Mini 14 "El Regulador" (Asalto 4)
//
// La paginación global protege la arena: 50.000 contratos en un
// JSON aplastan la red y el navegador. El estudiante descomenta
// el bloque REST_FRAMEWORK en settings.py (RETO 14) y toda la
// API regula su caudal.
//
// El panel compara la respuesta antes/despues: crudo (lista) vs
// regulado ({count, next, previous, results}). Aprueba cuando
// ve el caudal regulado por primera vez.
// ============================================================
import { useState } from 'react'
import MisionMarco from '../MisionMarco'
import { API_URL, pedirOExplotar } from '../api'

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

      // VICTORIA: la API reguló el caudal por primera vez.
      if (paginado) alAprobar()
    } catch (laRedRota) {
      setFalla(laRedRota.message)
    } finally {
      setMidiendo(false)
    }
  }

  const listado = estadoCaudal
    ? Array.isArray(estadoCaudal.datos) ? estadoCaudal.datos : estadoCaudal.datos?.results || []
    : []

  return (
    <MisionMarco
      alias="Mini 14"
      titulo="El Regulador"
      teoria="Sin regulador, un GET trae TODOS los contratos: con 50.000 filas la red y el navegador se ahogan. PageNumberPagination corta en 50 filas y agrega count plus los links de navegación. Se configura UNA vez y protege TODA la API."
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

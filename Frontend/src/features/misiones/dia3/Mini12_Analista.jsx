// TODO (RETO 12) - Crear la vista y ruta de estadísticas.
import { lazy, Suspense, useRef, useState } from 'react'
import MisionMarco from '../MisionMarco'
import { API_URL, pedirOExplotar } from '../../../shared/api'
const GraficaEstados = lazy(() => import('./GraficaEstados'))

const INSTRUCCION =
  'Crea la ruta de estadísticas y conecta por_estado con la gráfica en filas ' +
  'con estado y contratos. Si por_estado es un objeto, conviértelo a una lista.'

export default function Mini12Analista({ desbloqueada, aprobada, alAprobar }) {
  const graficaRef = useRef(null)
  const [informe, setInforme] = useState(null)
  const [falla, setFalla] = useState(null)
  const [midiendo, setMidiendo] = useState(false)
  const [verificacion, setVerificacion] = useState(null)

  async function pedirMetricas() {
    if (midiendo) return
    setMidiendo(true)
    setFalla(null)
    setInforme(null)
    setVerificacion(null)

    try {
      const { datos, ms } = await pedirOExplotar(`${API_URL}/contratos/estadisticas/`)
      setInforme({ ...datos, ms })
    } catch (laRedRota) {
      setFalla(laRedRota.message)
    } finally {
      setMidiendo(false)
    }
  }

  function verificarGrafica() {
    const figura = graficaRef.current?.querySelector('figure')
    const esperados = filasPorEstado(informe?.por_estado)
    let datosRecibidos = []

    try {
      datosRecibidos = JSON.parse(figura?.dataset.estados || '[]')
    } catch {
      datosRecibidos = []
    }

    const recibidos = filasPorEstado(datosRecibidos)
    const hayContratos = esperados.some((fila) => fila.contratos > 0)
    const datosCorrectos =
      hayContratos &&
      esperados.length === recibidos.length &&
      esperados.every((fila, indice) => {
        return (
          fila.estado === recibidos[indice]?.estado &&
          fila.contratos === Number(recibidos[indice]?.contratos)
        )
      })

    if (datosCorrectos) {
      alAprobar()
      setVerificacion({
        ok: true,
        mensaje: 'La gráfica coincide con los contratos por estado.',
      })
      return
    }

    setVerificacion({
      ok: false,
      mensaje: hayContratos
        ? 'Conecta a la gráfica los estados y conteos del informe.'
        : 'No hay contratos para comparar. Crea uno o carga datos de prueba.',
    })
  }

  return (
    <MisionMarco
      alias="Mini 12"
      titulo="El Analista"
      desbloqueada={desbloqueada}
      aprobada={aprobada}
    >
      <p className="mision-instruccion">{INSTRUCCION}</p>

      <div className="fila-acciones">
        <button className="boton" onClick={pedirMetricas} disabled={midiendo}>
          {midiendo ? 'Analizando...' : 'Pedir el informe del analista'}
        </button>
        <span className="celda-suave">
          GET /api/contratos/estadisticas/ · aggregate para la suma global
        </span>
      </div>

      {falla && <div className="aviso" data-tipo="error" style={{ marginTop: 12 }}>{falla}</div>}

      {informe?.metricas && (
        <div className="resumen-stats" style={{ marginTop: 12 }}>
          <span className="stat">
            <span className="stat-valor">{informe.ms}</span>
            <span className="stat-etiqueta">ms del informe</span>
          </span>
          <span className="stat">
            <span className="stat-valor">{informe.metricas.total_contratos}</span>
            <span className="stat-etiqueta">contratos en la bóveda</span>
          </span>
          <span className="stat">
            <span className="stat-valor">{formatearMil(informe.metricas.suma_valor_total)}</span>
            <span className="stat-etiqueta">suma de valor_total</span>
          </span>
          <span className="stat">
            <span className="stat-valor">{formatearMil(informe.metricas.promedio_valor_total)}</span>
            <span className="stat-etiqueta">promedio del contrato</span>
          </span>
        </div>
      )}

      <div ref={graficaRef}>
        {/* TODO (RETO 12) - Pasar informe.por_estado a la gráfica. */}
        <Suspense fallback={<p className="celda-suave">Cargando gráfica…</p>}>
          <GraficaEstados />
        </Suspense>
      </div>

      <button
        className="boton"
        onClick={verificarGrafica}
        disabled={!informe || midiendo}
      >
        Verificar la gráfica
      </button>

      {verificacion && (
        <div className="aviso" data-tipo={verificacion.ok ? 'ok' : 'error'}>
          {verificacion.mensaje}
        </div>
      )}

      {informe?.por_estado && (
        <table className="tabla" style={{ marginTop: 12 }}>
          <thead>
            <tr>
              <th>estado</th>
              <th className="numero">contratos</th>
              <th className="numero">suma valor_total</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(informe.por_estado).map(([estado, fila]) => (
              <tr key={estado}>
                <td>{estado}</td>
                <td className="numero">{fila.contratos ?? fila}</td>
                <td className="numero">{formatearMil(fila.suma)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </MisionMarco>
  )
}

function formatearMil(valor) {
  if (valor === null || valor === undefined) return '—'
  const numero = Number(valor)
  return Number.isNaN(numero) ? '—' : numero.toLocaleString('es-CO')
}

function filasPorEstado(porEstado) {
  const filas = Array.isArray(porEstado)
    ? porEstado.map((fila) => [fila.estado, fila])
    : Object.entries(porEstado || {})

  return filas
    .map(([estado, fila]) => ({
      estado,
      contratos: Number(fila?.contratos ?? fila),
    }))
    .sort((primera, segunda) => primera.estado.localeCompare(segunda.estado))
}

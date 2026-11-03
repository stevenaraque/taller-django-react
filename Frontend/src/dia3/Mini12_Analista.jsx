// ============================================================
// Mini12_Analista.jsx — DÍA 3 · Mini 12 "El Analista" (Asalto 2)
//
// El panel del analista: pide /api/contratos/estadisticas/ y
// pinta las métricas agregadas que la bóveda calculó en una
// SOLA ida (aggregate para la suma global; annotate para el
// conteo por estado y por día).
//
// TODO (RETO 12): el estudiante escribe EstadisticasView en
// Backend/contratos/views.py y la ruta en urls.py.
// ============================================================
import { useState } from 'react'
import MisionMarco from '../MisionMarco'
import { API_URL, pedirOExplotar } from '../api'

const INSTRUCCION =
  'TODO (RETO 12): escribe EstadisticasView en Backend/contratos/views.py ' +
  '(aggregate + annotate, ficha comentada ahí) y la ruta ' +
  'contratos/estadisticas/ en urls.py.'

export default function Mini12Analista({ desbloqueada, aprobada, alAprobar }) {
  const [informe, setInforme] = useState(null)
  const [falla, setFalla] = useState(null)
  const [midiendo, setMidiendo] = useState(false)

  // Sondear el informe del analista: GET /api/contratos/estadisticas/.
  async function pedirMetricas() {
    if (midiendo) return
    setMidiendo(true)
    setFalla(null)
    setInforme(null)

    try {
      const { datos, ms } = await pedirOExplotar(`${API_URL}/contratos/estadisticas/`)
      setInforme({ ...datos, ms })
      // VICTORIA: el ORM ya devolvió las dos piezas del análisis.
      if (datos.por_estado && datos.metricas) alAprobar()
    } catch (laRedRota) {
      setFalla(laRedRota.message)
    } finally {
      setMidiendo(false)
    }
  }

  return (
    <MisionMarco
      alias="Mini 12"
      titulo="El Analista"
      teoria="Proyecta SQL y ORM en paralelo: la misma métrica son 10 líneas de SQL o 1 línea de aggregate(). El annotate agrupa sin escribir GROUP BY a mano. Este es el panel táctico del Analista: los milisegundos no mienten."
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

// Un número muy grande llena el panel: se formatea con separadores
// de miles (es-CO) para que la suma se lea de un vistazo.
function formatearMil(valor) {
  if (valor === null || valor === undefined) return '—'
  const numero = Number(valor)
  return Number.isNaN(numero) ? '—' : numero.toLocaleString('es-CO')
}

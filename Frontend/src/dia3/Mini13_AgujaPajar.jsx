// ============================================================
// Mini13_AgujaPajar.jsx — DÍA 3 · Mini 13 "La Aguja en el Pajar"
//
// Asalto 3: buscar UNA aguja entre miles de contratos con el
// SearchFilter del DRF — sin escribir SQL y sin tocar el
// frontend.
//
// TODO (RETO 13): en Backend/contratos/views.py agrega las dos
// variables del ContratoViewSet (filter_backends + search_fields,
// ficha comentada en el bloque del RETO 13 ahí).
// ============================================================
import { useState } from 'react'
import MisionMarco from '../MisionMarco'
import { API_URL, pedirOExplotar } from '../api'

const INSTRUCCION =
  'TODO (RETO 13): en el ContratoViewSet agrega filter_backends = [SearchFilter] ' +
  "y search_fields (ficha en views.py). Después busca aquí una palabra y " +
  'compara el tiempo con el GET completo.'

export default function Mini13AgujaPajar({ desbloqueada, aprobada, alAprobar }) {
  const [caza, setCaza] = useState('Ministerio')
  const [resultado, setResultado] = useState(null)
  const [falla, setFalla] = useState(null)
  const [cazando, setCazando] = useState(false)

  async function buscar() {
    if (cazando) return
    setCazando(true)
    setFalla(null)
    setResultado(null)

    const aguja = caza.trim()
    if (!aguja) {
      setFalla('Escribe la aguja que vas a buscar (una palabra legible).')
      setCazando(false)
      return
    }

    try {
      // El SearchFilter vive en la query ?search=  — ni una línea de SQL.
      const { datos, ms } = await pedirOExplotar(`${API_URL}/contratos/?search=${encodeURIComponent(aguja)}`)
      setResultado({ ms, total: datos.count ?? datos.length, aguja })
      // VICTORIA: la búsqueda respondió desde los 50k registros.
      alAprobar()
    } catch (laRedRota) {
      setFalla(laRedRota.message)
    } finally {
      setCazando(false)
    }
  }

  return (
    <MisionMarco
      alias="Mini 13"
      titulo="La Aguja en el Pajar"
      teoria="Antes del reto, muestra el GET completo: miles de contratos volcados en el navegador y la búsqueda a mano. Después enciende el SearchFilter y repite: el ILIKE lo genera el ORM. Sin SQL, sin frontend nuevo."
      desbloqueada={desbloqueada}
      aprobada={aprobada}
    >
      <p className="mision-instruccion">{INSTRUCCION}</p>

      <div className="fila-acciones">
        <input
          className="campo-texto"
          placeholder="Aguja (Ministerio, Alcaldía, Terminal, puente...)"
          value={caza}
          onChange={(evento) => setCaza(evento.target.value)}
          onKeyDown={(evento) => evento.key === 'Enter' && buscar()}
        />
        <button className="boton" onClick={buscar} disabled={cazando}>
          {cazando ? 'Cazando...' : 'Cazar la aguja'}
        </button>
        <span className="celda-suave">GET /api/contratos/?search=</span>
      </div>

      {falla && <div className="aviso" data-tipo="error" style={{ marginTop: 12 }}>{falla}</div>}

      {resultado && (
        <div className="resumen-stats" style={{ marginTop: 12 }}>
          <span className="stat">
            <span className="stat-valor">{resultado.total}</span>
            <span className="stat-etiqueta">contratos que coinciden</span>
          </span>
          <span className="stat">
            <span className="stat-valor">{resultado.ms}</span>
            <span className="stat-etiqueta">ms de la caza</span>
          </span>
          <span className="stat">
            <span className="stat-valor">{resultado.aguja}</span>
            <span className="stat-etiqueta">la aguja</span>
          </span>
        </div>
      )}
    </MisionMarco>
  )
}

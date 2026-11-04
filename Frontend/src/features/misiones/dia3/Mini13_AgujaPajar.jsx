// TODO (RETO 13) - Agregar SearchFilter al ContratoViewSet.
import { useState } from 'react'
import MisionMarco from '../MisionMarco'
import { API_URL, pedirOExplotar } from '../../../shared/api'

const INSTRUCCION =
  'TODO (RETO 13): en el ContratoViewSet agrega filter_backends = [SearchFilter] ' +
  "y search_fields (ficha en views.py). Después busca aquí una palabra y " +
  'compara el tiempo con el GET completo.'

export default function Mini13AgujaPajar({ desbloqueada, aprobada, alAprobar }) {
  const [caza, setCaza] = useState('Ministerio')
  const [resultado, setResultado] = useState(null)
  const [falla, setFalla] = useState(null)
  const [nota, setNota] = useState(null)
  const [cazando, setCazando] = useState(false)

  async function buscar() {
    if (cazando) return
    setCazando(true)
    setFalla(null)
    setNota(null)
    setResultado(null)

    const aguja = caza.trim()
    if (!aguja) {
      setFalla('Escribe la aguja que vas a buscar (una palabra legible).')
      setCazando(false)
      return
    }

    try {
      const { datos, ms } = await pedirOExplotar(`${API_URL}/contratos/?search=${encodeURIComponent(aguja)}`)
      setResultado({ ms, total: datos.count ?? datos.length, aguja })
      alAprobar()
      // La misión valida la respuesta de la API, aunque no haya coincidencias.
      if ((datos.count ?? datos.length) === 0) {
        setNota(`0 coincidencias para "${aguja}" — la aguja no encontró nada. Prueba otra palabra (Ministerio, Alcaldía, puente).`)
      }
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
      {nota && <div className="aviso" style={{ marginTop: 12 }}>{nota}</div>}

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

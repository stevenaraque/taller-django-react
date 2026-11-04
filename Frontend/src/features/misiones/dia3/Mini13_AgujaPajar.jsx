import { useState } from 'react'
import MisionMarco from '../MisionMarco'
import { API_URL, pedirOExplotar } from '../../../shared/api'

const INSTRUCCION =
  'En ContratoViewSet configura las tres herramientas: SearchFilter con los ' +
  'campos id_contrato, entidad_compradora y descripcion; un filtro propio en ' +
  'get_queryset() que reciba ?estado= y use estado__iexact; y OrderingFilter ' +
  'con ordering_fields en valor_total y fecha_firma.'

export default function Mini13AgujaPajar({ desbloqueada, aprobada, alAprobar }) {
  const [caza, setCaza] = useState('Ministerio')
  const [resultado, setResultado] = useState(null)
  const [falla, setFalla] = useState(null)
  const [nota, setNota] = useState(null)
  const [cazando, setCazando] = useState(false)

  async function pedir(direccion) {
    const { datos } = await pedirOExplotar(direccion)
    const filas = Array.isArray(datos) ? datos : datos.results ?? []
    return { datos, filas }
  }

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
      const { datos, filas } = await pedir(
        `${API_URL}/contratos/?search=${encodeURIComponent(aguja)}`,
      )
      const coincidencias = datos.count ?? filas.length

      // Segundo cazo: el filtro por estado debe devolver solo ese estado.
      let filtro = null
      let delEstado = 0
      try {
        const { datos: estadisticas } = await pedir(
          `${API_URL}/contratos/estadisticas/`,
        )
        const estados = Object.keys(estadisticas.por_estado || {})
        if (estados.length > 0) {
          filtro = estados[0]
          const { datos: filtrados, filas: copiaFiltrada } = await pedir(
            `${API_URL}/contratos/?estado=${encodeURIComponent(filtro)}`,
          )
          delEstado = filtrados.count ?? copiaFiltrada.length
          const todoDelEstado =
            copiaFiltrada.length > 0 &&
            copiaFiltrada.every(
              (contrato) =>
                String(contrato.estado).toLowerCase() === filtro.toLowerCase(),
            )
          if (!todoDelEstado) {
            setFalla(
              `El filtro ?estado=${filtro} devolvió contratos de otro estado. ` +
                'Revisa get_queryset() en ContratoViewSet.',
            )
            return
          }
        }
      } catch {
        // Sin estadísticas el panel solo prueba la búsqueda.
      }

      // Tercer cazo: el ordenamiento de mayor a menor valor.
      const { filas: ordenadas } = await pedir(
        `${API_URL}/contratos/?ordering=-valor_total`,
      )
      const quedaOrdenado =
        ordenadas.length < 2 ||
        Number(ordenadas[0].valor_total) >= Number(ordenadas[1].valor_total)
      if (!quedaOrdenado) {
        setFalla(
          'El ?ordering=-valor_total no queda de mayor a menor. Revisa OrderingFilter y ordering_fields.',
        )
        return
      }

      setResultado({
        coincidencias,
        filtro,
        delEstado,
        mayor: ordenadas[0]?.valor_total,
        siguiente: ordenadas[1]?.valor_total,
        aguja,
      })
      alAprobar()

      if (coincidencias === 0) {
        setNota(
          `0 coincidencias para "${aguja}" — la aguja no encontró nada. ` +
            'Prueba otra palabra (Ministerio, Alcaldía, puente).',
        )
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
        <span className="celda-suave">search + estado + ordering</span>
      </div>

      {falla && <div className="aviso" data-tipo="error" style={{ marginTop: 12 }}>{falla}</div>}
      {nota && <div className="aviso" style={{ marginTop: 12 }}>{nota}</div>}

      {resultado && (
        <div className="resumen-stats" style={{ marginTop: 12 }}>
          <span className="stat">
            <span className="stat-valor">{resultado.coincidencias}</span>
            <span className="stat-etiqueta">coincidencias de la búsqueda</span>
          </span>
          <span className="stat">
            <span className="stat-valor">{resultado.filtro ?? '—'}</span>
            <span className="stat-etiqueta">
              primer estado ({resultado.delEstado} contratos vía ?estado=)
            </span>
          </span>
          <span className="stat">
            <span className="stat-valor">
              {resultado.mayor ?? '—'} &gt; {resultado.siguiente ?? '—'}
            </span>
            <span className="stat-etiqueta">orden por valor_total</span>
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

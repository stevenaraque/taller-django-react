// TODO (RETO 11) - Crear la vista y ruta de inyección masiva.
import { useState } from 'react'
import MisionMarco from '../MisionMarco'
import { API_URL, peticion } from '../../../shared/api'

const INSTRUCCION =
  'TODO (RETO 11): escribe InyeccionMasivaView en Backend/contratos/views.py ' +
  '(la ficha está comentada ahí) y su ruta contratos/inyeccion/ en urls.py. ' +
  'La vista debe usar bulk_create con batch_size y responder {creados, ms, por_segundo}.'

export default function Mini11Avalancha({ desbloqueada, aprobada, alAprobar }) {
  const [cantidad, setCantidad] = useState(5000)
  const [informe, setInforme] = useState(null)
  const [falla, setFalla] = useState(null)
  const [avalanchando, setAvalanchando] = useState(false)

  async function lanzarAvalancha() {
    if (avalanchando) return
    setAvalanchando(true)
    setFalla(null)
    setInforme(null)

    try {
      const { respuesta, ms } = await peticion(`${API_URL}/contratos/inyeccion/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cantidad }),
      })
      const cuerpo = await respuesta.json().catch(() => ({}))
      setInforme({
        codigo: respuesta.status,
        ms,
        ...cuerpo,
      })

      if (!respuesta.ok) {
        setFalla(
          respuesta.status === 404
            ? 'HTTP 404 · la ruta /api/contratos/inyeccion/ todavía no existe: escribe el RETO 11 en Backend/contratos/views.py y su ruta en urls.py.'
            : `HTTP ${respuesta.status} · la avalancha no cruzó el puerto 8000 con ese código: revisa la terminal de Django.`,
        )
      }
      if (respuesta.ok && cuerpo.creados > 0) alAprobar()
    } catch (error) {
      setFalla(error instanceof Error ? error.message : String(error))
    } finally {
      setAvalanchando(false)
    }
  }

  return (
    <MisionMarco
      alias="Mini 11"
      titulo="La Avalancha"
      desbloqueada={desbloqueada}
      aprobada={aprobada}
    >
      <p className="mision-instruccion">{INSTRUCCION}</p>

      <div className="fila-acciones">
        <label className="celda-suave">
          Registros para la avalancha:
          <input
            type="number"
            min={100}
            max={50000}
            step={500}
            className="campo-numero"
            value={cantidad}
            onChange={(evento) => {
              const valor = Number(evento.target.value) || 100
              setCantidad(Math.min(50000, Math.max(100, valor)))
            }}
          />
        </label>
        <button className="boton" onClick={lanzarAvalancha} disabled={avalanchando}>
          {avalanchando ? 'Avalanchando...' : 'Lanzar la avalancha'}
        </button>
        <span className="celda-suave">
          POST /api/contratos/inyeccion/ · bulk_create divide y vencerá
        </span>
      </div>

      {falla && <div className="aviso" data-tipo="error" style={{ marginTop: 12 }}>{falla}</div>}

      {informe && (
        <div className="resumen-stats" style={{ marginTop: 12 }}>
          <span className="stat">
            <span className="stat-valor">{informe.creados ?? informe.codigo}</span>
            <span className="stat-etiqueta">contratos creados</span>
          </span>
          <span className="stat">
            <span className="stat-valor">{informe.ms ?? '—'}</span>
            <span className="stat-etiqueta">ms del viaje</span>
          </span>
          <span className="stat">
            <span className="stat-valor">{informe.por_segundo ?? '—'}</span>
            <span className="stat-etiqueta">registros por segundo</span>
          </span>
        </div>
      )}
    </MisionMarco>
  )
}

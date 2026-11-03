// ============================================================
// Mini11_Avalancha.jsx — DÍA 3 · Mini 11 "La Avalancha" (Asalto 1)
//
// La misión de ALTO RENDIMIENTO: lanzar la inyección masiva con
// bulk_create contra el backend y medir los ms de la avalancha.
//
// TODO (RETO 11): el estudiante escribe InyeccionMasivaView en
// Backend/contratos/views.py (instrucciones comentadas ahí) y
// la ruta en urls.py. El panel envía {"cantidad": N} y pinta
// la velocidad (registros por segundo).
// ============================================================
import { useState } from 'react'
import MisionMarco from '../MisionMarco'
import { API_URL, peticion, FallaApi } from '../api'

const INSTRUCCION =
  'TODO (RETO 11): escribe InyeccionMasivaView en Backend/contratos/views.py ' +
  '(la ficha está comentada ahí) y su ruta contratos/inyeccion/ en urls.py. ' +
  'La vista debe usar bulk_create con batch_size y responder {creados, ms, por_segundo}.'

export default function Mini11Avalancha({ desbloqueada, aprobada, alAprobar }) {
  const [cantidad, setCantidad] = useState(5000)
  const [informe, setInforme] = useState(null)
  const [falla, setFalla] = useState(null)
  const [avalanchando, setAvalanchando] = useState(false)

  // Lanzar la avalancha y medir: POST /api/contratos/inyeccion/.
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
      const cuerpo = await respuesta.json()
      setInforme({
        codigo: respuesta.status,
        ms,
        ...cuerpo,
      })
      // VICTORIA: la avalancha fabricó registros de verdad.
      if (respuesta.ok && cuerpo.creados > 0) alAprobar()
    } catch (roto) {
      setFalla(fallaElegante(roto))
    } finally {
      setAvalanchando(false)
    }
  }

  return (
    <MisionMarco
      alias="Mini 11"
      titulo="La Avalancha"
      teoria="El concepto del asalto 1: UNA ida al motor por LOTE de mil filas, no una ida por fila. Un save() por registro son 50.000 viajes; bulk_create los colapsa en lotes. Proyecta los registros por segundo del panel: esa es la métrica del día."
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
            onChange={(evento) => setCantidad(Math.min(50000, Math.max(100, Number(evento.target.value) || 100)))}
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

// Traductor elegante: si la ruta no existe (404) o falla otra cosa,
// la misión muestra el mensaje claro sin stack trace.
function fallaElegante(falla) {
  const mensaje = falla instanceof FallaApi ? falla.message : String(falla)
  return mensaje
}

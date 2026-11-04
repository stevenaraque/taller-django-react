import { useState } from 'react'
import MisionMarco from '../MisionMarco'
import { API_URL, peticion } from '../../../shared/api'

const INSTRUCCION =
  'En Backend/contratos/views.py escribe InyeccionMasivaView: valida cantidad ' +
  '(entero de 1 a 50000), pide las páginas con consultar_pagina y convierte las ' +
  'filas con fila_a_contrato (las dos funciones ya existen en fuente_secop.py), ' +
  'guarda los nuevos con bulk_create(batch_size=1000, ignore_conflicts=True), ' +
  'mide el tiempo y responde con creados, recibidos, omitidos, total, ms y ' +
  'por_segundo. Registra la ruta contratos/inyeccion/ en urls.py.'

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
          respuesta.status === 502
            ? 'No se pudo consultar datos.gov.co. Revisa la conexión e inténtalo de nuevo.'
            : `HTTP ${respuesta.status} · revisa la terminal de Django.`,
        )
      }
      if (respuesta.ok && (cuerpo.creados > 0 || cuerpo.total > 0)) alAprobar()
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
          Contratos reales para descargar:
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
          {avalanchando ? 'Descargando...' : 'Descargar contratos'}
        </button>
        <span className="celda-suave">
          datos.gov.co · SECOP II · batch_size 1000
        </span>
      </div>

      {falla && <div className="aviso" data-tipo="error" style={{ marginTop: 12 }}>{falla}</div>}

      {informe && (
        <div className="resumen-stats" style={{ marginTop: 12 }}>
          <span className="stat">
            <span className="stat-valor">{informe.recibidos ?? informe.codigo}</span>
            <span className="stat-etiqueta">filas recibidas de SECOP II</span>
          </span>
          <span className="stat">
            <span className="stat-valor">{informe.creados ?? '—'}</span>
            <span className="stat-etiqueta">contratos nuevos</span>
          </span>
          <span className="stat">
            <span className="stat-valor">{informe.total ?? '—'}</span>
            <span className="stat-etiqueta">contratos en PostgreSQL</span>
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

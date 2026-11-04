import { useState } from 'react'
import MisionMarco from '../MisionMarco'
import { API_URL, pedirOExplotar, peticion } from '../../../shared/api'

const INSTRUCCION =
  'En views.py escribe LimpiezaMasivaView: si el DELETE llega sin ' +
  '{"confirmar": true} responde 400 y NO borra nada; con la confirmación borra ' +
  'toda la tabla con delete() y responde con eliminados y ms. Registra la ruta ' +
  'contratos/limpieza/ en urls.py. Solo con datos de prueba.'

export default function Mini15Limpiador({ desbloqueada, aprobada, alAprobar }) {
  const [informe, setInforme] = useState(null)
  const [falla, setFalla] = useState(null)
  const [limpiando, setLimpiando] = useState(false)
  const [confirmacion, setConfirmacion] = useState(false)

  async function limpiar() {
    if (limpiando) return
    setLimpiando(true)
    setFalla(null)
    setInforme(null)

    try {
      const { datos: antes } = await pedirOExplotar(`${API_URL}/estado/`)

      // Prueba de seguridad: sin confirmación la ruta no debe borrar nada.
      const { respuesta: ataqueFalso } = await peticion(
        `${API_URL}/contratos/limpieza/`,
        { method: 'DELETE' },
      )
      await ataqueFalso.json().catch(() => ({}))
      const protege = ataqueFalso.status === 400
      if (!protege) {
        setFalla(
          'La ruta borró sin pedir confirmación. Exige {"confirmar": true} en el cuerpo y responde 400 sin él.',
        )
        return
      }

      const { respuesta, ms } = await peticion(`${API_URL}/contratos/limpieza/`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirmar: true }),
      })
      const cuerpo = await respuesta.json().catch(() => ({}))

      const { datos: despues } = await pedirOExplotar(`${API_URL}/estado/`)

      setInforme({
        codigo: respuesta.status,
        ms,
        antes: antes.contratos_registrados,
        despues: despues.contratos_registrados,
        eliminados: cuerpo.eliminados,
      })

      if (respuesta.ok) alAprobar()
    } catch (laRedRota) {
      setFalla(laRedRota.message)
    } finally {
      setLimpiando(false)
      setConfirmacion(false)
    }
  }

  return (
    <MisionMarco
      alias="Mini 15"
      titulo="El Limpiador"
      desbloqueada={desbloqueada}
      aprobada={aprobada}
    >
      <p className="mision-instruccion">{INSTRUCCION}</p>

      <div className="fila-acciones">
        {!confirmacion ? (
          <button className="boton" onClick={() => setConfirmacion(true)} disabled={limpiando}>
            Vaciar la bóveda (preguntar antes de borrar)
          </button>
        ) : (
          <>
            <span className="aviso" data-tipo="error">
              Confirma: vas a borrar TODOS los contratos.
            </span>
            <button className="boton" onClick={limpiar} disabled={limpiando}>
              {limpiando ? 'Borrando...' : 'Sí, limpiar la base'}
            </button>
            <button className="boton boton-mini" onClick={() => setConfirmacion(false)}>
              Cerrar
            </button>
          </>
        )}
      </div>

      {falla && <div className="aviso" data-tipo="error" style={{ marginTop: 12 }}>{falla}</div>}

      {informe && (
        <div className="resumen-stats" style={{ marginTop: 12 }}>
          <span className="stat">
            <span className="stat-valor">400</span>
            <span className="stat-etiqueta">
              el DELETE sin confirmar quedó bloqueado
            </span>
          </span>
          <span className="stat">
            <span className="stat-valor">{informe.eliminados ?? informe.antes}</span>
            <span className="stat-etiqueta">eliminados con confirmación</span>
          </span>
          <span className="stat">
            <span className="stat-valor">{informe.despues}</span>
            <span className="stat-etiqueta">quedan en la bóveda</span>
          </span>
          <span className="stat">
            <span className="stat-valor">{informe.ms}</span>
            <span className="stat-etiqueta">ms de la sentencia única</span>
          </span>
        </div>
      )}

      {informe?.codigo === 200 && (informe.eliminados ?? 0) === 0 && (
        <div className="aviso" style={{ marginTop: 12 }}>
          La bóveda ya estaba vacía: no había contratos por borrar.
        </div>
      )}
    </MisionMarco>
  )
}

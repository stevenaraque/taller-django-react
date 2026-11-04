// TODO (RETO 15) - Crear la vista y ruta de borrado masivo.
import { useState } from 'react'
import MisionMarco from '../MisionMarco'
import { API_URL, pedirOExplotar, peticion } from '../../../shared/api'

const INSTRUCCION =
  'TODO (RETO 15): escribe LimpiezaMasivaView en Backend/contratos/views.py ' +
  '(Contrato.objects.all().delete() en UNA llamada, ficha comentada ahí) ' +
  'y la ruta contratos/limpieza/ en urls.py.'

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

      const { respuesta, ms } = await peticion(`${API_URL}/contratos/limpieza/`, { method: 'DELETE' })
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
              Confirma: vas a borrar TODOS los contratos de prueba.
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
            <span className="stat-valor">{informe.eliminados ?? informe.antes}</span>
            <span className="stat-etiqueta">eliminados</span>
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
    </MisionMarco>
  )
}

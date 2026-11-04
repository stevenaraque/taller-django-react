import { useState } from 'react'
import MisionMarco from '../MisionMarco'
import { API_URL, pedirOExplotar } from '../../../shared/api'

const INSTRUCCION =
  'Abre Backend/contratos/models.py y revisa el modelo ' +
  'Contrato siguiendo la especificación SECOP II comentada ahí. Luego: ' +
  'python manage.py makemigrations contratos y python manage.py migrate.'

export default function Mini2Arquitecto({ desbloqueada, aprobada, alAprobar }) {
  const [bateria, setBateria] = useState(null)
  const [falla, setFalla] = useState(null)
  const [sonando, setSonando] = useState(false)

  async function sonar() {
    setSonando(true)
    setFalla(null)
    try {
      const { datos } = await pedirOExplotar(`${API_URL}/estado/`)
      setBateria(datos)
      if (datos.tabla_contratos) alAprobar()
    } catch (laRedRota) {
      setFalla(laRedRota.message)
    } finally {
      setSonando(false)
    }
  }

  return (
    <MisionMarco
      alias="Mini 2"
      titulo="El Arquitecto"
      desbloqueada={desbloqueada}
      aprobada={aprobada}
    >
      <p className="mision-instruccion">{INSTRUCCION}</p>

      <div className="fila-acciones">
        <button className="boton" onClick={sonar} disabled={sonando}>
          {sonando ? 'Midiendo...' : 'Verificar la tabla'}
        </button>
        <span className="celda-suave">
          la batería busca la tabla `contratos_contrato` en PostgreSQL
        </span>
      </div>

      {falla && <div className="aviso" data-tipo="error">{falla}</div>}

      {bateria && (
        <div className="resumen-stats" style={{ marginTop: 12 }}>
          <span className="stat">
            <span className="stat-valor">
              {bateria.tabla_contratos ? 'SI' : 'NO'}
            </span>
            <span className="stat-etiqueta">tabla en la bóveda</span>
          </span>
        </div>
      )}
    </MisionMarco>
  )
}

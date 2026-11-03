// ============================================================
// Mini2_Arquitecto.jsx — DÍA 1 · Mini 2 "El Arquitecto"
//
// La misión del MODELO: el estudiante construye el modelo
// Contrato (dataset SECOP II) en Backend/contratos/models.py
// y lo migra a PostgreSQL.
//
// TODO (RETO 2): escribir el modelo siguiendo la especificación
// de la parte comentada del models.py, luego:
//     python manage.py makemigrations contratos
//     python manage.py migrate
// La misión se aprueba sola cuando la tabla `contratos_contrato`
// existe en la bóveda (la batería la busca por nombre).
// ============================================================
import { useState } from 'react'
import MisionMarco from '../MisionMarco'
import { API_URL, pedirOExplotar } from '../api'

const INSTRUCCION =
  'TODO (RETO 2): abre Backend/contratos/models.py y crea el modelo ' +
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
      teoria="Proyecta una fila REAL del SECOP II y explica cada tipo de campo (CharField, TextField, DecimalField, DateField) como 'qué guardo aquí y cuánta memoria gasta'. La migración es la orden que construye el almacén."
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

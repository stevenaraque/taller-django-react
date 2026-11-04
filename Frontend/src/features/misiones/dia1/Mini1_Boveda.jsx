// TODO (RETO 1) - Configurar .env y ejecutar las migraciones.
import { useState } from 'react'
import MisionMarco from '../MisionMarco'
import { API_URL, pedirOExplotar } from '../../../shared/api'

const INSTRUCCION =
  'TODO (RETO 1): en Backend/, copia .env.example a .env y llena tus datos ' +
  'reales (DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT). Después: ' +
  'python manage.py migrate y python manage.py runserver. Sin .env, el ' +
  'arranque se detiene con las instrucciones en la terminal.'

async function sondearBateria() {
  const { datos } = await pedirOExplotar(`${API_URL}/estado/`)
  return datos
}

export default function Mini1Boveda({ desbloqueada, aprobada, alAprobar }) {
  const [bateria, setBateria] = useState(null)
  const [falla, setFalla] = useState(null)
  const [sonando, setSonando] = useState(false)

  async function sonar() {
    setSonando(true)
    setFalla(null)
    try {
      const datos = await sondearBateria()
      setBateria(datos)
      if (datos.base_datos && datos.motor_bueno) alAprobar()
    } catch (laRedRota) {
      setFalla(laRedRota.message)
    } finally {
      setSonando(false)
    }
  }

  return (
    <MisionMarco
      alias="Mini 1"
      titulo="La Bóveda"
      desbloqueada={desbloqueada}
      aprobada={aprobada}
    >
      <p className="mision-instruccion">{INSTRUCCION}</p>

      <div className="fila-acciones">
        <button className="boton" onClick={sonar} disabled={sonando}>
          {sonando ? 'Sondeando la bóveda...' : 'Sondear la bóveda'}
        </button>
        <span className="celda-suave">
          consulta la batería /api/estado/ en el :8000
        </span>
      </div>

      {falla && <div className="aviso" data-tipo="error">{falla}</div>}

      {bateria && (
        <table className="tabla" style={{ marginTop: 12 }}>
          <thead>
            <tr>
              <th>Bandera</th>
              <th>Estado</th>
              <th>Lectura</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>base_datos</td>
              <td data-ok={bateria.base_datos}>
                {bateria.base_datos ? 'vivo' : 'muerto'}
              </td>
              <td className="celda-suave">
                {bateria.base_datos
                  ? 'el motor de la bóveda está vivo'
                  : 'el motor no responde: revisa .env y el servicio Windows de PostgreSQL (postgresql-x64-18 en una instalación estándar; el nombre exacto lo ves en services.msc)'}
              </td>
            </tr>
            <tr>
              <td>motor_bueno</td>
              <td data-ok={bateria.motor_bueno}>
                {bateria.motor_bueno ? 'vivo' : 'muerto'}
              </td>
              <td className="celda-suave">
                {bateria.motor_bueno
                  ? 'PostgreSQL confirmado (SQLite prohibido en el taller)'
                  : 'el motor no es PostgreSQL'}
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </MisionMarco>
  )
}

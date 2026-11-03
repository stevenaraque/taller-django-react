// ============================================================
// Mini3_JefeMaestro.jsx — DÍA 1 · Mini 3 "El Jefe Maestro"
//
// El estudiante registra el modelo en el Admin y crea el
// PRIMER contrato a mano desde la interfaz visual (sin una
// línea de API).
//
// TODO (RETO 3): en Backend/contratos/admin.py registra el
// modelo Contrato (la instrucción exacta está comentada ahí),
// crea un superusuario, entra a /admin/ y crea 1 contrato.
//
// La misión se aprueba sola cuando la batería ve el modelo en
// el Admin y al menos un contrato guardado en la bóveda.
// ============================================================
import { useState } from 'react'
import MisionMarco from '../MisionMarco'
import { API_URL, pedirOExplotar } from '../api'

const INSTRUCCION =
  'TODO (RETO 3): registra el modelo en Backend/contratos/admin.py (las ' +
  'dos líneas están comentadas ahí arriba). Luego: python manage.py ' +
  'createsuperuser, entra a http://127.0.0.1:8000/admin/ y crea UN (1) ' +
  'contrato manualmente desde la interfaz visual.'

export default function Mini3JefeMaestro({ desbloqueada, aprobada, alAprobar }) {
  const [bateria, setBateria] = useState(null)
  const [falla, setFalla] = useState(null)
  const [sonando, setSonando] = useState(false)

  async function sonar() {
    setSonando(true)
    setFalla(null)
    try {
      const { datos } = await pedirOExplotar(`${API_URL}/estado/`)
      setBateria(datos)
      // El Jefe Maestro gana con las TRES banderas encendidas.
      if (
        datos.tabla_contratos &&
        datos.modelo_en_admin &&
        datos.contratos_registrados >= 1
      ) {
        alAprobar()
      }
    } catch (laRedRota) {
      setFalla(laRedRota.message)
    } finally {
      setSonando(false)
    }
  }

  return (
    <MisionMarco
      alias="Mini 3"
      titulo="El Jefe Maestro"
      teoria="El Admin es la suite de gestión que Django fabrica sola. Registra el modelo EN VIVO (una línea) y muestra la tabla en el panel visual. El estudiante crea su primer contrato SIN escribir API: ese dato manual es el semillero de la avalancha del RETO 11."
      desbloqueada={desbloqueada}
      aprobada={aprobada}
    >
      <p className="mision-instruccion">{INSTRUCCION}</p>

      <div className="fila-acciones">
        <button className="boton" onClick={sonar} disabled={sonando}>
          {sonando ? 'Sondeando...' : 'Sonar el panel'}
        </button>
        <span className="celda-suave">
          la batería revisa modelo_en_admin y contratos_registrados
        </span>
      </div>

      {falla && <div className="aviso" data-tipo="error">{falla}</div>}

      {bateria && (
        <table className="tabla" style={{ marginTop: 12 }}>
          <thead>
            <tr>
              <th>Bandera</th>
              <th>Estado</th>
              <th>Pista si está en rojo</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>modelo_en_admin</td>
              <td data-ok={bateria.modelo_en_admin}>
                {bateria.modelo_en_admin ? 'reconocido' : 'ausente'}
              </td>
              <td className="celda-suave">
                {bateria.modelo_en_admin
                  ? 'el modelo ya es visible en /admin/'
                  : 'falta admin.site.register(Contrato) en admin.py'}
              </td>
            </tr>
            <tr>
              <td>contratos_registrados</td>
              <td data-ok={bateria.contratos_registrados >= 1}>
                {bateria.contratos_registrados}
              </td>
              <td className="celda-suave">
                {bateria.contratos_registrados >= 1
                  ? 'ya hay al menos un contrato guardado'
                  : 'crea el primer contrato en /admin/'}
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </MisionMarco>
  )
}

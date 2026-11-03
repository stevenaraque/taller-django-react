// ============================================================
// Mini10_Render.jsx — DÍA 2 · Mini 10 "El Render"
//
// La conexión completa: el estudiante trae el JSON con fetch y
// lo pinta con map() en SU propio componente.
//
// TODO (RETO 10): escribir el componente que pinta el listado
// con useState + useEffect + map() (pizarra abajo). Reto de
// escritura: se aprueba por visto del instructor. El panel
// entrega el JSON crudo para comparar.
// ============================================================
import { useState } from 'react'
import MisionMarco from '../MisionMarco'
import { API_URL, pedirOExplotar } from '../api'

const INSTRUCCION =
  'TODO (RETO 10): escribe un componente con useState + useEffect: guarda ' +
  'el listado con setContratos tras el fetch y píntalo con ' +
  'contratos.map((contrato) => <li key={contrato.id_contrato}>...).'

export default function Mini10Render({ desbloqueada, aprobada, alAprobar }) {
  const [jsonCrudo, setJsonCrudo] = useState('')
  const [falla, setFalla] = useState(null)
  const [trayendo, setTrayendo] = useState(false)

  // El JSON crudo es la fotografía que el estudiante deberá mapear.
  async function traerJson() {
    setTrayendo(true)
    setFalla(null)
    try {
      const { datos } = await pedirOExplotar(`${API_URL}/contratos/`)
      const listado = Array.isArray(datos) ? datos : datos.results || []
      setJsonCrudo(JSON.stringify(listado, null, 2))
    } catch (laRedRota) {
      setFalla(laRedRota.message)
    } finally {
      setTrayendo(false)
    }
  }

  return (
    <MisionMarco
      alias="Mini 10"
      titulo="El Render"
      teoria="El flujo completo del día: useState guarda el listado, useEffect hace el fetch y el render pinta con map. Recalca la key: cada contrato pide id_contrato. Compara tu render con el JSON crudo de este panel."
      desbloqueada={desbloqueada}
      aprobada={aprobada}
      manual
      alAprobar={alAprobar}
    >
      <p className="mision-instruccion">{INSTRUCCION}</p>

      <div className="fila-acciones">
        <button className="boton" onClick={traerJson} disabled={trayendo}>
          {trayendo ? 'Fetch...' : 'Traer el JSON crudo'}
        </button>
        <span className="celda-suave">
          el material que tu render debe pintar (GET /api/contratos/)
        </span>
      </div>

      {falla && <div className="aviso" data-tipo="error" style={{ marginTop: 12 }}>{falla}</div>}

      {jsonCrudo && (
        <pre className="mision-pizarra" style={{ marginTop: 12, maxHeight: 240, overflow: 'auto' }}>
          {jsonCrudo}
        </pre>
      )}

      <pre className="mision-pizarra" style={{ marginTop: 12 }}>
        {`// Listado.jsx — TODO (RETO 10)
import { useState, useEffect } from 'react'

export default function Listado() {
  const [contratos, setContratos] = useState([])

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/contratos/')
      .then((respuesta) => respuesta.json())
      .then((datos) => setContratos(datos))
  }, [])

  return (
    <ul>
      {contratos.map((contrato) => (
        <li key={contrato.id_contrato}>
          {contrato.entidad_compradora} · ${'{'}contrato.valor_total{'}'}
        </li>
      ))}
    </ul>
  )
}`}
      </pre>
    </MisionMarco>
  )
}

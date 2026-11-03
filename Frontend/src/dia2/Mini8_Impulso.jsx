// ============================================================
// Mini8_Impulso.jsx — DÍA 2 · Mini 8 "El Impulso"
//
// El PRIMER fetch desde React: la petición se lanza y el
// navegador HA DE BLOQUEARLA — el backend todavía no abrió la
// puerta CORS. Ver el rojo con razón ES la victoria.
//
// TODO (RETO 8): el estudiante escribe su primer fetch en un
// componente propio (la pizarra muestra la base); la misión
// se aprueba automáticamente cuando el panel detecta el bloqueo.
// ============================================================
import { useState } from 'react'
import MisionMarco from '../MisionMarco'
import { API_URL, peticion } from '../api'

const INSTRUCCION =
  'TODO (RETO 8): escribe tu primer fetch en un componente propio (mira ' +
  'la pizarra). Abre F12 -> Console: el navegador bloqueó la respuesta ' +
  'de otro origen. LEE el error completo: eso es lo que vas a ganar en ' +
  'el Mini 9.'

export default function Mini8Impulso({ desbloqueada, aprobada, alAprobar }) {
  const [resultado, setResultado] = useState(null)
  const [lanzando, setLanzando] = useState(false)

  // El impulso: lanzar el fetch y chocar de frente con CORS.
  async function impulso() {
    setLanzando(true)
    setResultado(null)

    try {
      const { respuesta } = await peticion(`${API_URL}/contratos/`)
      setResultado({
        bloqueado: false,
        codigo: respuesta.status,
        detalle: 'llegó una respuesta del :8000 — la puerta ya estaba abierta',
      })
    } catch (roto) {
      // fetch solo lanza cuando la petición no cruzó el puerto:
      // ese es el bloqueo EXACTO que esta misión quiere ver (CORS).
      setResultado({
        bloqueado: true,
        codigo: 'sin respuesta',
        detalle: roto.message,
      })
      if (roto.tipo === 'cors') alAprobar()
    } finally {
      setLanzando(false)
    }
  }

  return (
    <MisionMarco
      alias="Mini 8"
      titulo="El Impulso"
      teoria="Dos orígenes distintos (React en 5173 y Django en 8000) activan la política de mismo origen del navegador: por eso existe CORS. Proyecta F12 → Console y LEE el error completo con la clase: saber nombrar el problema ES la habilidad del día."
      desbloqueada={desbloqueada}
      aprobada={aprobada}
    >
      <p className="mision-instruccion">{INSTRUCCION}</p>

      <div className="fila-acciones">
        <button className="boton" onClick={impulso} disabled={lanzando}>
          {lanzando ? 'Impulsando...' : 'Impulsar el primer fetch'}
        </button>
        <span className="celda-suave">
          GET /api/contratos/ desde el :5173 (se espera el BLOQUEO de CORS)
        </span>
      </div>

      {resultado && (
        <div
          className="aviso"
          data-tipo={resultado.bloqueado ? 'ok' : 'error'}
          style={{ marginTop: 12 }}
        >
          {resultado.bloqueado
            ? `BLOQUEADO — victoria del impulso: ${resultado.detalle}`
            : `Sorprendente, ya cruzó: HTTP ${resultado.codigo} — ${resultado.detalle}`}
        </div>
      )}

      <pre className="mision-pizarra" style={{ marginTop: 12 }}>
        {`// MiImpulso.jsx — TODO (RETO 8)
export default function MiImpulso() {
  async function impulso() {
    const respuesta = await fetch(
      'http://127.0.0.1:8000/api/contratos/'
    )
    // el navegador la BLOQUEA: la consola de F12 lo cuenta
  }
}`}
      </pre>
    </MisionMarco>
  )
}

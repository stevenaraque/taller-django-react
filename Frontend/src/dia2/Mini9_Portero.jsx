// ============================================================
// Mini9_Portero.jsx — DÍA 2 · Mini 9 "El Portero"
//
// Abre la puerta CORS: el estudiante activa corsheaders en
// settings.py (RETO 9) y la consola de F12 queda LIMPIA.
//
// TODO (RETO 9): tres pasos en Backend/config/settings.py
// (INSTALLED_APPS, middleware y CORS_ALLOWED_ORIGINS) — las
// instrucciones exactas están comentadas ahí.
//
// El panel corre el diagnóstico: OPTIONS (la conversación
// previa) y GET (el permiso ya pagado). Aprueba cuando el GET
// responde 200 de verdad, cruzando del 5173 al 8000.
// ============================================================
import { useState } from 'react'
import MisionMarco from '../MisionMarco'
import { API_URL, peticion } from '../api'

const INSTRUCCION =
  'TODO (RETO 9): en Backend/config/settings.py activa corsheaders ' +
  '(INSTALLED_APPS + middleware + CORS_ALLOWED_ORIGINS) — el bloque ' +
  'comentado ahí marca las tres líneas exactas. Reinicia el runserver ' +
  'después de cada cambio en settings.py.'

export default function Mini9Portero({ desbloqueada, aprobada, alAprobar }) {
  const [resultados, setResultados] = useState([])
  const [corriendo, setCorriendo] = useState(false)

  // Diagnóstico en dos tiempos: preflight y permiso real.
  async function correrDiagnostico() {
    if (corriendo) return
    setCorriendo(true)
    setResultados([])

    // 1. OPTIONS: la conversación previa (preflight) del navegador.
    try {
      const preflight = await peticion(`${API_URL}/contratos/`, { method: 'OPTIONS' })
      setResultados((lista) => lista.concat({
        prueba: 'Preflight OPTIONS',
        ms: preflight.ms,
        ok: preflight.respuesta.ok,
        detalle: `HTTP ${preflight.respuesta.status} — la conversación previa respondió`,
      }))
    } catch (roto) {
      setResultados((lista) => lista.concat({
        prueba: 'Preflight OPTIONS',
        ms: null,
        ok: false,
        detalle: roto.message,
      }))
    }

    // 2. GET: el uso real de la puerta por el estudiante.
    try {
      const permiso = await peticion(`${API_URL}/contratos/`)
      setResultados((lista) => lista.concat({
        prueba: 'GET desde React',
        ms: permiso.ms,
        ok: permiso.respuesta.ok,
        detalle: `HTTP ${permiso.respuesta.status} — el permiso está pagado y la puerta abierta`,
      }))
      if (permiso.respuesta.ok) alAprobar()
    } catch (roto) {
      setResultados((lista) => lista.concat({
        prueba: 'GET desde React',
        ms: null,
        ok: false,
        detalle: roto.message,
      }))
    }

    setCorriendo(false)
  }

  return (
    <MisionMarco
      alias="Mini 9"
      titulo="El Portero"
      teoria="El preflight OPTIONS es la conversación previa que el navegador tiene con Django ANTES de mandar el dato verdadero. Explica que NO se ve en el tablero del fetch: se ve en F12 → Network. El permiso concedido es el Access-Control-Allow-Origin."
      desbloqueada={desbloqueada}
      aprobada={aprobada}
    >
      <p className="mision-instruccion">{INSTRUCCION}</p>

      <div className="fila-acciones">
        <button className="boton" onClick={correrDiagnostico} disabled={corriendo}>
          {corriendo ? 'Diagnosticando...' : 'Correr diagnóstico del portero'}
        </button>
        <span className="celda-suave">
          OPTIONS primero, GET después: F12 → Network muestra los dos
        </span>
      </div>

      {resultados.length > 0 && (
        <table className="tabla" style={{ marginTop: 12 }}>
          <thead>
            <tr>
              <th>Prueba</th>
              <th className="numero">ms</th>
              <th className="numero">Estado</th>
              <th>Detalle</th>
            </tr>
          </thead>
          <tbody>
            {resultados.map((fila, orden) => (
              <tr key={orden}>
                <td>{fila.prueba}</td>
                <td className="numero">{fila.ms ?? '—'}</td>
                <td className="asalto-estado" data-ok={fila.ok}>
                  {fila.ok ? 'permitido' : 'bloqueado'}
                </td>
                <td className="celda-suave">{fila.detalle}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="bloque" style={{ marginTop: 14 }}>
        <h4 className="bloque-titulo">Checklist para abrir la puerta</h4>
        <ul className="checklist">
          <li><code>corsheaders</code> en INSTALLED_APPS.</li>
          <li><code>corsheaders.middleware.CorsMiddleware</code> en MIDDLEWARE.</li>
          <li><code>CORS_ALLOWED_ORIGINS</code> con <code>http://localhost:5173</code>.</li>
          <li>Cada cambio en settings.py pide reiniciar el runserver.</li>
          <li>F12 → Network: la columna <b>Origin</b> es tu huella.</li>
        </ul>
      </div>
    </MisionMarco>
  )
}

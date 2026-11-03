import { useState } from 'react'
import { API_URL } from './api'

// Jefe del dia 2. Con el CORS apagado el navegador bloquea las respuestas
// del otro origen y la consola del F12 se pinta de rojo; el primero en
// dejarla limpia gana. El modulo corre un diagnostico con tres pruebas
// para ver donde esta cerrada la puerta:
//   1. GET simple          la puerta minima de CORS
//   2. OPTIONS             la conversacion previa (preflight)
//   3. POST con JSON       exige permiso completo, y limpia lo que crea
const PRUEBAS = [
  { id: 'get', nombre: 'GET simple', pista: 'Si falla, falta CORS_ALLOWED_ORIGINS.' },
  { id: 'options', nombre: 'Preflight OPTIONS', pista: 'Si falla, el middleware de CORS no esta activo.' },
  { id: 'post', nombre: 'POST con JSON', pista: 'Si falla, el permiso no cubre Content-Type application/json.' },
]

function Portero() {
  const [resultados, setResultados] = useState({})
  const [corriendo, setCorriendo] = useState(false)

  const todasVerificadas =
    PRUEBAS.every((prueba) => resultados[prueba.id]?.estado === 'permitido')

  async function correrDiagnostico() {
    if (corriendo) return
    setCorriendo(true)
    setResultados({})

    for (const prueba of PRUEBAS) {
      const inicio = performance.now()
      try {
        const respuesta = await fetch(
          API_URL,
          prueba.id === 'options'
            ? { method: 'OPTIONS' }
            : prueba.id === 'post'
              ? {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ titulo: 'Prueba del portero' }),
                }
              : {}
        )
        const ms = Math.round(performance.now() - inicio)

        if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`)

        let detalle = `HTTP ${respuesta.status}`
        if (prueba.id === 'get') {
          // El navegador consume el permiso (Access-Control-Allow-Origin) y
          // no lo deja leer en JS: si la respuesta llego, fue autorizada.
          detalle += ' · el navegador verifico el permiso y dejo pasar la respuesta'
        }
        if (prueba.id === 'post') {
          const datos = await respuesta.clone().json()
          detalle = `HTTP ${respuesta.status} · creó la tarea id ${datos.id}`
          // limpia la tarea de prueba
          try {
            await fetch(`${API_URL}${datos.id}/`, { method: 'DELETE' })
            detalle += ' · ya eliminada'
          } catch {
            detalle += ' · no se pudo eliminar'
          }
        }

        setResultados((r) => ({
          ...r,
          [prueba.id]: { estado: 'permitido', ms, detalle },
        }))
      } catch (falla) {
        setResultados((r) => ({
          ...r,
          [prueba.id]: {
            estado: 'bloqueado',
            ms: Math.round(performance.now() - inicio),
            detalle: `${falla.message}` || 'la respuesta llego bloqueada',
          },
        }))
      }
    }

    setCorriendo(false)
  }

  return (
    <section>
      <div className="bloque">
        <h4 className="bloque-titulo">Origenes en esta arena</h4>
        <p className="origen-linea">
          Origen de la arena (React): <b>{window.location.origin}</b>
          <br />
          Origen de la API (Django): <b>http://127.0.0.1:8000</b>
          <br />
          Dos puertos distintos son dos origenes distintos: por eso existe CORS.
        </p>
      </div>

      <div className="bloque">
        <h4 className="bloque-titulo">Diagnostico del portero</h4>
        <div className="fila-acciones">
          <button className="boton" onClick={correrDiagnostico} disabled={corriendo}>
            {corriendo ? 'Verificando...' : 'Correr diagnostico'}
          </button>
          {todasVerificadas && (
            <div className="aviso" data-tipo="ok">
              Las tres pruebas pasaron: la consola esta limpia y el equipo gano
              la arena.
            </div>
          )}
        </div>

        <table className="tabla" style={{ marginTop: 12 }}>
          <thead>
            <tr>
              <th>Prueba</th>
              <th>Resultado</th>
              <th className="numero">ms</th>
              <th>Detalle</th>
            </tr>
          </thead>
          <tbody>
            {PRUEBAS.map((prueba) => {
              const r = resultados[prueba.id]
              return (
                <tr key={prueba.id}>
                  <td>
                    {prueba.nombre}
                    <div className="celda-suave">{prueba.pista}</div>
                  </td>
                  <td className="asalto-estado" data-ok={r?.estado === 'permitido'}>
                    {r ? (r.estado === 'permitido' ? 'permitido' : 'bloqueado') : 'pendiente'}
                  </td>
                  <td className="numero">{r ? r.ms : '-'}</td>
                  <td className="celda-suave">{r ? r.detalle : '-'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="bloque">
        <h4 className="bloque-titulo">Checklist para abrir la puerta</h4>
        <ul className="checklist">
          <li>
            <code>corsheaders</code> en INSTALLED_APPS y su middleware
            <code>corsheaders.middleware.CorsMiddleware</code> en settings.py.
          </li>
          <li>
            <code>CORS_ALLOWED_ORIGINS</code> incluyendo{' '}
            <code>http://localhost:5173</code> (el origen exacto de esta arena).
          </li>
          <li>
            Para ver el permiso <b>de verdad</b> (fuera del navegador):
            <code>curl -i -H "Origin: http://localhost:5173" http://127.0.0.1:8000/api/tareas/</code>
            y buscar <code>access-control-allow-origin</code> en la respuesta.
          </li>
          <li>Cada cambio en settings.py pide reiniciar runserver.</li>
          <li>F12 → Console muestra el error completo; no lo adivine, lea todo.</li>
        </ul>
      </div>
    </section>
  )
}

export default Portero

// ============================================================
// Mini5_Velocista.jsx — DÍA 1 · Mini 5 "El Velocista"
//
// La arena backend de entrada: el estudiante enciende el
// ModelViewSet y el Router para que /api/contratos/ responda
// TODOS los verbos HTTP.
//
// TODO (RETO 5): escribir "ContratoViewSet" en views.py y
// conectar el router en urls.py (ambas instrucciones están
// comentadas en cada archivo de la app).
//
// Esta misión cronometra el GET contra la COLECCIÓN (200) y
// contra un contrato INEXISTENTE (404), y muestra la ficha de
// la respuesta (código, ms, bytes). Aprueba con el 200.
// ============================================================
import { useState } from 'react'
import MisionMarco from '../MisionMarco'
import Cronometro from '../Cronometro'
import { API_URL, pedirOExplotar, peticion } from '../api'

const INSTRUCCION =
  'TODO (RETO 5): enciende el ModelViewSet en Backend/contratos/views.py ' +
  'y conecta el router en el mismo archivo urls.py de la app. Después ' +
  'reinicia el runserver y lanza la prueba de esta misión.'

export default function Mini5Velocista({ desbloqueada, aprobada, alAprobar }) {
  const [medicionColeccion, setMedicionColeccion] = useState(null)
  const [medicionFantasma, setMedicionFantasma] = useState(null)
  const [falla, setFalla] = useState(null)
  const [cronometro, setCronometro] = useState(null)
  const [corriendo, setCorriendo] = useState(false)

  // Medir DOS rutas seguidas: la colección real y una que no existe.
  async function correrPrueba() {
    if (corriendo) return
    setCorriendo(true)
    setFalla(null)
    setCronometro(null)

    try {
      // 1. La colección: GET /api/contratos/ (se espera 200).
      const coleccion = await pedirOExplotar(`${API_URL}/contratos/`)
      setMedicionColeccion({ verbo: 'GET', ruta: '/api/contratos/', ...coleccion })
      setCronometro(coleccion.ms)
      setMedicionFantasma(null)

      // 2. El fantasma: GET /api/contratos/999999/ (se espera 404).
      // Aqui NO usamos pedirOExplotar: el 404 ES el experimento.
      const fantasma = await peticion(`${API_URL}/contratos/999999/`)
      setMedicionFantasma({
        verbo: 'GET',
        ruta: '/api/contratos/999999/',
        codigo: fantasma.respuesta.status,
        ms: fantasma.ms,
      })

      // VICTORIA: la colección respondió bien desde el navegador.
      if (coleccion.respuesta.ok) alAprobar()
    } catch (laRedRota) {
      setFalla(laRedRota.message)
    } finally {
      setCorriendo(false)
    }
  }

  return (
    <MisionMarco
      alias="Mini 5"
      titulo="El Velocista"
      teoria="El ModelViewSet es el estadio: 3 líneas de clase construyen TODOS los verbos. Antes de que escriban, corre esta misión SIN rutas y muestra cómo el panel reporta el fallo elegante: así se aprende a leer un error HTTP."
      desbloqueada={desbloqueada}
      aprobada={aprobada}
    >
      <p className="mision-instruccion">{INSTRUCCION}</p>

      <Cronometro
        ms={cronometro}
        corriendo={corriendo}
        interrumpida={Boolean(falla)}
        etiqueta="GET /api/contratos/"
      />

      <div className="fila-acciones" style={{ marginTop: 12 }}>
        <button className="boton" onClick={correrPrueba} disabled={corriendo}>
          {corriendo ? 'Corriendo la arena...' : 'Correr la arena del Velocista'}
        </button>
        <span className="celda-suave">
          compara el 200 de la colección con el 404 del recurso fantasma
        </span>
      </div>

      {falla && <div className="aviso" data-tipo="error">{falla}</div>}

      {(medicionColeccion || medicionFantasma) && (
        <table className="tabla" style={{ marginTop: 12 }}>
          <thead>
            <tr>
              <th>Ruta</th>
              <th className="numero">Código</th>
              <th className="numero">ms</th>
            </tr>
          </thead>
          <tbody>
            {medicionColeccion && (
              <tr>
                <td>{medicionColeccion.ruta}</td>
                <td className="numero">{medicionColeccion.respuesta.status}</td>
                <td className="numero">{medicionColeccion.ms}</td>
              </tr>
            )}
            {medicionFantasma && (
              <tr>
                <td>{medicionFantasma.ruta}</td>
                <td className="numero">{medicionFantasma.codigo}</td>
                <td className="numero">{medicionFantasma.ms ?? '—'}</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </MisionMarco>
  )
}

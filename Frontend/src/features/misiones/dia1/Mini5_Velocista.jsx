import { useState } from 'react'
import MisionMarco from '../MisionMarco'
import Cronometro from '../../../shared/Cronometro'
import { API_URL, pedirOExplotar, peticion } from '../../../shared/api'

const INSTRUCCION =
  'El ModelViewSet y el router están en Backend/contratos/. Reinicia ' +
  'runserver y lanza la prueba de esta misión.'

export default function Mini5Velocista({ desbloqueada, aprobada, alAprobar }) {
  const [medicionColeccion, setMedicionColeccion] = useState(null)
  const [medicionFantasma, setMedicionFantasma] = useState(null)
  const [falla, setFalla] = useState(null)
  const [cronometro, setCronometro] = useState(null)
  const [corriendo, setCorriendo] = useState(false)

  async function correrPrueba() {
    if (corriendo) return
    setCorriendo(true)
    setFalla(null)
    setCronometro(null)

    try {
      const coleccion = await pedirOExplotar(`${API_URL}/contratos/`)
      setMedicionColeccion({ verbo: 'GET', ruta: '/api/contratos/', ...coleccion })
      setCronometro(coleccion.ms)
      setMedicionFantasma(null)

      const fantasma = await peticion(`${API_URL}/contratos/999999/`)
      setMedicionFantasma({
        verbo: 'GET',
        ruta: '/api/contratos/999999/',
        codigo: fantasma.respuesta.status,
        ms: fantasma.ms,
      })

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

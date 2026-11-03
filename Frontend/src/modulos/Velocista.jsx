import { useState } from 'react'
import Cronometro from '../Cronometro'
import { API_URL } from './api'

// Arena de entrada del taller. El estudiante solo necesita tener su backend
// respondiendo: el modulo mide cuanto tarda el GET, guarda cada intento,
// corre tandas seguidas y compara rutas distintas (lista, detalle y una
// inexistente) para mostrar como viaja el request cuando las cosas van bien
// y cuando el servidor contesta un 404 controlado.
//
// Con la ficha de respuesta se aprovecha para enseñar la anatomia HTTP
// (codigo, duracion, tamano y contenido de la respuesta).
async function medirConsulta() {
  const inicio = performance.now()
  const respuesta = await fetch(API_URL)
  const texto = await respuesta.text()
  const ms = Math.round(performance.now() - inicio)

  let datos
  try {
    datos = JSON.parse(texto)
  } catch {
    throw new Error('El servidor respondió algo que no es JSON')
  }
  if (!respuesta.ok) throw new Error(`El servidor contestó HTTP ${respuesta.status}`)

  return {
    codigo: respuesta.status,
    ms,
    tareas: Array.isArray(datos) ? datos.length : null,
    bytes: texto.length,
  }
}

function Velocista() {
  const [ms, setMs] = useState(0)
  const [intentos, setIntentos] = useState([])
  const [ficha, setFicha] = useState(null)
  const [error, setError] = useState(null)
  const [repeticiones, setRepeticiones] = useState(3)
  const [corriendo, setCorriendo] = useState(false)
  const [comparativa, setComparativa] = useState([])
  const [comparando, setComparando] = useState(false)

  const maxIntentos = 50
  const valores = intentos.map((intento) => intento.ms)
  const mejor = valores.length ? Math.min(...valores) : null
  const peor = valores.length ? Math.max(...valores) : null
  const promedio = valores.length
    ? Math.round(valores.reduce((a, b) => a + b, 0) / valores.length)
    : null

  // Un intento a la vez. mide y anota; serve de base para la tanda.
  async function lanzarUna() {
    setError(null)
    setMs(null) // deja el cronometro contando
    const resultado = await medirConsulta()
    setMs(resultado.ms)
    setFicha(resultado)
    setIntentos((lista) =>
      lista.concat({
        numero: lista.length + 1,
        ms: resultado.ms,
        codigo: resultado.codigo,
      })
    )
  }

  async function lanzarTanda() {
    if (corriendo) return
    setCorriendo(true)
    try {
      for (let i = 0; i < repeticiones; i += 1) {
        await lanzarUna()
      }
    } catch (falla) {
      setError(`La consulta no llego. ¿El backend esta corriendo? Detalle: ${falla.message}`)
    } finally {
      setCorriendo(false)
    }
  }

  // Compara rutas distintas: el mismo backend contestando una lista, un
  // detalle y un recurso que no existe. La inexistente crea una tarea
  // de contraste solo si la base de datos esta vacia, y la deja como estaba.
  async function compararRutas() {
    if (comparando) return
    setComparando(true)
    setComparativa([])

    const filas = []
    let tareaDeContraste = null

    async function medirRuta(nombre, ruta, nota) {
      const inicio = performance.now()
      try {
        const respuesta = await fetch(ruta)
        const texto = await respuesta.text()
        return {
          nombre,
          ruta,
          nota,
          ms: Math.round(performance.now() - inicio),
          codigo: respuesta.status,
          bytes: texto.length,
        }
      } catch (falla) {
        return {
          nombre,
          ruta,
          nota,
          ms: Math.round(performance.now() - inicio),
          codigo: 'sin respuesta',
          bytes: null,
          detalle: falla.message,
        }
      }
    }

    // 1. La lista completa.
    filas.push(await medirRuta('Lista completa', API_URL, 'ruta de la coleccion: GET /api/tareas/'))
    setComparativa([...filas])

    // 2. El detalle de un recurso: se crea una tarea si no hay ninguna,
    //    se consulta y luego se elimina para no ensuciar la base de datos.
    let lista = []
    try {
      lista = await (await fetch(API_URL)).json()
    } catch {
      lista = []
    }
    if (!lista.length) {
      const creacion = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo: 'Tarea de contraste del velocista' }),
      })
      tareaDeContraste = await creacion.json()
      filas.push(await medirRuta('Detalle', `${API_URL}${tareaDeContraste.id}/`, 'un solo recurso: GET /api/tareas/{id}/'))
      await fetch(`${API_URL}${tareaDeContraste.id}/`, { method: 'DELETE' })
    } else {
      filas.push(await medirRuta('Detalle', `${API_URL}${lista[0].id}/`, 'un solo recurso: GET /api/tareas/{id}/'))
    }
    setComparativa([...filas])

    // 3. Un recurso que no existe: error controlado del servidor (404).
    filas.push(await medirRuta('Recurso inexistente', `${API_URL}999999/`, 'el servidor contesto un error controlado'))
    setComparativa([...filas])

    setComparando(false)
  }

  return (
    <section>
      <Cronometro ms={ms} etiqueta="GET /api/tareas/" />

      <div className="fila-acciones">
        <label className="celda-suave">
          Consultas por tanda:
          <input
            type="number"
            min={1}
            max={maxIntentos}
            className="campo-numero"
            value={repeticiones}
            onChange={(e) => setRepeticiones(Math.min(maxIntentos, Math.max(1, Number(e.target.value) || 1)))}
          />
        </label>
        <button className="boton" onClick={lanzarTanda} disabled={corriendo}>
          {corriendo ? 'Corriendo tanda...' : 'Lanzar tanda de consultas'}
        </button>
      </div>

      {error && <div className="aviso" data-tipo="error">{error}</div>}

      <div className="bloque">
        <h4 className="bloque-titulo">Comparativa de rutas</h4>
        <div className="fila-acciones">
          <button className="boton" onClick={compararRutas} disabled={comparando}>
            {comparando ? 'Comparando...' : 'Comparar rutas del backend'}
          </button>
          <span className="celda-suave">
            la misma API contestando una lista, un detalle y un recurso inexistente
          </span>
        </div>
        {comparativa.length > 0 && (
          <table className="tabla" style={{ marginTop: 12 }}>
            <thead>
              <tr>
                <th>Ruta</th>
                <th className="numero">ms</th>
                <th className="numero">codigo</th>
                <th className="numero">bytes</th>
                <th>Nota</th>
              </tr>
            </thead>
            <tbody>
              {comparativa.map((fila, i) => (
                <tr key={i}>
                  <td>{fila.nombre}</td>
                  <td className="numero">{fila.ms}</td>
                  <td className="numero">{fila.codigo}</td>
                  <td className="numero">{fila.bytes ?? '-'}</td>
                  <td className="celda-suave">{fila.detalle || fila.nota}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {ficha && (
        <div className="bloque">
          <h4 className="bloque-titulo">Ficha de la ultima respuesta</h4>
          <div className="resumen-stats">
            <span className="stat">
              <span className="stat-valor">{ficha.codigo}</span>
              <span className="stat-etiqueta">codigo HTTP</span>
            </span>
            <span className="stat">
              <span className="stat-valor">{ficha.ms}</span>
              <span className="stat-etiqueta">ms de viaje</span>
            </span>
            <span className="stat">
              <span className="stat-valor">{ficha.tareas}</span>
              <span className="stat-etiqueta">tareas en el JSON</span>
            </span>
            <span className="stat">
              <span className="stat-valor">{ficha.bytes}</span>
              <span className="stat-etiqueta">bytes transportados</span>
            </span>
          </div>
        </div>
      )}

      {intentos.length > 0 && (
        <div className="bloque">
          <h4 className="bloque-titulo">Historial de intentos</h4>
          <table className="tabla">
            <thead>
              <tr>
                <th>Intento</th>
                <th className="numero">ms</th>
                <th className="numero">vs mejor</th>
              </tr>
            </thead>
            <tbody>
              {intentos.map((intento) => (
                <tr className={intento.ms === mejor ? 'fila-mejor' : ''} key={intento.numero}>
                  <td>#{intento.numero}</td>
                  <td className="numero">{intento.ms}</td>
                  <td className="numero">
                    {intento.ms === mejor ? 'el mejor' : `+${intento.ms - mejor} ms`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="resumen-stats" style={{ marginTop: 12 }}>
            <span className="stat">
              <span className="stat-valor">{mejor}</span>
              <span className="stat-etiqueta">mejor (ms)</span>
            </span>
            <span className="stat">
              <span className="stat-valor">{promedio}</span>
              <span className="stat-etiqueta">promedio (ms)</span>
            </span>
            <span className="stat">
              <span className="stat-valor">{peor}</span>
              <span className="stat-etiqueta">peor (ms)</span>
            </span>
            <span className="stat">
              <span className="stat-valor">{intentos.length}</span>
              <span className="stat-etiqueta">intentos corridos</span>
            </span>
          </div>
        </div>
      )}
    </section>
  )
}

export default Velocista

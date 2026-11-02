import { useState } from 'react'
import { API_URL, asegurar } from './api'

// Arena final del dia 3: cinco asaltos seguidos, un verbo HTTP por asalto.
// El modulo hace las llamadas y mide; el estudiante debe entender cada una.
// El tablero guarda los registros del salon en el navegador (localStorage),
// con el nombre del corredor y el mejor tiempo total arriba de todo.
const CLAVE_TABLERO = 'taller-pentatlon-registros'

function leerTablero() {
  const guardado = localStorage.getItem(CLAVE_TABLERO)
  if (!guardado) return []
  try {
    return JSON.parse(guardado)
  } catch {
    return []
  }
}

function guardarEnTablero(registro) {
  const registros = leerTablero()
    .concat(registro)
    .sort((a, b) => a.total - b.total)
    .slice(0, 10)
  localStorage.setItem(CLAVE_TABLERO, JSON.stringify(registros))
  return registros
}

// Cada asalto mide los ms, reporta el codigo HTTP y deja una linea que
// describe la llamada, para poder repasarla despues del asalto.
async function medirAsalto(nombre, verbo, ruta, accion) {
  const inicio = performance.now()
  try {
    const resultado = await accion()
    return {
      nombre,
      verbo,
      ruta,
      ms: Math.round(performance.now() - inicio),
      ok: true,
      texto: resultado.texto,
      codigo: resultado.codigo,
    }
  } catch (falla) {
    return {
      nombre,
      verbo,
      ruta,
      ms: Math.round(performance.now() - inicio),
      ok: false,
      texto: falla.message,
      codigo: 'fallo',
    }
  }
}

function Pentatlon() {
  const [corredor, setCorredor] = useState('')
  const [corriendo, setCorriendo] = useState(false)
  const [asaltos, setAsaltos] = useState([])
  const [total, setTotal] = useState(null)
  const [tablero, setTablero] = useState(leerTablero())

  const lider = tablero[0]

  async function correrPentatlon() {
    if (corriendo) return
    const nombre = corredor.trim() || 'corredor anonimo'
    setCorriendo(true)
    setAsaltos([])
    setTotal(null)

    const registro = []
    let idTarea = null
    let falloDuro = false

    // Asalto 1: POST crea la tarea que usan los asaltos siguientes.
    registro.push(
      await medirAsalto(
        'Crear',
        'POST',
        '/api/tareas/',
        async () => {
          const respuesta = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ titulo: `Tarea pentatlon de ${nombre}` }),
          })
          await asegurar(respuesta)
          const datos = await respuesta.json()
          idTarea = datos.id
          return { codigo: respuesta.status, texto: `crea la tarea id ${datos.id}` }
        }
      )
    )
    if (!idTarea) falloDuro = true
    setAsaltos([...registro])

    if (!falloDuro) {
      // Asalto 2: GET lista todo.
      registro.push(
        await medirAsalto('Listar', 'GET', '/api/tareas/', async () => {
          const respuesta = await fetch(API_URL)
          await asegurar(respuesta)
          const lista = await respuesta.json()
          return { codigo: respuesta.status, texto: `${lista.length} tareas en el JSON` }
        })
      )

      // Asalto 3: PATCH la completa.
      registro.push(
        await medirAsalto('Completar', 'PATCH', `/api/tareas/${idTarea}/`, async () => {
          const respuesta = await fetch(`${API_URL}${idTarea}/`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completada: true }),
          })
          await asegurar(respuesta)
          return { codigo: respuesta.status, texto: 'completada = true' }
        })
      )

      // Asalto 4: PUT reemplaza el titulo.
      registro.push(
        await medirAsalto('Editar', 'PUT', `/api/tareas/${idTarea}/`, async () => {
          const respuesta = await fetch(`${API_URL}${idTarea}/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ titulo: `Tarea pentatlon de ${nombre} (editada)` }),
          })
          await asegurar(respuesta)
          return { codigo: respuesta.status, texto: 'titulo reemplazado' }
        })
      )

      // Asalto 5: DELETE la saca de la base de datos.
      registro.push(
        await medirAsalto('Eliminar', 'DELETE', `/api/tareas/${idTarea}/`, async () => {
          const respuesta = await fetch(`${API_URL}${idTarea}/`, { method: 'DELETE' })
          await asegurar(respuesta)
          return { codigo: respuesta.status, texto: 'fuera de PostgreSQL' }
        })
      )
      setAsaltos([...registro])
    }

    setAsaltos([...registro])

    const suma = registro.reduce((acu, asalto) => acu + asalto.ms, 0)
    setTotal(suma)

    // Solo sube al tablero quien completo los cinco asaltos.
    if (!falloDuro) {
      setTablero(guardarEnTablero({ nombre, total: suma, fecha: new Date().toLocaleString() }))
    }
    setCorriendo(false)
  }

  return (
    <section>
      <div className="bloque">
        <h4 className="bloque-titulo">El corredor</h4>
        <div className="fila-acciones">
          <input
            className="campo-texto"
            placeholder="Nombre del corredor o del equipo"
            value={corredor}
            onChange={(e) => setCorredor(e.target.value)}
          />
          <button className="boton" onClick={correrPentatlon} disabled={corriendo}>
            {corriendo ? 'Corriendo...' : 'Correr el pentatlon'}
          </button>
        </div>
        <p className="pentatlon-condicion">
          Un boton lanza los cinco asaltos: POST crea, GET lista, PATCH
          completa, PUT edita y DELETE elimina. Si el POST falla, la carrera
          se corta y no entra al tablero.
        </p>
      </div>

      {total !== null && (
        <div className="bloque">
          <h4 className="bloque-titulo">Detalle de los asaltos</h4>
          <table className="tabla">
            <thead>
              <tr>
                <th>Asalto</th>
                <th>Llamada</th>
                <th className="numero">ms</th>
                <th>Resultado</th>
              </tr>
            </thead>
            <tbody>
              {asaltos.map((asalto, i) => (
                <tr key={i}>
                  <td>
                    {asalto.nombre}
                    <div className="asalto-estado" data-ok={asalto.ok}>
                      {asalto.ok ? 'hecho' : 'fallo'}
                    </div>
                  </td>
                  <td className="celda-suave">
                    {asalto.verbo} {asalto.ruta}
                  </td>
                  <td className="numero">{asalto.ms}</td>
                  <td className="celda-suave">
                    {asalto.texto} · HTTP {asalto.codigo}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="pentatlon-condicion" style={{ marginTop: 10 }}>
            Tiempo total: <strong>{total} ms</strong>
          </p>
        </div>
      )}

      <div className="bloque">
        <h4 className="bloque-titulo">Tablero del salon</h4>
        {tablero.length === 0 ? (
          <p className="celda-suave">
            Todavia no hay registros: el primer corredor que complete la arena
            abre el tablero.
          </p>
        ) : (
          <table className="tabla">
            <thead>
              <tr>
                <th>#</th>
                <th>Corredor</th>
                <th className="numero">Total</th>
                <th>Cuando</th>
              </tr>
            </thead>
            <tbody>
              {tablero.map((reg, i) => (
                <tr className={i === 0 ? 'fila-mejor' : ''} key={i}>
                  <td>{i + 1}</td>
                  <td>{reg.nombre}</td>
                  <td className="numero">{reg.total} ms</td>
                  <td className="celda-suave">{reg.fecha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {lider && (
          <p className="pentatlon-condicion">
            El lider del tablero es <strong>{lider.nombre}</strong> con{' '}
            {lider.total} ms.
          </p>
        )}
      </div>
    </section>
  )
}

export default Pentatlon
